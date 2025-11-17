from fastapi import APIRouter, HTTPException
from app.services.problem_service import problem_service
from app.models import ProblemResponse

router = APIRouter()


@router.get("/problems/random", response_model=ProblemResponse)
async def get_random_problem():
    """Get a random TOEIC problem"""
    try:
        problem = problem_service.get_random_problem()
        return problem
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/problems/{problem_id}", response_model=ProblemResponse)
async def get_problem_by_id(problem_id: int):
    """
    Get TOEIC problem by ID
    
    Args:
        problem_id: Problem ID
    """
    try:
        problem = problem_service.get_problem_by_id(problem_id)
        return problem
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
