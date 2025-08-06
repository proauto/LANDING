const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const { URL } = require('url');

// 슬랙 알림 전송 함수
async function sendSlackNotification(data) {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
        console.log('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
        return;
    }

    const message = {
        text: `새로운 문의가 접수되었습니다!\n이름: ${data.name}\n이메일: ${data.email}\n회사: ${data.company}\n연락처: ${data.phone}\n제안사항: ${data.proposal.substring(0, 100)}${data.proposal.length > 100 ? '...' : ''}\n접수시간: ${data.submittedAt}`
    };

    return new Promise((resolve, reject) => {
        const url = new URL(slackWebhookUrl);
        const payload = JSON.stringify(message);
        
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ status: res.statusCode, data });
                } else {
                    reject(new Error(`Slack API error: ${res.statusCode} ${res.statusMessage}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(payload);
        req.end();
    });
}

exports.handler = async (event, context) => {
    // CORS 헤더
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // POST 요청만 허용
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // 환경변수에서 Supabase 설정 가져오기
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

        console.log('Environment check:', {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            urlStart: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
        });

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase configuration missing');
        }

        // Supabase 클라이언트 초기화
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created successfully');

        // 요청 데이터 파싱
        const { name, email, company, phone, proposal } = JSON.parse(event.body);
        console.log('Received data:', { name, email, company, phone, proposal: proposal?.substring(0, 50) + '...' });

        // 필수 필드 검증
        if (!name || !email || !proposal) {
            console.log('Validation failed - missing required fields');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields: name, email, proposal' 
                })
            };
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid email format' 
                })
            };
        }

        // 데이터베이스에 연락처 정보 저장
        console.log('Attempting to insert data into Supabase...');
        const insertData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            company: company ? company.trim() : null,
            phone: phone ? phone.trim() : null,
            proposal: proposal.trim()
        };
        console.log('Insert data prepared:', insertData);

        const { data, error } = await supabase
            .from('contacts')
            .insert([insertData])
            .select();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to save contact information',
                    details: error.message
                })
            };
        }

        console.log('Data inserted successfully:', data);

        // 슬랙 알림 전송 (선택적)
        if (process.env.SLACK_WEBHOOK_URL) {
            try {
                await sendSlackNotification({
                    name: insertData.name,
                    email: insertData.email,
                    company: insertData.company || '미기입',
                    phone: insertData.phone || '미기입',
                    proposal: insertData.proposal,
                    submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
                });
                console.log('Slack notification sent successfully');
            } catch (slackError) {
                console.error('Slack notification failed:', slackError);
                // 슬랙 전송 실패해도 전체 프로세스는 성공으로 처리
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: '문의가 성공적으로 전송되었습니다.',
                id: data[0].id
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error' 
            })
        };
    }
};