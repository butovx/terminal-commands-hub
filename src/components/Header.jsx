import React, { useEffect, useRef } from 'react';
import {
  Terminal,
  Search,
  Bookmark,
  LayoutGrid,
  Table as TableIcon,
  BookOpen,
  Code,
  X,
  Globe
} from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  activeView,
  setActiveView,
  bookmarksCount,
  totalCount,
  withDescCount,
  filteredCount,
  language,
  setLanguage,
  t
}) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-[#161b22] border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand Logo & Language Switcher */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveView('grid')}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-mono leading-none">
                  Terminal<span className="text-emerald-400">Hub</span>
                </h1>
                <span className="text-[11px] text-gray-400">
                  {totalCount} {t.commandsCount}
                </span>
              </div>
            </div>

            {/* Language Switcher Toggle */}
            <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
              <Globe className="w-3.5 h-3.5 text-gray-400 ml-1 mr-0.5" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                  language === 'en'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                  language === 'ru'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>

            {/* Mobile View Switcher shortcut */}
            <div className="flex md:hidden items-center gap-1">
              <span className="text-xs text-emerald-400 font-mono font-medium">
                {filteredCount} {t.resCount}
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="w-full md:max-w-md relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-10 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 p-0.5 rounded text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Clean View Tabs */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'grid'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.tabs.grid}</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'table'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t.tabs.table}</span>
            </button>

            <button
              onClick={() => setActiveView('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'terminal'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{t.tabs.terminal}</span>
            </button>

            <button
              onClick={() => setActiveView('cheatsheet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeView === 'cheatsheet'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.tabs.cheatsheet}</span>
            </button>

            <button
              onClick={() => setActiveView('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all relative ${
                activeView === 'bookmarks'
                  ? 'bg-purple-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.tabs.bookmarks}</span>
              {bookmarksCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-900 text-purple-200">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
