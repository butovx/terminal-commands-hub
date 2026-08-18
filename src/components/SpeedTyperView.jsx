import React, { useState, useEffect, useRef } from 'react';
import { Zap, Timer, RotateCcw, CheckCircle2, Trophy } from 'lucide-react';

const SPEED_COMMANDS = [
  'ls -la ~/documents',
  'grep -rn "TODO" ./src',
  'chmod 755 script.sh',
  'git commit -m "feat: add gamification"',
  'tar -czvf archive.tar.gz ./dist',
  'find . -name "*.log" -type f',
  'docker run -d -p 8080:80 nginx',
  'curl -s https://api.github.com/users',
  'ps aux | grep node',
  'ssh -i ~/.ssh/id_rsa user@remote.server'
];

export default function SpeedTyperView({ onEarnXp, language = 'en', t }) {
  const [commandIndex, setCommandIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalChars, setTotalChars] = useState(0);
  const [errors, setErrors] = useState(0);

  const inputRef = useRef(null);
  const targetCommand = SPEED_COMMANDS[commandIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [commandIndex, isCompleted]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Error count tracking
    if (val.length > input.length) {
      const addedCharIdx = val.length - 1;
      if (val[addedCharIdx] !== targetCommand[addedCharIdx]) {
        setErrors(prev => prev + 1);
      }
    }

    setInput(val);

    // If current command matched exactly
    if (val === targetCommand) {
      setTotalChars(prev => prev + targetCommand.length);
      
      if (commandIndex + 1 < SPEED_COMMANDS.length) {
        setCommandIndex(prev => prev + 1);
        setInput('');
      } else {
        const now = Date.now();
        setEndTime(now);
        setIsCompleted(true);

        const timeInMinutes = (now - (startTime || now)) / 1000 / 60;
        const totalWords = (totalChars + targetCommand.length) / 5;
        const calculatedWpm = timeInMinutes > 0 ? Math.round(totalWords / timeInMinutes) : 45;

        const badgeId = calculatedWpm >= 40 ? 'speed_demon' : null;
        onEarnXp(Math.max(30, calculatedWpm * 2), `Speed race score ${calculatedWpm} WPM`, badgeId);
      }
    }
  };

  const handleRestart = () => {
    setCommandIndex(0);
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
    setTotalChars(0);
    setErrors(0);
  };

  // Compute live WPM and Accuracy
  const timeElapsedSec = startTime ? (Date.now() - startTime) / 1000 : 0;
  const liveWpm = timeElapsedSec > 0 ? Math.round(((totalChars + input.length) / 5) / (timeElapsedSec / 60)) : 0;
  const accuracy = totalChars + input.length > 0
    ? Math.max(0, Math.round(((totalChars + input.length - errors) / (totalChars + input.length)) * 100))
    : 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400" />
            {t.speedtyper.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t.speedtyper.subtitle}
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d] font-mono text-xs">
          <div>
            <span className="text-gray-400 block text-[10px]">{t.speedtyper.wpm}</span>
            <strong className="text-cyan-400 text-sm">{liveWpm}</strong>
          </div>
          <div className="w-px h-6 bg-[#30363d]" />
          <div>
            <span className="text-gray-400 block text-[10px]">{t.speedtyper.accuracy}</span>
            <strong className="text-emerald-400 text-sm">{accuracy}%</strong>
          </div>
          <div className="w-px h-6 bg-[#30363d]" />
          <div>
            <span className="text-gray-400 block text-[10px]">{t.speedtyper.progress}</span>
            <strong className="text-white text-sm">{commandIndex} / {SPEED_COMMANDS.length}</strong>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl space-y-6 shadow-xl text-center">
          
          <div className="text-xs text-gray-400 font-mono">
            {t.speedtyper.typePrompt}
          </div>

          {/* Character Highlight Box */}
          <div className="bg-[#090d13] p-6 rounded-xl border border-[#30363d] font-mono text-lg tracking-wider text-left overflow-x-auto whitespace-nowrap">
            {targetCommand.split('').map((char, idx) => {
              let charStyle = 'text-gray-500';
              if (idx < input.length) {
                if (input[idx] === char) {
                  charStyle = 'text-emerald-400 bg-emerald-500/20 rounded font-bold';
                } else {
                  charStyle = 'text-red-400 bg-red-500/30 rounded underline';
                }
              }
              return (
                <span key={idx} className={charStyle}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Input */}
          <div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Start typing command here..."
              className="w-full max-w-lg px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>

        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto text-3xl">
            ⚡
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono">{t.speedtyper.completeTitle}</h3>
            <p className="text-sm text-cyan-400 font-mono font-bold mt-2">
              {t.speedtyper.bestWpm.replace('{{wpm}}', liveWpm)}
            </p>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Accuracy: {accuracy}% • Errors: {errors}
            </p>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-[#21262d] text-white border border-[#30363d] rounded-xl text-xs font-mono font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              {t.speedtyper.restart}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
