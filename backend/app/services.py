"""
Business logic for problem retrieval
"""
from pathlib import Path
from datetime import date, datetime
import json
from typing import Dict, Any

from app.models import ProblemResponse, Problem, Choice


def get_data_path() -> Path:
    """Get the path to the data directory"""
    return Path(__file__).parent.parent / "data" / "problems"


def load_problem_from_file(problem_date: date) -> ProblemResponse:
    """
    Load problem data from JSON file
    
    Args:
        problem_date: Date of the problem
        
    Returns:
        ProblemResponse object
        
    Raises:
        FileNotFoundError: If problem file doesn't exist
    """
    data_path = get_data_path()
    file_name = f"{problem_date.strftime('%Y-%m-%d')}.json"
    file_path = data_path / file_name
    
    if not file_path.exists():
        raise FileNotFoundError(f"Problem not found for date: {problem_date}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # JSON 데이터를 Pydantic 모델로 변환
    choices = [Choice(**choice) for choice in data['problem']['choices']]
    problem = Problem(
        id=data['problem']['id'],
        type=data['problem']['type'],
        question=data['problem']['question'],
        choices=choices,
        correct_answer=data['problem']['correct_answer'],
        explanation=data['problem'].get('explanation')
    )
    
    return ProblemResponse(
        date=data['date'],
        problem=problem
    )


def get_today_problem() -> ProblemResponse:
    """
    Get today's TOEIC problem
    
    Returns:
        ProblemResponse object for today
    """
    today = date.today()
    return load_problem_from_file(today)


def get_problem_by_date(problem_date: date) -> ProblemResponse:
    """
    Get TOEIC problem by specific date
    
    Args:
        problem_date: Date of the problem
        
    Returns:
        ProblemResponse object for the specified date
    """
    return load_problem_from_file(problem_date)
