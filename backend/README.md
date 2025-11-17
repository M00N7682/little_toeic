# Backend - Little TOEIC API

FastAPI 기반 토익 문제 제공 API

## 설치 및 실행

### 1. 가상환경 생성 및 활성화
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

### 2. 패키지 설치
```bash
pip install -r requirements.txt
```

### 3. 서버 실행
```bash
uvicorn app.main:app --reload
```

서버는 `http://localhost:8000`에서 실행됩니다.

## API 문서
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 프로젝트 구조
```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── models.py            # Pydantic 모델
│   ├── api/
│   │   └── problems.py      # 문제 관련 엔드포인트
│   ├── services/
│   │   └── problem_service.py  # 비즈니스 로직
│   └── data/
│       └── problems.json    # 문제 데이터
└── requirements.txt
```

## API 엔드포인트

### GET /api/health
서버 상태 확인

### GET /api/problems/today
오늘 날짜의 문제 반환

### GET /api/problems/{date}
특정 날짜의 문제 반환 (YYYY-MM-DD 형식)

## 문제 데이터 추가
`app/data/problems.json` 파일에 날짜별 문제를 추가할 수 있습니다.

```json
{
  "2025-11-17": [
    {
      "id": 1,
      "category": "RC",
      "question": "문제 내용...",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "answer": 0,
      "explanation": "해설..."
    }
  ]
}
```
