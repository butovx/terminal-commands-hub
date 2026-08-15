import React, { useEffect, useState } from 'react';
import { getCategoryMeta, getManSectionMeta } from '../utils/categories';
import {
  X,
  Copy,
  Check,
  Bookmark,
  Terminal
} from 'lucide-react';

export default function CommandDetailModal({
  command,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onRunInSandbox,
  language = 'en',
  t
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!command) return null;

  const categoryMeta = getCategoryMeta(command.category, language);
  const sectionMeta = getManSectionMeta(command.section, language);
  const description = language === 'ru' ? (command.ru_desc || command.primary_desc) : command.primary_desc;

  const handleCopy = () => {
    navigator.clipboard.writeText(command.example || command.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] border border-[#30363d] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-mono font-bold text-xl text-white">
              {command.name}
            </h2>
            <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded ${sectionMeta.color}`}>
              {sectionMeta.badge}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300">
              {categoryMeta.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-gray-300">
          
          {/* Main Description */}
          <div>
            <span className="text-gray-500 font-mono block text-[11px] mb-1">{t.modal.descriptionHeader}</span>
            <p className="text-sm text-gray-100 font-sans leading-relaxed">
              {description}
            </p>
          </div>

          {/* Syntax Example */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 font-mono text-[11px]">{t.modal.exampleHeader}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-emerald-400 hover:underline text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.modal.copiedCommand : t.modal.copyCommand}</span>
              </button>
            </div>
            <div className="font-mono text-xs bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] text-emerald-400">
              $ {command.example || `${command.name} --help`}
            </div>
          </div>

          {/* Whatis records */}
          {command.details && command.details.length > 0 && (
            <div>
              <span className="text-gray-500 font-mono block text-[11px] mb-1">{t.modal.whatisHeader}</span>
              <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-[11px] space-y-1">
                {command.details.slice(0, 5).map((line, idx) => (
                  <div key={idx} className="text-gray-300">
                    • {line}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <button
            onClick={() => onToggleBookmark(command.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              isBookmarked
                ? 'bg-purple-950 text-purple-300 border-purple-800'
                : 'bg-[#161b22] text-gray-300 border-[#30363d] hover:bg-gray-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
            <span>{isBookmarked ? t.actions.inFavorites : t.actions.addToFavorites}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onRunInSandbox(command);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.actions.runInSandbox}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
