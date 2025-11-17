import type { UserStats, UserAnswer } from '../types';

const STORAGE_KEY = 'little_toeic_stats';

export const storageService = {
  // Get user stats from localStorage
  getStats(): UserStats {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      totalAttempts: 0,
      correctAnswers: 0,
      streak: 0,
      lastAttemptDate: '',
      history: [],
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
    
    this.saveStats(stats);
  },

  // Check if user has already answered today
  hasAnsweredToday(): boolean {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    return stats.history.some(h => h.date === today);
  },

  // Get today's answer
  getTodayAnswer(): UserAnswer | null {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    return stats.history.find(h => h.date === today) || null;
  },

  // Clear all data
  clearStats(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
