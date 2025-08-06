# PreVIT 랜딩 페이지 배포 가이드

## 1. Supabase 설정

### 1.1 Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 이름: `previt-landing`
3. 데이터베이스 비밀번호 설정

### 1.2 데이터베이스 테이블 생성
1. Supabase Dashboard → SQL Editor 이동
2. `supabase-setup.sql` 파일 내용을 복사하여 실행
3. 테이블 생성 완료 확인

### 1.3 API 키 확인
- Settings → API → Project URL 및 anon public key 복사

## 2. Netlify 배포

### 2.1 Netlify 계정 및 사이트 생성
1. [netlify.com](https://netlify.com)에서 계정 생성
2. "New site from Git" 선택
3. GitHub 저장소 연결 (또는 수동 배포)

### 2.2 환경변수 설정
Netlify Dashboard → Site settings → Environment variables에서 추가:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

### 2.3 빌드 설정
- Build command: `echo 'Static site - no build needed'`
- Publish directory: `.` (루트 디렉토리)
- Functions directory: `netlify/functions`

## 3. 로컬 개발 환경 설정

### 3.1 의존성 설치
```bash
npm install
```

### 3.2 Netlify CLI 설치 및 로그인
```bash
npm install -g netlify-cli
netlify login
```

### 3.3 로컬 개발 서버 실행
```bash
netlify dev
```

### 3.4 환경변수 설정 (.env 파일 생성)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. 배포 확인

### 4.1 기능 테스트
1. 사이트 접속 확인
2. 연락처 폼 제출 테스트
3. Supabase 데이터베이스에 데이터 저장 확인

### 4.2 성능 최적화 확인
- 이미지 로딩 속도
- 캐싱 설정 동작
- 모바일 반응형 디자인

## 5. 문제 해결

### 5.1 함수 실행 오류
- Netlify Functions 로그 확인: `netlify functions:list`
- 환경변수 설정 확인

### 5.2 CORS 오류
- `netlify.toml`의 CSP 설정 확인
- Supabase URL이 허용 목록에 있는지 확인

### 5.3 폼 제출 실패
- 네트워크 탭에서 API 요청 상태 확인
- Supabase RLS 정책 확인

## 6. 추가 기능

### 6.1 이메일 알림 (선택사항)
Supabase Database Webhooks 또는 Edge Functions를 사용하여 새 연락처 제출 시 이메일 발송

### 6.2 관리자 패널 (선택사항)
Supabase Dashboard를 통한 연락처 관리 또는 별도 관리자 페이지 구축

### 6.3 분석 도구 연동 (선택사항)
Google Analytics 또는 기타 분석 도구 추가

## 7. 보안 체크리스트

- [x] CSP 헤더 설정
- [x] XSS 방지 헤더
- [x] 입력 데이터 검증
- [x] SQL 인젝션 방지 (Supabase ORM 사용)
- [x] HTTPS 강제 사용
- [x] 환경변수로 민감 정보 관리