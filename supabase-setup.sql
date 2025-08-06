-- Supabase 연락처 테이블 생성 스크립트
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- contacts 테이블 생성
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    proposal TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 공개 삽입 정책 (연락처 폼에서 데이터 삽입 허용)
CREATE POLICY "Anyone can insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

-- 관리자만 조회 가능한 정책 (선택사항)
-- CREATE POLICY "Only authenticated users can view contacts" ON contacts
--     FOR SELECT USING (auth.role() = 'authenticated');

-- 인덱스 생성 (성능 최적화)
CREATE INDEX contacts_created_at_idx ON contacts(created_at);
CREATE INDEX contacts_email_idx ON contacts(email);