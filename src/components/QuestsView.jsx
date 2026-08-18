import React, { useState } from 'react';
import { QUESTS } from '../utils/questsData';
import { createInitialVFS, executeVfsCommand, autocompleteVfs, formatPath } from '../utils/vfs';
import { Award, CheckCircle2, HelpCircle, Sparkles, Terminal, ChevronRight, RotateCcw } from 'lucide-react';

export default function QuestsView({ commands, onEarnXp, language = 'en', t }) {
  const [activeQuestIdx, setActiveQuestIdx] = useState(0);
  const [completedQuestIds, setCompletedQuestIds] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [vfsState, setVfsState] = useState(createInitialVFS());
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', content: '⚡ Terminal Quest Sandbox Initialized. Complete the task objectives listed on the left!' }
  ]);
  const [input, setInput] = useState('');
  const [historyLog, setHistoryLog] = useState([]);

  const currentQuest = QUESTS[activeQuestIdx];

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

    const newLog = [...historyLog, newHistoryEntry];
    setHistoryLog(newLog);

    // Auto verify quest criteria
    if (currentQuest && !completedQuestIds.has(currentQuest.id)) {
      if (currentQuest.checkFn(newVfsState, updatedHistory)) {
        const nextCompleted = new Set(completedQuestIds);
        nextCompleted.add(currentQuest.id);
        setCompletedQuestIds(nextCompleted);

        const isAllDone = nextCompleted.size === QUESTS.length;
        const badgeId = isAllDone ? 'quest_master' : 'quest_solver';
        onEarnXp(currentQuest.xpReward, `Completed quest: ${currentQuest.id}`, badgeId);
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
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            {t.quests.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            {t.quests.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d]">
          <span>Completed:</span>
          <strong className="text-white text-sm">{completedQuestIds.size} / {QUESTS.length}</strong>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quest List Sidebar */}
        <div className="space-y-3">
          {QUESTS.map((quest, idx) => {
            const isCompleted = completedQuestIds.has(quest.id);
            const isActive = idx === activeQuestIdx;

            return (
              <div
                key={quest.id}
                onClick={() => {
                  setActiveQuestIdx(idx);
                  setShowHint(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#161b22] border-emerald-500/80 shadow-lg'
                    : 'bg-[#161b22]/60 border-[#30363d] hover:bg-[#161b22]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${isActive ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {language === 'ru' ? quest.titleRu : quest.titleEn}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.quests.completed}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      +{quest.xpReward} XP
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {language === 'ru' ? quest.descRu : quest.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quest Workspace Terminal */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Quest Detail Card */}
          <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {language === 'ru' ? currentQuest.titleRu : currentQuest.titleEn}
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
              {language === 'ru' ? currentQuest.descRu : currentQuest.descEn}
            </p>

            {/* Checklist Tasks */}
            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-gray-400 font-bold mb-1">TASK OBJECTIVES:</div>
              {(language === 'ru' ? currentQuest.tasksRu : currentQuest.tasksEn).map((task, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{task}</span>
                </div>
              ))}
            </div>

            {showHint && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 font-mono animate-fade-in">
                💡 <strong>HINT:</strong> {language === 'ru' ? currentQuest.hintRu : currentQuest.hintEn}
              </div>
            )}
          </div>

          {/* Terminal Component for Quest */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl h-[340px] flex flex-col">
            <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Terminal Quest Lab: {formatPath(vfsState.cwd)}
              </span>
              {completedQuestIds.has(currentQuest.id) && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ {t.quests.completed} (+{currentQuest.xpReward} XP)
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
                placeholder="Type command to complete quest..."
                className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs"
              />
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
