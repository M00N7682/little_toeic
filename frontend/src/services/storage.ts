import type { UserStats, UserAnswer } from '../types';

const STORAGE_KEY = 'little_toeic_stats';

export const storageService = {
  // Get user stats from localStorage
  getStats(): UserStats {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 이전 버전과의 호환성
      if (!parsed.solvedProblems) {
        parsed.solvedProblems = [];
      }
      return parsed;
    }
    return {
      totalAttempts: 0,
      correctAnswers: 0,
      streak: 0,
      lastAttemptDate: '',
      history: [],
      solvedProblems: [],
    };
  },

  // Save user stats to localStorage
  saveStats(stats: UserStats): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  },

  // Add new answer
  addAnswer(answer: UserAnswer): void {
    const stats = this.getStats();
    
    // Update stats
    stats.totalAttempts += 1;
    if (answer.isCorrect) {
      stats.correctAnswers += 1;
    }
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (stats.lastAttemptDate === yesterday) {
      stats.streak += 1;
    } else if (stats.lastAttemptDate !== today) {
      stats.streak = 1;
    }
    
    stats.lastAttemptDate = today;
    
    // Add to history
    stats.history.push(answer);
    
    // Add to solved problems
    if (!stats.solvedProblems.includes(answer.problemId)) {
      stats.solvedProblems.push(answer.problemId);
    }
    
    this.saveStats(stats);
  },

  // Check if problem is already solved
  isProblemSolved(problemId: number): boolean {
    const stats = this.getStats();
    return stats.solvedProblems.includes(problemId);
  },

  // Get answer for specific problem
  getProblemAnswer(problemId: number): UserAnswer | null {
    const stats = this.getStats();
    return stats.history.find(h => h.problemId === problemId) || null;
  },

  // Clear all data
  clearStats(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
