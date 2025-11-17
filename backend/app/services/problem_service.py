import json
from pathlib import Path
import random
from typing import List

from app.models import ProblemResponse, Problem, Choice


# JSON 파일 경로
DATA_DIR = Path(__file__).parent.parent.parent / "data"
PROBLEMS_FILE = DATA_DIR / "problems.json"


class ProblemService:
    """문제 데이터 관리 서비스"""
    
    def __init__(self):
        self._ensure_data_dir()
        self._problems_cache: List[dict] = []
    
    def _ensure_data_dir(self):
        """데이터 디렉토리 생성"""
        DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    def _load_problems(self) -> List[dict]:
        """JSON 파일에서 전체 문제 로드"""
        if self._problems_cache:
            return self._problems_cache
            
        if not PROBLEMS_FILE.exists():
            return []
        
        with open(PROBLEMS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self._problems_cache = data.get('problems', [])
        
        return self._problems_cache
    
    def get_random_problem(self) -> ProblemResponse:
        """랜덤 문제 반환"""
        problems = self._load_problems()
        
        if not problems:
            raise FileNotFoundError("No problems available")
        
        problem_data = random.choice(problems)
        
        # JSON 데이터를 Pydantic 모델로 변환
        choices = [Choice(**choice) for choice in problem_data['choices']]
        problem = Problem(
            id=problem_data['id'],
            type=problem_data['type'],
            question=problem_data['question'],
            choices=choices,
            correct_answer=problem_data['correct_answer'],
            explanation=problem_data.get('explanation')
        )
        
        return ProblemResponse(problem=problem)
    
    def get_problem_by_id(self, problem_id: int) -> ProblemResponse:
        """특정 ID의 문제 반환"""
        problems = self._load_problems()
        
        problem_data = next((p for p in problems if p['id'] == problem_id), None)
        
        if not problem_data:
            raise FileNotFoundError(f"Problem with id {problem_id} not found")
        
        # JSON 데이터를 Pydantic 모델로 변환
        choices = [Choice(**choice) for choice in problem_data['choices']]
        problem = Problem(
            id=problem_data['id'],
            type=problem_data['type'],
            question=problem_data['question'],
            choices=choices,
            correct_answer=problem_data['correct_answer'],
            explanation=problem_data.get('explanation')
        )
        
        return ProblemResponse(problem=problem)


# 싱글톤 인스턴스
problem_service = ProblemService()
