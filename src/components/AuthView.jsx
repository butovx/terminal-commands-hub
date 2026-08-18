import React, { useState } from 'react';
import { registerUser, loginUser } from '../utils/auth';
import { getCurrentLevelInfo } from '../utils/gamification';
import { User, Mail, Lock, LogIn, UserPlus, Cloud, UserCheck, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, Flame, Award, Zap } from 'lucide-react';

export default function AuthView({ authUser, userStats, onAuthSuccess, onLogout, language = 'en', t }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginInput, setLoginInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await loginUser({ login: loginInput, password: passwordInput });
        onAuthSuccess(data.user);
      } else {
        const data = await registerUser({
          username: usernameInput,
          email: emailInput,
          password: passwordInput
        });
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const levelInfo = userStats ? getCurrentLevelInfo(userStats.xp) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-2">
      
      {/* Banner Header */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Cloud className="w-6 h-6 text-cyan-400" />
            {authUser ? (language === 'ru' ? 'Аккаунт и Облачная Синхронизация' : 'User Account & Cloud Sync') : (language === 'ru' ? 'Авторизация и Регистрация' : 'Authentication & Registration')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t.auth.subtext}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-cyan-400 bg-[#0d1117] px-3.5 py-2 rounded-xl border border-[#30363d]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cloudflare D1</span>
        </div>
      </div>

      {authUser ? (
        /* Logged In Account Dashboard View */
        <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-[#30363d] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black flex items-center justify-center font-bold text-2xl shadow-lg">
                {levelInfo?.current?.badge || '👤'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  {authUser.username}
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    ✓ Verified
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{authUser.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-mono text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              {t.auth.logout}
            </button>
          </div>

          {/* D1 Sync Info Box */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-xl text-xs text-cyan-300 font-mono flex items-center gap-3">
            <Cloud className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <strong className="block text-white">🟢 Cloudflare D1 Sync Active</strong>
              <span>Your XP ({userStats.xp} XP), Level {userStats.level}, 200 quests, and bookmarks are automatically saved to your cloud profile.</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
              <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1 fill-emerald-400" />
              <div className="text-sm font-bold text-white">{userStats.xp} XP</div>
              <div className="text-[10px] text-gray-400">Total XP</div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
              <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-400" />
              <div className="text-sm font-bold text-white">{userStats.streak} Days</div>
              <div className="text-[10px] text-gray-400">Streak</div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
              <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{userStats.unlockedBadges.length}</div>
              <div className="text-[10px] text-gray-400">Badges</div>
            </div>
          </div>

        </div>
      ) : (
        /* Sign In / Registration Form View */
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Mode Switcher Tabs */}
          <div className="bg-[#0d1117] px-6 py-3 border-b border-[#30363d] flex items-center gap-2">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white bg-[#161b22] border border-[#30363d]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {t.auth.loginTab}
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white bg-[#161b22] border border-[#30363d]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {t.auth.registerTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-400 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 block font-bold">{t.auth.usernameLabel}</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. terminal_master"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>
            )}

            {mode === 'register' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 block font-bold">{t.auth.emailLabel}</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 block font-bold">{t.auth.loginLabel}</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Username or email"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block font-bold">{t.auth.passwordLabel}</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-mono text-xs font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : mode === 'login' ? t.auth.loginButton : t.auth.registerButton}
            </button>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] text-[11px] text-gray-400 font-mono text-center">
              💡 {language === 'ru' ? 'Ваш локальный прогресс (XP, квесты и ачивки) автоматически сохранится в облако Cloudflare D1 при входе.' : 'Your local progress will be automatically merged and saved to Cloudflare D1.'}
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
