from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Choice(BaseModel):
    """Multiple choice option"""
    id: str = Field(..., description="Choice identifier (A, B, C, D)")
    text: str = Field(..., description="Choice text")


class Problem(BaseModel):
    """Single TOEIC problem"""
    id: int = Field(..., description="Problem ID")
    type: str = Field(..., description="Problem type (e.g., 'grammar', 'vocabulary')")
    question: str = Field(..., description="Question text or sentence with blank")
    choices: List[Choice] = Field(..., description="Answer choices")
    correct_answer: str = Field(..., description="Correct answer ID (A, B, C, D)")
    explanation: Optional[str] = Field(None, description="Explanation for the answer")


class ProblemResponse(BaseModel):
    """Response for problem endpoints"""
    date: str = Field(..., description="Problem date (YYYY-MM-DD)")
    problem: Problem = Field(..., description="Problem data")


class HealthResponse(BaseModel):
    """Response for health check endpoints"""
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")
    timestamp: datetime = Field(..., description="Current timestamp")


class APIResponse(BaseModel):
    """Standard API response structure"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
