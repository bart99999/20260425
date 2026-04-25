-- KB금융그룹 고객 문의 자동 분류 시스템 - Supabase 초기 설정 스크립트
-- 이 내용을 복사하여 Supabase SQL Editor에서 실행하세요.

-- 1. 기존 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS inquiries CASCADE;

-- 2. 문의 내역 테이블 생성
CREATE TABLE inquiries (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT now(),
    customer_name text NOT NULL,
    inquiry text NOT NULL,
    category text,
    urgency text,
    summary text,
    department text,
    script text
);

-- 3. Row Level Security(RLS) 비활성화 (학습용/테스트용)
-- 실제 운영 환경에서는 별도의 정책(Policy) 설정이 필요합니다.
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- 실행 방법:
-- 1. Supabase Dashboard에 접속 (https://supabase.com/dashboard)
-- 2. 프로젝트 선택 -> SQL Editor 메뉴 클릭
-- 3. 'New query' 생성 후 이 파일의 내용을 붙여넣기
-- 4. 'Run' 버튼 클릭
