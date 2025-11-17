import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import type { ProblemResponse } from '../types';

export default function ProblemPage() {
  const [problem, setProblem] = useState<ProblemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadRandomProblem();
  }, []);

  const loadRandomProblem = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRandomProblem();
      setProblem(data);
      setError(null);
      
      // 이미 푼 문제인지 확인
      const previousAnswer = storageService.getProblemAnswer(data.problem.id);
      if (previousAnswer) {
        setSelectedAnswer(previousAnswer.selectedAnswer);
        setSubmitted(true);
        setShowExplanation(true);
      } else {
        setSelectedAnswer(null);
        setSubmitted(false);
        setShowExplanation(false);
      }
    } catch (err) {
      setError('문제를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !problem) return;

    const isCorrect = selectedAnswer === problem.problem.correct_answer;
    
    storageService.addAnswer({
      problemId: problem.problem.id,
      selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
    });

    setSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextProblem = () => {
    loadRandomProblem();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">문제를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || '문제를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === problem.problem.correct_answer;
  const stats = storageService.getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">토익 RC 문제</h1>
            <div className="text-sm text-gray-600">
              문제 #{problem.problem.id}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {problem.problem.type}
            </span>
            <span className="text-sm text-gray-600">
              풀이 완료: {stats.solvedProblems.length}개
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">문제</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{problem.problem.question}</p>
        </div>

        {/* Choices */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">보기</h3>
          <div className="space-y-3">
            {problem.problem.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrectChoice = choice.id === problem.problem.correct_answer;
              
              let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
              
              if (submitted) {
                if (isCorrectChoice) {
                  buttonClass += 'border-green-500 bg-green-50 ';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-red-500 bg-red-50 ';
                } else {
                  buttonClass += 'border-gray-300 bg-gray-50 ';
                }
              } else {
                buttonClass += isSelected
                  ? 'border-blue-500 bg-blue-50 '
                  : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 ';
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => !submitted && setSelectedAnswer(choice.id)}
                  disabled={submitted}
                  className={buttonClass}
                >
                  <span className="font-semibold text-gray-700">{choice.id}.</span>
                  <span className="ml-3 text-gray-800">{choice.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors shadow-md"
          >
            제출하기
          </button>
        )}

        {/* Next Problem Button */}
        {submitted && (
          <button
            onClick={handleNextProblem}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg
                     hover:bg-green-700 transition-colors shadow-md"
          >
            다음 문제 →
          </button>
        )}

        {/* Result */}
        {submitted && (
          <div className={`rounded-lg shadow-md p-6 mb-6 ${
            isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <h3 className={`text-xl font-bold mb-2 ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? '✓ 정답입니다!' : '✗ 오답입니다.'}
            </h3>
            <p className="text-gray-700">
              정답: <span className="font-semibold">{problem.problem.correct_answer}</span>
            </p>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && problem.problem.explanation && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">해설</h3>
            <p className="text-gray-700 leading-relaxed">{problem.problem.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
