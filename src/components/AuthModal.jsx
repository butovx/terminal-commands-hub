import React, { useState } from 'react';
import { registerUser, loginUser } from '../utils/auth';
import { X, Lock, Mail, User, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ onClose, onAuthSuccess, language = 'en', t }) {
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
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Header Tabs */}
        <div className="bg-[#0d1117] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1" />
              {t.auth.loginTab}
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 inline mr-1" />
              {t.auth.registerTab}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-white font-mono">
              {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
            </h3>
            <p className="text-xs text-gray-400">
              {t.auth.subtext}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300 block">{t.auth.usernameLabel}</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. dev_wizard"
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>
          )}

          {mode === 'register' ? (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300 block">{t.auth.emailLabel}</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300 block">{t.auth.loginLabel}</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Username or email"
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-300 block">{t.auth.passwordLabel}</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-mono text-xs font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? t.auth.loginButton : t.auth.registerButton}
          </button>

        </form>

      </div>
    </div>
  );
}
