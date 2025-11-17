import json
from pathlib import Path
from datetime import date, datetime
from typing import Optional

from app.models import ProblemResponse, Problem, Choice


# JSON 파일 경로 (날짜별 파일)
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "problems"


class ProblemService:
    """문제 데이터 관리 서비스"""
    
    def __init__(self):
        self._ensure_data_dir()
    
    def _ensure_data_dir(self):
        """데이터 디렉토리 생성"""
        DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    def _load_problem_from_file(self, problem_date: date) -> ProblemResponse:
        """
        날짜별 JSON 파일에서 문제 데이터 로드
        
        Args:
            problem_date: 문제 날짜
            
        Returns:
            ProblemResponse 객체
            
        Raises:
            FileNotFoundError: 문제 파일이 없을 경우
        """
        file_name = f"{problem_date.strftime('%Y-%m-%d')}.json"
        file_path = DATA_DIR / file_name
        
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
    
    def get_today_problem(self) -> ProblemResponse:
        """오늘 날짜의 문제 반환"""
        today = date.today()
        return self._load_problem_from_file(today)
    
    def get_problem_by_date(self, problem_date: date) -> ProblemResponse:
        """특정 날짜의 문제 반환"""
        return self._load_problem_from_file(problem_date)


# 싱글톤 인스턴스
problem_service = ProblemService()
