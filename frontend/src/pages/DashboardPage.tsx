import { useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { apiService } from '../services/api';
import type { UserStats, UserAnswer, Problem } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedProblemId, setExpandedProblemId] = useState<number | null>(null);
  const [problemDetails, setProblemDetails] = useState<Map<number, Problem>>(new Map());

  useEffect(() => {
    const userStats = storageService.getStats();
    setStats(userStats);
  }, []);

  const loadProblemDetail = async (problemId: number) => {
    if (problemDetails.has(problemId)) {
      return;
    }
    
    try {
      const response = await apiService.getProblemById(problemId);
      setProblemDetails(prev => new Map(prev).set(problemId, response.problem));
    } catch (err) {
      console.error('Failed to load problem details:', err);
    }
  };

  const toggleProblemDetail = (problemId: number) => {
    if (expandedProblemId === problemId) {
      setExpandedProblemId(null);
    } else {
      setExpandedProblemId(problemId);
      loadProblemDetail(problemId);
    }
  };

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

  // Filter history
  const filteredHistory = stats.history.filter(record => {
    if (filter === 'correct') return record.isCorrect;
    if (filter === 'incorrect') return !record.isCorrect;
    return true;
  });

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

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({stats.history.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'correct'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              정답 ({stats.correctAnswers})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'incorrect'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              오답 ({stats.totalAttempts - stats.correctAnswers})
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">최근 학습 기록</h2>
          
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 학습 기록이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {filteredHistory.slice().reverse().map((record, index) => {
                const isExpanded = expandedProblemId === record.problemId;
                const problemDetail = problemDetails.get(record.problemId);

                return (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {/* Record Header */}
                    <button
                      onClick={() => toggleProblemDetail(record.problemId)}
                      className={`w-full p-4 text-left transition-colors ${
                        record.isCorrect
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            문제 #{record.problemId}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            선택: {record.selectedAnswer} • 정답: {record.correctAnswer}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(record.timestamp).toLocaleString('ko-KR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${
                            record.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.isCorrect ? '✓' : '✗'}
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Problem Detail (Expanded) */}
                    {isExpanded && (
                      <div className="p-4 bg-white border-t">
                        {problemDetail ? (
                          <div className="space-y-4">
                            {/* Question */}
                            <div>
                              <div className="text-sm font-semibold text-gray-600 mb-2">문제</div>
                              <p className="text-gray-800">{problemDetail.question}</p>
                            </div>

                            {/* Choices */}
                            <div>
                              <div className="text-sm font-semibold text-gray-600 mb-2">보기</div>
                              <div className="space-y-2">
                                {problemDetail.choices.map(choice => (
                                  <div
                                    key={choice.id}
                                    className={`p-3 rounded border-2 ${
                                      choice.id === record.correctAnswer
                                        ? 'border-green-500 bg-green-50'
                                        : choice.id === record.selectedAnswer && !record.isCorrect
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    <span className="font-semibold">{choice.id}.</span>
                                    <span className="ml-2">{choice.text}</span>
                                    {choice.id === record.correctAnswer && (
                                      <span className="ml-2 text-green-600 font-semibold">✓ 정답</span>
                                    )}
                                    {choice.id === record.selectedAnswer && !record.isCorrect && (
                                      <span className="ml-2 text-red-600 font-semibold">✗ 선택</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Explanation */}
                            {problemDetail.explanation && (
                              <div>
                                <div className="text-sm font-semibold text-gray-600 mb-2">해설</div>
                                <p className="text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                                  {problemDetail.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            문제 상세 정보를 불러오는 중...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (window.confirm('모든 학습 기록을 삭제하시겠습니까?')) {
              storageService.clearStats();
              setStats(storageService.getStats());
              setProblemDetails(new Map());
              setExpandedProblemId(null);
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
