import React, { useState, useMemo } from 'react';
import { QUESTS, QUEST_GROUPS, QUEST_LEVELS } from '../utils/questsData';
import { createInitialVFS, executeVfsCommand, autocompleteVfs, formatPath } from '../utils/vfs';
import { Award, CheckCircle2, HelpCircle, Sparkles, Terminal, ChevronRight, RotateCcw, Search, Filter, Layers } from 'lucide-react';

export default function QuestsView({ commands, onEarnXp, language = 'en', t }) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestId, setActiveQuestId] = useState(QUESTS[0]?.id || 'quest_1');
  const [completedQuestIds, setCompletedQuestIds] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [vfsState, setVfsState] = useState(createInitialVFS());
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', content: '⚡ Terminal Quest Sandbox (200 Quests). Complete the objectives listed on the left!' }
  ]);
  const [input, setInput] = useState('');

  // Filtering quests by Group, Level, and Search
  const filteredQuests = useMemo(() => {
    return QUESTS.filter(quest => {
      if (selectedGroup !== 'all' && quest.groupId !== selectedGroup) return false;
      if (selectedLevel !== 'all' && quest.levelId !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (language === 'ru' ? quest.titleRu : quest.titleEn).toLowerCase();
        const desc = (language === 'ru' ? quest.descRu : quest.descEn).toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [selectedGroup, selectedLevel, searchQuery, language]);

  const activeQuest = useMemo(() => {
    return QUESTS.find(q => q.id === activeQuestId) || filteredQuests[0] || QUESTS[0];
  }, [activeQuestId, filteredQuests]);

  const handleRunCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      setInput('');
      return;
    }

    const currentPromptPath = formatPath(vfsState.cwd);
    const { output, vfsState: newVfsState } = executeVfsCommand(vfsState, trimmed, commands, language);

    const newHistoryEntry = { type: 'input', content: trimmed, path: currentPromptPath };
    const updatedHistory = [...terminalHistory, newHistoryEntry, { type: 'output', content: output }];

    setVfsState(newVfsState);
    setTerminalHistory(updatedHistory);
    setInput('');

    // Verify current active quest
    if (activeQuest && !completedQuestIds.has(activeQuest.id)) {
      if (activeQuest.checkFn(newVfsState, updatedHistory)) {
        const nextCompleted = new Set(completedQuestIds);
        nextCompleted.add(activeQuest.id);
        setCompletedQuestIds(nextCompleted);

        const isAllDone = nextCompleted.size === QUESTS.length;
        const badgeId = isAllDone ? 'quest_master' : 'quest_solver';
        onEarnXp(activeQuest.xpReward, `Completed quest #${activeQuest.id}`, badgeId);
      }
    }
  };

  const handleResetQuest = () => {
    setVfsState(createInitialVFS());
    setTerminalHistory([
      { type: 'system', content: '⚡ Reset quest environment.' }
    ]);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            {t.quests.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            {t.quests.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d] text-emerald-400">
            Completed: <strong className="text-white text-sm">{completedQuestIds.size} / {QUESTS.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-2xl space-y-3">
        
        {/* Search & Level Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.quests.searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          {/* Level Filter Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" /> Level:
            </span>
            {QUEST_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  selectedLevel === lvl.id
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#0d1117] text-gray-400 border border-[#30363d] hover:text-white'
                }`}
              >
                {lvl.badge} {language === 'ru' ? lvl.labelRu : lvl.labelEn}
              </button>
            ))}
          </div>

        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#30363d]">
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1 whitespace-nowrap mr-1">
            <Layers className="w-3.5 h-3.5" /> Groups:
          </span>
          {QUEST_GROUPS.map((grp) => {
            const isSel = selectedGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'bg-[#0d1117] text-gray-400 border border-[#30363d] hover:text-white'
                }`}
              >
                <span>{grp.icon}</span>
                <span>{language === 'ru' ? grp.labelRu : grp.labelEn}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quest List Sidebar */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <div className="text-xs text-gray-400 font-mono px-1 flex justify-between">
            <span>Showing {filteredQuests.length} quests</span>
            <span>{filteredQuests.filter(q => completedQuestIds.has(q.id)).length} done</span>
          </div>

          {filteredQuests.length === 0 ? (
            <div className="p-8 text-center bg-[#161b22] border border-[#30363d] rounded-xl text-xs text-gray-400 font-mono">
              No quests match selected filters.
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const isCompleted = completedQuestIds.has(quest.id);
              const isActive = quest.id === activeQuest?.id;

              return (
                <div
                  key={quest.id}
                  onClick={() => {
                    setActiveQuestId(quest.id);
                    setShowHint(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#161b22] border-amber-400/80 shadow-lg'
                      : 'bg-[#161b22]/60 border-[#30363d] hover:bg-[#161b22]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${isActive ? 'text-amber-400' : 'text-gray-300'}`}>
                      {language === 'ru' ? quest.titleRu : quest.titleEn}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        +{quest.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                    {language === 'ru' ? quest.descRu : quest.descEn}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Quest Workspace Terminal */}
        <div className="lg:col-span-2 space-y-4">
          
          {activeQuest && (
            <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {language === 'ru' ? activeQuest.titleRu : activeQuest.titleEn}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#21262d] text-amber-400 border border-[#30363d] hover:bg-gray-800 flex items-center gap-1 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {t.quests.hintButton}
                  </button>
                  <button
                    onClick={handleResetQuest}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#21262d] text-gray-300 border border-[#30363d] hover:bg-gray-800 flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-300">
                {language === 'ru' ? activeQuest.descRu : activeQuest.descEn}
              </p>

              {/* Tasks List */}
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] space-y-1 text-xs font-mono">
                <div className="text-[11px] text-gray-400 font-bold mb-1">TASK OBJECTIVES:</div>
                {(language === 'ru' ? activeQuest.tasksRu : activeQuest.tasksEn).map((task, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              {showHint && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 font-mono animate-fade-in">
                  💡 <strong>HINT:</strong> {language === 'ru' ? activeQuest.hintRu : activeQuest.hintEn}
                </div>
              )}
            </div>
          )}

          {/* Quest Sandbox Terminal Screen */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl h-[360px] flex flex-col">
            <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Terminal Quest Lab: {formatPath(vfsState.cwd)}
              </span>
              {activeQuest && completedQuestIds.has(activeQuest.id) && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ {t.quests.completed} (+{activeQuest.xpReward} XP)
                </span>
              )}
            </div>

            <div className="flex-1 bg-[#090d13] p-4 overflow-y-auto font-mono text-xs space-y-2">
              {terminalHistory.map((item, idx) => (
                <div key={idx}>
                  {item.type === 'input' ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="text-blue-400">user@macbook:{item.path || '~'}</span>
                      <span className="text-gray-400">%</span>
                      <span className="text-white">{item.content}</span>
                    </div>
                  ) : (
                    <div className="text-gray-300 whitespace-pre-wrap pl-3 border-l border-emerald-500/40">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunCommand(input);
              }}
              className="bg-[#0d1117] p-3 border-t border-[#30363d] flex items-center gap-2 text-emerald-400"
            >
              <span className="text-blue-400 font-mono text-xs">user@macbook:{formatPath(vfsState.cwd)}%</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    setInput(autocompleteVfs(vfsState, input));
                  }
                }}
                placeholder="Type command to solve current quest..."
                className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs"
              />
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
