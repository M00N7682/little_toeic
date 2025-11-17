from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.api import problems
from app.models import HealthResponse

app = FastAPI(
    title="Little TOEIC API",
    description="Daily TOEIC RC problems API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 구체적인 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(problems.router, prefix="/api", tags=["problems"])


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    return HealthResponse(
        status="ok",
        message="Little TOEIC API is running",
        timestamp=datetime.utcnow()
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        message="Service is healthy",
        timestamp=datetime.utcnow()
    )
