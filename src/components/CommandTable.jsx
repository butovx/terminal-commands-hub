import React, { useState } from 'react';
import { getCategoryMeta, getManSectionMeta } from '../utils/categories';
import { Bookmark, Copy, Check, Terminal } from 'lucide-react';

export default function CommandTable({
  commands,
  onSelectCommand,
  bookmarkedIds,
  onToggleBookmark,
  onRunInSandbox,
  language = 'en',
  t
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, cmd) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.example || cmd.name);
    setCopiedId(cmd.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="glass-panel rounded-2xl border border-[#30363d] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#161b22] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#30363d]">
            <tr>
              <th className="py-3 px-4 w-10 text-center">{t.table.bookmark}</th>
              <th className="py-3 px-4 w-44">{t.table.command}</th>
              <th className="py-3 px-4 w-36">{t.table.category}</th>
              <th className="py-3 px-4">{t.table.description}</th>
              <th className="py-3 px-4 w-52 font-normal">{t.table.example}</th>
              <th className="py-3 px-4 w-24 text-right">{t.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]/40">
            {commands.map((cmd) => {
              const isBookmarked = bookmarkedIds.has(cmd.id);
              const categoryMeta = getCategoryMeta(cmd.category, language);
              const sectionMeta = getManSectionMeta(cmd.section, language);
              const description = language === 'ru' ? (cmd.ru_desc || cmd.primary_desc) : cmd.primary_desc;

              return (
                <tr
                  key={cmd.id}
                  onClick={() => onSelectCommand(cmd)}
                  className="hover:bg-[#21262d]/60 cursor-pointer transition-colors group"
                >
                  {/* Bookmark */}
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(cmd.id);
                      }}
                      className="text-gray-600 hover:text-purple-400 transition-colors"
                      title={isBookmarked ? t.actions.inFavorites : t.actions.addToFavorites}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-purple-400 fill-purple-400' : ''}`} />
                    </button>
                  </td>

                  {/* Name + Section */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white group-hover:text-[#58a6ff] transition-colors">
                        {cmd.name}
                      </span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded ${sectionMeta.color}`}>
                        {cmd.section}
                      </span>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${categoryMeta.bgColor} ${categoryMeta.color} ${categoryMeta.borderColor}`}>
                      <categoryMeta.icon className="w-3 h-3" />
                      <span>{categoryMeta.label}</span>
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-2.5 px-4 text-gray-300 max-w-xs truncate">
                    {description}
                  </td>

                  {/* Example Code */}
                  <td className="py-2.5 px-4 font-mono text-[11px] text-emerald-400/90 max-w-xs truncate">
                    $ {cmd.example || cmd.name}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => handleCopy(e, cmd)}
                        className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
                        title={copiedId === cmd.id ? t.actions.copied : t.actions.copy}
                      >
                        {copiedId === cmd.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunInSandbox(cmd);
                        }}
                        className="p-1 rounded text-cyan-400 hover:bg-cyan-950/60 transition-colors"
                        title={t.actions.runInSandbox}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
