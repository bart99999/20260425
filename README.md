# KB금융그룹 고객 문의 자동 분류 시스템

이 프로젝트는 KB금융그룹 고객의 문의 내용을 Gemini AI(Gemini 3 Flash)를 사용하여 자동으로 분석하고 분류하여 데이터베이스(Supabase)에 저장하는 웹 애플리케이션입니다.

## 🛠 기술 스택
- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4
- **AI**: Gemini 3 Flash (@google/generative-ai)
- **Database**: Supabase
- **Icons**: Lucide React

## 🚀 로컬 실행 방법

1. **저장소 클론 및 패키지 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다.
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 🗄 Supabase 설정 (필수)

애플리케이션을 사용하기 전, Supabase에서 테이블을 생성해야 합니다.

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트를 생성합니다.
2. 왼쪽 메뉴의 **SQL Editor**를 클릭합니다.
3. **'New query'**를 생성합니다.
4. 프로젝트 루트에 있는 `supabase_setup.sql` 파일의 내용을 복사하여 붙여넣습니다.
5. **Run** 버튼을 클릭하여 실행합니다.

## 🌐 Vercel 배포 방법

1. GitHub 저장소에 코드를 Push합니다.
2. [Vercel Dashboard](https://vercel.com/dashboard)에서 **Add New -> Project**를 클릭합니다.
3. GitHub 저장소를 Import합니다.
4. **Environment Variables** 섹션에서 다음 3개의 변수를 추가합니다:
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. **Deploy** 버튼을 클릭합니다.

## 📝 주요 기능
- **문의 자동 분석**: Gemini AI가 카테고리, 긴급도, 요약, 담당부서, 응대 스크립트를 생성합니다.
- **긴급도별 색상 배지**: 높음(빨강), 보통(노랑), 낮음(초록)으로 시각화합니다.
- **데이터 저장 및 관리**: 분석 결과를 Supabase DB에 저장하고 이력을 조회할 수 있습니다.
- **CSV 다운로드**: 전체 문의 내역을 CSV 파일로 저장할 수 있습니다.
