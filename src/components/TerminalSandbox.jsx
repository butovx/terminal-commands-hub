import React, { useState, useRef, useEffect } from 'react';
import { getCategoryMeta } from '../utils/categories';
import { createInitialVFS, executeVfsCommand, autocompleteVfs, formatPath } from '../utils/vfs';
import { Terminal as TerminalIcon, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';

export default function TerminalSandbox({ initialCommand, commands, language = 'en', t, onEarnXp }) {
  const [input, setInput] = useState('');
  const [vfsState, setVfsState] = useState(createInitialVFS());
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandLog, setCommandLog] = useState([]);

  const [terminalHistory, setTerminalHistory] = useState(() => [
    {
      type: 'system',
      content: t.sandbox.welcome
    }
  ]);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Update initial welcome message on language change if screen was not altered
  useEffect(() => {
    setTerminalHistory(prev => {
      if (prev.length === 1 && prev[0].type === 'system') {
        return [{ type: 'system', content: t.sandbox.welcome }];
      }
      return prev;
    });
  }, [language, t.sandbox.welcome]);

  useEffect(() => {
    if (initialCommand) {
      handleRunCommand(initialCommand.example || initialCommand.name);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleRunCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      setInput('');
      return;
    }

    const currentPromptPath = formatPath(vfsState.cwd);
    const { output, vfsState: newVfsState, action } = executeVfsCommand(vfsState, trimmed, commands, language);

    setVfsState(newVfsState);
    setCommandLog(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newHistory = [
      ...terminalHistory,
      { type: 'input', content: trimmed, path: currentPromptPath },
      { type: 'output', content: output }
    ];

    setTerminalHistory(newHistory);
    setInput('');

    // Trigger XP reward for trying out commands in the interactive sandbox
    if (onEarnXp) {
      onEarnXp(5, 'Executed command in Sandbox', 'first_command');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = autocompleteVfs(vfsState, input);
      setInput(completed);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandLog.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandLog.length) {
        setHistoryIndex(nextIdx);
        setInput(commandLog[commandLog.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandLog[commandLog.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRunCommand(input);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg flex flex-col h-[520px] text-left">
      
      {/* Top Bar */}
      <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs text-gray-300">
            user@macbook:{formatPath(vfsState.cwd)} (zsh)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunCommand('help')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#21262d] border border-[#30363d] text-gray-300 hover:text-white transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.sandbox.helpButton}</span>
          </button>
          <button
            onClick={() => {
              setTerminalHistory([]);
              setVfsState(createInitialVFS());
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#21262d] border border-[#30363d] text-gray-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.sandbox.clearButton}</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        className="flex-1 bg-[#090d13] p-4 overflow-y-auto font-mono text-xs space-y-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalHistory.map((item, idx) => (
          <div key={idx}>
            {item.type === 'input' ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-blue-400">user@macbook:{item.path || '~'}</span>
                <span className="text-gray-400">%</span>
                <span className="text-white font-semibold">{item.content}</span>
              </div>
            ) : (
              <div className="text-gray-300 whitespace-pre-wrap pl-3 border-l border-emerald-500/40">
                {item.content}
              </div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-emerald-400 pt-1">
          <span className="text-blue-400">user@macbook:{formatPath(vfsState.cwd)}</span>
          <span className="text-gray-400">%</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.sandbox.inputPlaceholder}
            className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs caret-emerald-400"
          />
        </form>
        <div ref={bottomRef} />
      </div>

      {/* Quick launch shortcuts bar */}
      <div className="bg-[#0d1117] px-3 py-2 border-t border-[#30363d] flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-gray-500 font-mono text-[11px] whitespace-nowrap">{t.sandbox.examplesLabel}</span>
        {['ls -la', 'cd documents', 'cat secret_notes.txt', 'pwd', 'grep ERROR logs/sys.log', 'git status'].map((cmd, i) => (
          <button
            key={i}
            onClick={() => handleRunCommand(cmd)}
            className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-emerald-400 font-mono text-[11px] hover:bg-gray-800 whitespace-nowrap transition-all"
          >
            $ {cmd}
          </button>
        ))}
      </div>

    </div>
  );
}
