import React, { useState } from 'react';
import { getCategoryMeta, getManSectionMeta } from '../utils/categories';
import { Bookmark, Copy, Check, Terminal } from 'lucide-react';

export default function CommandCard({
  command,
  onSelectCommand,
  isBookmarked,
  onToggleBookmark,
  onRunInSandbox,
  language = 'en',
  t
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command.example || command.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const categoryMeta = getCategoryMeta(command.category, language);
  const sectionMeta = getManSectionMeta(command.section, language);

  const description = language === 'ru' ? (command.ru_desc || command.primary_desc) : command.primary_desc;

  return (
    <div
      onClick={() => onSelectCommand(command)}
      className="bg-[#161b22] border border-[#30363d] hover:border-emerald-500/60 rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-[#21262d]"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-mono font-bold text-sm text-white">
              {command.name}
            </h3>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono font-medium rounded border ${sectionMeta.color}`}>
              {sectionMeta.badge}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(command.id);
            }}
            className={`p-1 rounded transition-colors ${
              isBookmarked ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
            }`}
            title={isBookmarked ? (t?.actions?.inFavorites || "In Favorites") : (t?.actions?.addToFavorites || "Add to Favorites")}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-400' : ''}`} />
          </button>
        </div>

        {/* Category Pill */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#0d1117] text-gray-300 border border-[#30363d]">
            <categoryMeta.icon className="w-3 h-3 text-emerald-400" />
            <span>{categoryMeta.label}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-snug">
          {description}
        </p>
      </div>

      {/* Code Example Footer */}
      <div className="pt-2 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
        <code className="font-mono text-[11px] text-emerald-400 bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d] truncate flex-1">
          $ {command.example || command.name}
        </code>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title={copied ? (t?.actions?.copied || "Copied!") : (t?.actions?.copy || "Copy")}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRunInSandbox(command);
            }}
            className="p-1 rounded text-cyan-400 hover:bg-cyan-950/50 transition-colors"
            title={t?.actions?.runInSandbox || "Run in Sandbox"}
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
