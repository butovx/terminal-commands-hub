import React from 'react';
import { BADGES, getCurrentLevelInfo } from '../utils/gamification';
import { X, Award, Flame, Zap, Terminal, CheckCircle2, Flame as FlameIcon, UserCheck, LogIn, Cloud, Lock } from 'lucide-react';

export default function UserProfileModal({ userStats, authUser, onClose, onOpenAuth, onLogout, language = 'en', t }) {
  const levelInfo = getCurrentLevelInfo(userStats.xp);
  const currentLevelTitle = language === 'ru' ? levelInfo.current.titleRu : levelInfo.current.titleEn;
  const nextLevelTitle = levelInfo.next ? (language === 'ru' ? levelInfo.next.titleRu : levelInfo.next.titleEn) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#0d1117] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black flex items-center justify-center font-bold text-lg shadow-lg">
              {levelInfo.current.badge}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">{t.profile.title}</h3>
              <p className="text-xs text-emerald-400 font-mono">
                Level {levelInfo.current.level} • {currentLevelTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Cloud D1 Auth Banner */}
          <div className={`p-4 rounded-xl border font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            authUser
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <Cloud className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-white text-xs">
                  {authUser ? `🟢 ${language === 'ru' ? 'Аккаунт:' : 'Account:'} ${authUser.username}` : (language === 'ru' ? '🟡 Гостевой режим (localStorage)' : '🟡 Guest Mode (localStorage)')}
                </strong>
                <span className="text-[11px] opacity-80">
                  {authUser
                    ? (language === 'ru' ? 'Синхронизация с Cloudflare D1 активна' : 'Cloudflare D1 sync active')
                    : (language === 'ru' ? 'Войдите для сохранения прогресса на сервере' : 'Sign in to sync progress across devices')}
                </span>
              </div>
            </div>

            {authUser ? (
              <button
                onClick={() => { onClose(); onLogout(); }}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-bold transition-all text-xs whitespace-nowrap"
              >
                {t.auth.logout}
              </button>
            ) : (
              <button
                onClick={() => { onClose(); onOpenAuth(); }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:opacity-90 transition-all text-xs whitespace-nowrap flex items-center justify-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'ru' ? 'Войти / Создать аккаунт' : 'Sign In / Register'}</span>
              </button>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                {t.profile.xpLabel}: <strong className="text-white">{userStats.xp} XP</strong>
              </span>
              {levelInfo.next && (
                <span className="text-gray-400">
                  {levelInfo.xpInLevel} / {levelInfo.levelXpRequired} XP to Level {levelInfo.next.level}
                </span>
              )}
            </div>
            <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden border border-[#30363d]">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            {nextLevelTitle && (
              <p className="text-[11px] text-gray-400 font-mono text-right">
                Next Rank: <span className="text-emerald-400">{nextLevelTitle}</span>
              </p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-center">
              <FlameIcon className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-400" />
              <div className="text-sm font-bold text-white font-mono">{userStats.streak} {t.profile.streakLabel}</div>
              <div className="text-[10px] text-gray-400">{t.profile.streakLabel}</div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-center">
              <Terminal className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white font-mono">{userStats.stats.commandsExecuted}</div>
              <div className="text-[10px] text-gray-400">{t.profile.commandsExec}</div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white font-mono">{userStats.stats.questsCompleted}</div>
              <div className="text-[10px] text-gray-400">{t.profile.questsDone}</div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-center">
              <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white font-mono">{userStats.stats.speedTyperBestWpm}</div>
              <div className="text-[10px] text-gray-400">{t.profile.bestWpm}</div>
            </div>
          </div>

          {/* Badges / Achievements */}
          <div>
            <h4 className="text-xs font-bold text-white font-mono mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              {t.profile.achievementsTitle} ({userStats.unlockedBadges.length} / {Object.keys(BADGES).length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(BADGES).map((badge) => {
                const isUnlocked = userStats.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-[#0d1117] border-purple-500/40 text-gray-200'
                        : 'bg-[#0d1117]/40 border-[#30363d] text-gray-500 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-1">
                        {language === 'ru' ? badge.nameRu : badge.nameEn}
                        {isUnlocked && <span className="text-[10px] text-emerald-400">✓</span>}
                      </div>
                      <div className="text-[11px] text-gray-400 leading-tight">
                        {language === 'ru' ? badge.descRu : badge.descEn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
