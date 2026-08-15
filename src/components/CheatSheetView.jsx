import React, { useState } from 'react';
import {
  Folder,
  Search,
  Shield,
  Globe,
  Cpu,
  Code2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

const CHEAT_SHEETS = [
  {
    title_en: 'Files & Directories',
    title_ru: 'Файлы и Директории',
    icon: Folder,
    color: 'text-blue-400',
    borderColor: 'border-blue-800/50',
    bgColor: 'bg-blue-950/20',
    items: [
      { cmd: 'ls -la', desc_en: 'Show all files (including hidden) with detailed permissions', desc_ru: 'Показать все файлы (включая скрытые) с подробными правами' },
      { cmd: 'mkdir -p project/src/components', desc_en: 'Create nested directory structure', desc_ru: 'Создать структуру вложенных папок' },
      { cmd: 'cp -r folder1/ folder_backup/', desc_en: 'Recursively copy folder with all contents', desc_ru: 'Рекурсивно скопировать папку со всем содержимым' },
      { cmd: 'mv old_name.txt new_name.txt', desc_en: 'Rename or move file', desc_ru: 'Переименовать или переместить файл' },
      { cmd: 'rm -rf node_modules', desc_en: 'Forcefully and recursively remove directory', desc_ru: 'Принудительно и рекурсивно удалить папку' },
      { cmd: 'find . -name "*.js" -size +1M', desc_en: 'Find .js files larger than 1MB in current directory', desc_ru: 'Найти файлы .js размером более 1 МБ в текущей папке' }
    ]
  },
  {
    title_en: 'Search & Text Processing',
    title_ru: 'Поиск и Работа с Текстом',
    icon: Search,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-800/50',
    bgColor: 'bg-emerald-950/20',
    items: [
      { cmd: 'grep -rn "TODO" ./src', desc_en: 'Recursively search for "TODO" with line numbers', desc_ru: 'Поиск слова TODO рекурсивно с номерами строк' },
      { cmd: 'cat file.txt | grep "ERROR"', desc_en: 'Filter file lines matching "ERROR"', desc_ru: 'Фильтрация строк из файла по слову ERROR' },
      { cmd: 'tail -f /var/log/system.log', desc_en: 'View log file updates in real-time', desc_ru: 'Просмотр лог-файла в реальном времени' },
      { cmd: 'sed -i "" "s/old/new/g" file.txt', desc_en: 'Replace all occurrences of "old" with "new" in file (macOS)', desc_ru: 'Замена слова old на new во всём файле (macOS)' },
      { cmd: 'wc -l file.txt', desc_en: 'Count number of lines in file', desc_ru: 'Подсчитать количество строк в файле' }
    ]
  },
  {
    title_en: 'Permissions & Ownership',
    title_ru: 'Права доступа и Владение',
    icon: Shield,
    color: 'text-red-400',
    borderColor: 'border-red-800/50',
    bgColor: 'bg-red-950/20',
    items: [
      { cmd: 'chmod +x script.sh', desc_en: 'Make script executable', desc_ru: 'Сделать скрипт исполняемым' },
      { cmd: 'chmod 755 script.sh', desc_en: 'Full owner permissions (rwx), read & execute for others (r-x)', desc_ru: 'Полные права владельцу (rwx), чтение и запуск остальным (r-x)' },
      { cmd: 'chown -R user:staff ./app', desc_en: 'Recursively change directory owner and group', desc_ru: 'Рекурсивно сменить владельца и группу папки' },
      { cmd: 'sudo systemctl status nginx', desc_en: 'Execute command with superuser (root) privileges', desc_ru: 'Выполнить команду от имени суперпользователя (root)' }
    ]
  },
  {
    title_en: 'Network & HTTP Requests',
    title_ru: 'Сеть и Сетевые сервисы',
    icon: Globe,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-800/50',
    bgColor: 'bg-cyan-950/20',
    items: [
      { cmd: 'curl -I https://example.com', desc_en: 'Fetch server HTTP response headers only', desc_ru: 'Получить только HTTP заголовки ответа сервера' },
      { cmd: 'curl -O https://example.com/file.zip', desc_en: 'Download file via direct URL', desc_ru: 'Скачать файл по прямой ссылке' },
      { cmd: 'ssh user@192.168.1.50', desc_en: 'Connect to remote server via SSH', desc_ru: 'Подключиться к удалённому серверу по SSH' },
      { cmd: 'scp -r ./dist user@remote:/var/www', desc_en: 'Securely upload directory to server via SSH', desc_ru: 'Безопасно загрузить папку на сервер по SSH' },
      { cmd: 'lsof -i :3000', desc_en: 'Identify process listening on port 3000', desc_ru: 'Найти процесс, занимающий порт 3000' }
    ]
  },
  {
    title_en: 'Processes & Monitoring',
    title_ru: 'Процессы и Мониторинг',
    icon: Cpu,
    color: 'text-amber-400',
    borderColor: 'border-amber-800/50',
    bgColor: 'bg-amber-950/20',
    items: [
      { cmd: 'top -o cpu', desc_en: 'Process monitor sorted by CPU usage', desc_ru: 'Монитор процессов с сортировкой по нагрузке на ЦП' },
      { cmd: 'ps aux | grep node', desc_en: 'Find PIDs of active Node.js processes', desc_ru: 'Найти PID запущенных процессов Node.js' },
      { cmd: 'kill -9 12345', desc_en: 'Forcefully kill process with PID 12345', desc_ru: 'Принудительно завершить процесс с PID 12345' },
      { cmd: 'pkill -f node', desc_en: 'Terminate all processes matching "node"', desc_ru: 'Завершить все процессы, содержащие в имени node' }
    ]
  },
  {
    title_en: 'Git & Version Control',
    title_ru: 'Git и Контроль Версий',
    icon: Code2,
    color: 'text-purple-400',
    borderColor: 'border-purple-800/50',
    bgColor: 'bg-purple-950/20',
    items: [
      { cmd: 'git status', desc_en: 'Show working tree and staging area status', desc_ru: 'Показать состояние рабочей директории и индекса' },
      { cmd: 'git checkout -b feature/new-ui', desc_en: 'Create and switch to new branch', desc_ru: 'Создать новую ветку и сразу перейти на неё' },
      { cmd: 'git log --oneline -n 10', desc_en: 'Show concise history of last 10 commits', desc_ru: 'Краткая история последних 10 коммитов' },
      { cmd: 'git reset --hard HEAD~1', desc_en: 'Reset last commit and discard uncommitted changes', desc_ru: 'Сбросить последний коммит и все незакоммиченные изменения' }
    ]
  }
];

export default function CheatSheetView({ onRunInSandbox, language = 'en', t }) {
  const [copiedCmd, setCopiedCmd] = useState(null);

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-[#30363d] bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-blue-950/20">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white font-mono">
            {t.cheatsheet.bannerTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-300 max-w-2xl">
          {t.cheatsheet.bannerDesc}
        </p>
      </div>

      {/* Grid of Cheat Sheet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHEAT_SHEETS.map((sheet, idx) => {
          const Icon = sheet.icon;
          const title = language === 'ru' ? sheet.title_ru : sheet.title_en;

          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl border ${sheet.borderColor} ${sheet.bgColor} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`p-2 rounded-xl bg-black/40 border ${sheet.borderColor} ${sheet.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-mono font-bold text-base text-white">
                    {title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {sheet.items.map((item, itemIdx) => {
                    const itemDesc = language === 'ru' ? item.desc_ru : item.desc_en;
                    return (
                      <div
                        key={itemIdx}
                        className="p-2.5 rounded-xl bg-[#090d13] border border-[#30363d] group hover:border-[#58a6ff]/40 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <code className="font-mono text-xs font-semibold text-emerald-400 truncate">
                            $ {item.cmd}
                          </code>
                          <button
                            onClick={() => handleCopy(item.cmd)}
                            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                            title={copiedCmd === item.cmd ? t.actions.copied : t.actions.copy}
                          >
                            {copiedCmd === item.cmd ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-snug">
                          {itemDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
