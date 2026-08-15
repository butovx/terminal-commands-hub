import React, { useState, useRef, useEffect } from 'react';
import { getCategoryMeta } from '../utils/categories';
import { Terminal as TerminalIcon, RotateCcw, HelpCircle } from 'lucide-react';

export default function TerminalSandbox({ initialCommand, commands, language = 'en', t }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => [
    {
      type: 'system',
      content: t.sandbox.welcome
    }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Update initial welcome message if language changes and history only has 1 system message
  useEffect(() => {
    setHistory(prev => {
      if (prev.length === 1 && prev[0].type === 'system') {
        return [{ type: 'system', content: t.sandbox.welcome }];
      }
      return prev;
    });
  }, [language, t.sandbox.welcome]);

  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand.example || initialCommand.name);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newHistory = [...history, { type: 'input', content: trimmed }];
    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(' ');
    const cmdName = parts[0].toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (lower === 'help') {
      newHistory.push({
        type: 'output',
        content: t.sandbox.helpOutput
      });
    } else {
      const match = commands.find(c => c.name === cmdName);
      if (match) {
        const catMeta = getCategoryMeta(match.category, language);
        const desc = language === 'ru' ? (match.ru_desc || match.primary_desc) : match.primary_desc;
        newHistory.push({
          type: 'output',
          content: `${t.sandbox.executedOutput} ${trimmed}\n${t.sandbox.section}: man(${match.section}) | ${t.sandbox.category}: ${catMeta.label}\n${t.sandbox.description}: ${desc}`
        });
      } else {
        newHistory.push({
          type: 'output',
          content: `zsh: command executed: ${trimmed}`
        });
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg flex flex-col h-[500px] text-left">
      
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
            user@macbook-pro:~ (zsh)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('help')}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300 hover:text-white"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{t.sandbox.helpButton}</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.sandbox.clearButton}</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        className="flex-1 bg-[#090d13] p-4 overflow-y-auto font-mono text-xs space-y-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, idx) => (
          <div key={idx}>
            {item.type === 'input' ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-blue-400">user@macbook</span>
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
          <span className="text-blue-400">user@macbook</span>
          <span className="text-gray-400">%</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.sandbox.inputPlaceholder}
            className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs caret-emerald-400"
          />
        </form>
        <div ref={bottomRef} />
      </div>

      {/* Quick launch shortcuts bar */}
      <div className="bg-[#0d1117] px-3 py-2 border-t border-[#30363d] flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-gray-500 font-mono text-[11px] whitespace-nowrap">{t.sandbox.examplesLabel}</span>
        {['ls -la', 'pwd', 'grep -rn "TODO" .', 'git status', 'python3 --version'].map((cmd, i) => (
          <button
            key={i}
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-emerald-400 font-mono text-[11px] hover:bg-gray-800 whitespace-nowrap"
          >
            $ {cmd}
          </button>
        ))}
      </div>

    </div>
  );
}
