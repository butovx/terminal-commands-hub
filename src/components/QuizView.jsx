import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../utils/quizData';
import { Brain, CheckCircle2, XCircle, RotateCcw, Award, Zap, HelpCircle } from 'lucide-react';

export default function QuizView({ onEarnXp, language = 'en', t }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);

      const finalScore = score + (selectedOption === currentQ.correct ? 1 : 0);
      const xpEarned = finalScore * 15 + (finalScore === QUIZ_QUESTIONS.length ? 50 : 0);
      const badgeId = finalScore === QUIZ_QUESTIONS.length ? 'quiz_ace' : null;

      onEarnXp(xpEarned, `Completed quiz with score ${finalScore}/${QUIZ_QUESTIONS.length}`, badgeId);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Quiz Header Banner */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            {t.quiz.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t.quiz.subtitle}
          </p>
        </div>
        {!quizFinished && (
          <div className="bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d] font-mono text-xs text-purple-400">
            {t.quiz.questionOf.replace('{{current}}', currentIndex + 1).replace('{{total}}', QUIZ_QUESTIONS.length)}
          </div>
        )}
      </div>

      {!quizFinished ? (
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl space-y-6 shadow-xl">
          
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-purple-400 font-bold px-2.5 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              {currentQ.category}
            </span>
            <h3 className="text-base font-bold text-white font-mono leading-relaxed pt-2">
              {language === 'ru' ? currentQ.questionRu : currentQ.questionEn}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-[#0d1117] border-[#30363d] text-gray-200 hover:border-purple-500/50';

              if (isAnswered) {
                if (idx === currentQ.correct) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-red-500/10 border-red-500 text-red-400';
                } else {
                  btnStyle = 'bg-[#0d1117]/50 border-[#30363d] text-gray-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border font-mono text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQ.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correct && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] text-xs text-gray-300 font-mono space-y-1 animate-fade-in">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> EXPLANATION:
              </div>
              <p className="text-gray-300 leading-relaxed">
                {language === 'ru' ? currentQ.explanationRu : currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                {currentIndex + 1 < QUIZ_QUESTIONS.length ? t.quiz.nextQuestion : t.quiz.finishQuiz}
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Finished Recap Card */
        <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono">{t.quiz.scoreTitle}</h3>
            <p className="text-sm text-gray-400 font-mono mt-1">
              {t.quiz.scoreSubtitle.replace('{{score}}', score).replace('{{total}}', QUIZ_QUESTIONS.length)}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400 font-bold">
            <Zap className="w-4 h-4 fill-emerald-400" />
            {t.quiz.earnedXp.replace('{{xp}}', score * 15 + (score === QUIZ_QUESTIONS.length ? 50 : 0))}
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-[#21262d] text-white border border-[#30363d] rounded-xl text-xs font-mono font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              {t.quiz.restartQuiz}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
