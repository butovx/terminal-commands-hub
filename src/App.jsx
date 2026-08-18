import React, { useState, useEffect, useMemo, useCallback } from 'react';
import commandsData from './data/commands.json';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import CommandCard from './components/CommandCard';
import CommandTable from './components/CommandTable';
import CommandDetailModal from './components/CommandDetailModal';
import TerminalSandbox from './components/TerminalSandbox';
import CheatSheetView from './components/CheatSheetView';
import BookmarksView from './components/BookmarksView';
import QuestsView from './components/QuestsView';
import QuizView from './components/QuizView';
import SpeedTyperView from './components/SpeedTyperView';
import UserProfileModal from './components/UserProfileModal';
import AuthView from './components/AuthView';
import XpToast from './components/XpToast';
import { translations } from './utils/translations';
import { searchCommands } from './utils/search';
import { loadUserStats, saveUserStats, getCurrentLevelInfo, BADGES } from './utils/gamification';
import { getStoredAuth, clearAuthSession, fetchRemoteProgress, syncProgressToRemote } from './utils/auth';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

const PAGE_SIZE = 36;

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('terminal_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [activeView, setActiveView] = useState('grid');
  
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [sandboxCommand, setSandboxCommand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Gamification & Auth State
  const [userStats, setUserStats] = useState(() => loadUserStats());
  const [authUser, setAuthUser] = useState(() => getStoredAuth().user);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Sync language selection
  useEffect(() => {
    try {
      localStorage.setItem('terminal_language', language);
      document.documentElement.lang = language;
      document.title = language === 'ru'
        ? 'Terminal Commands Hub | Геймифицированный справочник macOS/Linux'
        : 'Terminal Commands Hub | Gamified macOS & Linux Reference';
    } catch (err) {
      console.error(err);
    }
  }, [language]);

  const t = translations[language] || translations.en;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 120);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('terminal_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('terminal_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));

      if (bookmarkedIds.size >= 5 && !userStats.unlockedBadges.includes('bookmark_collector')) {
        handleEarnXp(25, 'Bookmarked 5 commands', 'bookmark_collector');
      }
    } catch (err) {
      console.error(err);
    }
  }, [bookmarkedIds]);

  // Fetch D1 remote progress on auth login
  const handleAuthSuccess = async (user) => {
    setAuthUser(user);
    const remote = await fetchRemoteProgress();

    if (remote) {
      setUserStats(prev => {
        const merged = {
          ...prev,
          xp: Math.max(prev.xp, remote.xp || 0),
          level: Math.max(prev.level, remote.level || 1),
          streak: Math.max(prev.streak, remote.streak || 1),
          unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...(remote.unlockedBadges || [])])),
          stats: { ...prev.stats, ...(remote.stats || {}) }
        };
        saveUserStats(merged);
        return merged;
      });

      if (remote.bookmarks && remote.bookmarks.length > 0) {
        setBookmarkedIds(prev => new Set([...Array.from(prev), ...remote.bookmarks]));
      }
    }

    setActiveToast({
      type: 'badge',
      title: `Welcome ${user.username}!`,
      message: 'Cloud progress synced with Cloudflare D1 Database.'
    });
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthUser(null);
    setActiveToast({
      type: 'xp',
      title: 'Logged Out',
      message: 'Switched to guest mode (localStorage).'
    });
  };

  // Sync to D1 whenever userStats or bookmarks change
  useEffect(() => {
    if (authUser) {
      syncProgressToRemote(userStats, Array.from(bookmarkedIds));
    }
  }, [userStats, bookmarkedIds, authUser]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearAllBookmarks = () => {
    setBookmarkedIds(new Set());
  };

  const handleRunInSandbox = (cmd) => {
    setSandboxCommand(cmd);
    setActiveView('terminal');
  };

  // Gamification XP Handler
  const handleEarnXp = useCallback((amount, reason, badgeId = null) => {
    setUserStats(prev => {
      const oldLevelInfo = getCurrentLevelInfo(prev.xp);
      const newXp = prev.xp + amount;
      const newLevelInfo = getCurrentLevelInfo(newXp);

      const newBadges = [...prev.unlockedBadges];
      if (badgeId && BADGES[badgeId] && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
      }

      if (newLevelInfo.current.level >= 5 && !newBadges.includes('level_5_master')) {
        newBadges.push('level_5_master');
      }

      const updated = {
        ...prev,
        xp: newXp,
        level: newLevelInfo.current.level,
        unlockedBadges: newBadges
      };

      saveUserStats(updated);

      if (newLevelInfo.current.level > oldLevelInfo.current.level) {
        setActiveToast({
          type: 'levelup',
          title: `🎉 LEVEL UP! Level ${newLevelInfo.current.level}`,
          message: `Rank: ${language === 'ru' ? newLevelInfo.current.titleRu : newLevelInfo.current.titleEn}`
        });
      } else if (badgeId && BADGES[badgeId] && !prev.unlockedBadges.includes(badgeId)) {
        const b = BADGES[badgeId];
        setActiveToast({
          type: 'badge',
          title: `🏆 Badge Unlocked: ${b.icon} ${language === 'ru' ? b.nameRu : b.nameEn}`,
          message: `+${amount} XP (${reason})`
        });
      } else {
        setActiveToast({
          type: 'xp',
          title: `+${amount} XP Earned!`,
          message: reason
        });
      }

      return updated;
    });
  }, [language]);

  const categoryCounts = useMemo(() => {
    const counts = { all: commandsData.length };
    commandsData.forEach((cmd) => {
      counts[cmd.category] = (counts[cmd.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredCommands = useMemo(() => {
    let result = searchCommands(commandsData, debouncedSearchTerm);

    if (selectedCategory !== 'all') {
      result = result.filter(cmd => cmd.category === selectedCategory);
    }

    if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [debouncedSearchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredCommands.length / PAGE_SIZE) || 1;
  const paginatedCommands = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCommands.slice(start, start + PAGE_SIZE);
  }, [filteredCommands, currentPage]);

  const bookmarkedCommands = useMemo(() => {
    return commandsData.filter(c => bookmarkedIds.has(c.id));
  }, [bookmarkedIds]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-12">
      
      {/* Top Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeView={activeView}
        setActiveView={setActiveView}
        bookmarksCount={bookmarkedIds.size}
        totalCount={commandsData.length}
        filteredCount={filteredCommands.length}
        language={language}
        setLanguage={setLanguage}
        t={t}
        userStats={userStats}
        authUser={authUser}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {activeView === 'grid' || activeView === 'table' ? (
          <div>
            {/* Category Filter Pills */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categoryCounts={categoryCounts}
              language={language}
              t={t}
            />

            {/* Results bar & Pagination Controls */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
              <div>
                {t.showing} <span className="font-mono text-emerald-400 font-bold">{paginatedCommands.length}</span> {t.of}{' '}
                <span className="font-mono text-white font-bold">{filteredCommands.length}</span> {t.commands}
                {debouncedSearchTerm && (
                  <span className="ml-1 text-gray-400">
                    {t.forQuery} «<strong className="text-emerald-400">{debouncedSearchTerm}</strong>»
                  </span>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-1 rounded bg-[#161b22] border border-[#30363d] disabled:opacity-30 hover:bg-gray-800 text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs text-gray-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-1 rounded bg-[#161b22] border border-[#30363d] disabled:opacity-30 hover:bg-gray-800 text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Content List */}
            {filteredCommands.length === 0 ? (
              <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-xl text-center my-6 max-w-sm mx-auto space-y-2">
                <HelpCircle className="w-8 h-8 text-gray-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">{t.nothingFoundTitle}</h3>
                <p className="text-xs text-gray-400">
                  {t.nothingFoundDesc} «{debouncedSearchTerm}».
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-3 py-1 bg-[#21262d] text-emerald-400 rounded-lg text-xs border border-[#30363d] hover:bg-gray-800"
                >
                  {t.resetFilters}
                </button>
              </div>
            ) : activeView === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginatedCommands.map((cmd) => (
                  <CommandCard
                    key={cmd.id}
                    command={cmd}
                    onSelectCommand={setSelectedCommand}
                    isBookmarked={bookmarkedIds.has(cmd.id)}
                    onToggleBookmark={toggleBookmark}
                    onRunInSandbox={handleRunInSandbox}
                    language={language}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <CommandTable
                commands={paginatedCommands}
                onSelectCommand={setSelectedCommand}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                onRunInSandbox={handleRunInSandbox}
                language={language}
                t={t}
              />
            )}

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1 rounded-lg bg-[#161b22] border border-[#30363d] text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                >
                  {t.prev}
                </button>
                <span className="text-xs text-gray-400 font-mono">
                  {currentPage} {t.of} {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1 rounded-lg bg-[#161b22] border border-[#30363d] text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                >
                  {t.next}
                </button>
              </div>
            )}

          </div>
        ) : activeView === 'terminal' ? (
          <TerminalSandbox
            initialCommand={sandboxCommand}
            commands={commandsData}
            language={language}
            t={t}
            onEarnXp={handleEarnXp}
          />
        ) : activeView === 'quests' ? (
          <QuestsView
            commands={commandsData}
            onEarnXp={handleEarnXp}
            language={language}
            t={t}
          />
        ) : activeView === 'quiz' ? (
          <QuizView
            onEarnXp={handleEarnXp}
            language={language}
            t={t}
          />
        ) : activeView === 'speedtyper' ? (
          <SpeedTyperView
            onEarnXp={handleEarnXp}
            language={language}
            t={t}
          />
        ) : activeView === 'cheatsheet' ? (
          <CheatSheetView
            onRunInSandbox={handleRunInSandbox}
            language={language}
            t={t}
          />
        ) : activeView === 'auth' ? (
          <AuthView
            authUser={authUser}
            userStats={userStats}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            language={language}
            t={t}
          />
        ) : (
          <BookmarksView
            bookmarkedCommands={bookmarkedCommands}
            onSelectCommand={setSelectedCommand}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onRunInSandbox={handleRunInSandbox}
            onClearAllBookmarks={clearAllBookmarks}
            language={language}
            t={t}
          />
        )}

      </main>

      {/* Detail Modal */}
      {selectedCommand && (
        <CommandDetailModal
          command={selectedCommand}
          onClose={() => setSelectedCommand(null)}
          isBookmarked={bookmarkedIds.has(selectedCommand.id)}
          onToggleBookmark={toggleBookmark}
          onRunInSandbox={handleRunInSandbox}
          language={language}
          t={t}
        />
      )}

      {/* User Profile / Achievements Modal */}
      {showProfileModal && (
        <UserProfileModal
          userStats={userStats}
          authUser={authUser}
          onClose={() => setShowProfileModal(false)}
          onOpenAuth={() => { setShowProfileModal(false); setActiveView('auth'); }}
          onLogout={handleLogout}
          language={language}
          t={t}
        />
      )}

      {/* Floating XP / Level Toast Notification */}
      <XpToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />

    </div>
  );
}
