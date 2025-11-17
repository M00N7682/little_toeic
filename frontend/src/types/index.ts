// API Types
export interface Choice {
  id: string;
  text: string;
}

export interface Problem {
  id: number;
  type: string;
  question: string;
  choices: Choice[];
  correct_answer: string;
  explanation?: string;
}

export interface ProblemResponse {
  date: string;
  problem: Problem;
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

// Local Storage Types
export interface UserAnswer {
  date: string;
  problemId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface UserStats {
  totalAttempts: number;
  correctAnswers: number;
  streak: number;
  lastAttemptDate: string;
  history: UserAnswer[];
}
