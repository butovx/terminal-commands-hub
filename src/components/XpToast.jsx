import React, { useEffect } from 'react';
import { Award, Zap, Sparkles } from 'lucide-react';

export default function XpToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isLevelUp = toast.type === 'levelup';
  const isBadge = toast.type === 'badge';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in flex items-center gap-3 bg-[#161b22] border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 px-4 py-3 rounded-xl max-w-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
        isLevelUp ? 'bg-amber-500 text-black' : isBadge ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-black'
      }`}>
        {isLevelUp ? <Sparkles className="w-5 h-5" /> : isBadge ? <Award className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
          {toast.title}
        </h4>
        <p className="text-xs text-gray-300">
          {toast.message}
        </p>
      </div>
    </div>
  );
}
