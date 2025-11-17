# Little TOEIC - 배포 가이드

## 프론트엔드 배포 (Vercel)

### 1. Vercel 프로젝트 생성
```bash
# Vercel CLI 설치
npm i -g vercel

# 프론트엔드 디렉토리에서 실행
cd frontend
vercel
```

### 2. 환경 변수 설정
Vercel Dashboard에서 다음 환경 변수 설정:
- `VITE_API_URL`: Railway 백엔드 URL (예: https://your-app.railway.app)

### 3. 빌드 설정
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 백엔드 배포 (Railway)

### 1. Railway 프로젝트 생성
1. https://railway.app/ 접속
2. "New Project" 클릭
3. GitHub 저장소 연결 또는 "Empty Project" 선택

### 2. 환경 변수 설정
Railway Dashboard에서 다음 환경 변수 설정:
- `PORT`: 8000
- `ALLOWED_ORIGINS`: Vercel 프론트엔드 URL (예: https://your-app.vercel.app)

### 3. 빌드 설정
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Root Directory: `backend`

### 4. 도메인 설정
Railway에서 자동으로 생성된 도메인을 사용하거나 커스텀 도메인 설정

---

## 로컬 개발 환경

### 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

프론트엔드: http://localhost:5173
백엔드: http://localhost:8000
API Docs: http://localhost:8000/docs

---

## 문제 데이터 추가

새로운 날짜의 문제를 추가하려면 `backend/data/problems/` 디렉토리에 `YYYY-MM-DD.json` 형식으로 파일 생성:

```json
{
  "date": "2025-11-19",
  "problem": {
    "id": 3,
    "type": "grammar",
    "question": "문제 내용...",
    "choices": [
      {"id": "A", "text": "선택지 1"},
      {"id": "B", "text": "선택지 2"},
      {"id": "C", "text": "선택지 3"},
      {"id": "D", "text": "선택지 4"}
    ],
    "correct_answer": "A",
    "explanation": "해설..."
  }
}
```
