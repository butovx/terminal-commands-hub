import React from 'react';
import CommandCard from './CommandCard';
import { Bookmark, Trash2, Download } from 'lucide-react';

export default function BookmarksView({
  bookmarkedCommands,
  onSelectCommand,
  bookmarkedIds,
  onToggleBookmark,
  onRunInSandbox,
  onClearAllBookmarks,
  language = 'en',
  t
}) {
  const exportBookmarks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarkedCommands, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "terminal_bookmarked_commands.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (bookmarkedCommands.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-[#30363d] text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-950/50 border border-purple-800/40 text-purple-400 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white font-mono">
          {t.bookmarks.emptyTitle}
        </h3>
        <p className="text-xs text-gray-400">
          {t.bookmarks.emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400" />
            <h2 className="text-xl font-bold text-white font-mono">
              {t.bookmarks.headerTitle} ({bookmarkedCommands.length})
            </h2>
          </div>
          <p className="text-xs text-gray-400">
            {t.bookmarks.headerDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBookmarks}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.bookmarks.exportJson}</span>
          </button>

          <button
            onClick={onClearAllBookmarks}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.bookmarks.clearAll}</span>
          </button>
        </div>
      </div>

      {/* Grid of Bookmarked Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarkedCommands.map((cmd) => (
          <CommandCard
            key={cmd.id}
            command={cmd}
            onSelectCommand={onSelectCommand}
            isBookmarked={true}
            onToggleBookmark={onToggleBookmark}
            onRunInSandbox={onRunInSandbox}
            language={language}
            t={t}
          />
        ))}
      </div>

    </div>
  );
}
