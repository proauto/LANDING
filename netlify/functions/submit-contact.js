const { createClient } = require('@supabase/supabase-js');

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