import { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import type { UserStats } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const userStats = storageService.getStats();
    setStats(userStats);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">통계를 불러오는 중...</div>
      </div>
    );
  }

  const accuracy = stats.totalAttempts > 0
    ? ((stats.correctAnswers / stats.totalAttempts) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">대시보드</h1>
          <p className="text-gray-600">나의 학습 통계를 확인하세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">총 시도 횟수</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalAttempts}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">정답 횟수</div>
            <div className="text-3xl font-bold text-green-600">{stats.correctAnswers}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">정답률</div>
            <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">연속 학습</div>
            <div className="text-3xl font-bold text-orange-600">{stats.streak}일</div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">최근 학습 기록</h2>
          
          {stats.history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 학습 기록이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {stats.history.slice().reverse().slice(0, 10).map((record, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    record.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {record.date}
                      </div>
                      <div className="text-sm text-gray-600">
                        문제 #{record.problemId} • 선택: {record.selectedAnswer}
                      </div>
                    </div>
                    <div className={`text-2xl ${
                      record.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (window.confirm('모든 학습 기록을 삭제하시겠습니까?')) {
              storageService.clearStats();
              setStats(storageService.getStats());
            }
          }}
          className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                   hover:bg-red-700 transition-colors shadow-md"
        >
          기록 초기화
        </button>
      </div>
    </div>
  );
}
