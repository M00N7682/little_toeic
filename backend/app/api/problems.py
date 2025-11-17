from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.services.problem_service import problem_service
from app.models import ProblemResponse

router = APIRouter()


@router.get("/problems/today", response_model=ProblemResponse)
async def get_today_problems():
    """Get today's TOEIC problem"""
    try:
        problem = problem_service.get_today_problem()
        return problem
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/problems/{problem_date}", response_model=ProblemResponse)
async def get_problems_by_date(problem_date: str):
    """
    Get TOEIC problem by date
    
    Args:
        problem_date: Date in YYYY-MM-DD format
    """
    try:
        # 날짜 형식 검증
        parsed_date = datetime.strptime(problem_date, "%Y-%m-%d").date()
        problem = problem_service.get_problem_by_date(parsed_date)
        return problem
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
