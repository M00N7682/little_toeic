# Little TOEIC

매일 새로운 토익 RC 문제를 제공하는 웹 서비스
https://liltoeic.ddstudio.co.kr/

## 프로젝트 개요
- **컨셉**: 로그인 없이 즉시 학습 가능한 토익 문제 풀이 플랫폼
- **타겟**: 대학생, 취준생, 직장인 (하루 5~10문제)
- **핵심 가치**: 간편함, 랜덤 문제 제공, 모바일 최적화

## 기술 스택
### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- axios

### Backend
- FastAPI (Python 3.11)
- pydantic
- Uvicorn

### 배포
- Frontend: Vercel
- Backend: Railway

## 폴더 구조
```
little_toeic/
├── frontend/          # React + Vite 프론트엔드
├── backend/           # FastAPI 백엔드
└── toeic_site_docs/   # 프로젝트 기획/요구사항 문서
```

## 바로 시작하기
https://liltoeic.ddstudio.co.kr/

## 로컬에서 시작하기
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API 엔드포인트
- `GET /api/problems/today` - 오늘의 문제
- `GET /api/problems/{date}` - 특정 날짜 문제
- `GET /api/health` - 서버 상태 확인

## 문서
자세한 기획 및 요구사항은 `toeic_site_docs/` 폴더를 참고하세요.

## 라이센스
MIT
