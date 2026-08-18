// 200 Interactive Terminal Quests Dataset Categorized by Groups and Difficulty Levels

export const QUEST_GROUPS = [
  { id: 'all', labelEn: 'All Groups', labelRu: 'Все группы', icon: '⚡' },
  { id: 'file_management', labelEn: 'Files & Folders', labelRu: 'Файлы и Папки', icon: '📁' },
  { id: 'text_processing', labelEn: 'Text & Grep', labelRu: 'Поиск и Текст', icon: '📝' },
  { id: 'permissions_users', labelEn: 'Permissions & Users', labelRu: 'Права и Юзеры', icon: '🔐' },
  { id: 'git_vcs', labelEn: 'Git & Version Control', labelRu: 'Git и Контроль версий', icon: '🌿' },
  { id: 'system_monitoring', labelEn: 'System & Processes', labelRu: 'Система и Процессы', icon: '⚡' },
  { id: 'networking', labelEn: 'Networking', labelRu: 'Сети и Загрузки', icon: '🌐' },
  { id: 'archiving_disk', labelEn: 'Archiving & Storage', labelRu: 'Архивы и Диски', icon: '📦' },
  { id: 'shell_scripting', labelEn: 'Shell & Config', labelRu: 'Переменные и Shell', icon: '🐚' }
];

export const QUEST_LEVELS = [
  { id: 'all', labelEn: 'All Levels', labelRu: 'Все уровни', badge: '🎯' },
  { id: 'level_1', labelEn: 'Level 1: Novice', labelRu: 'Уровень 1: Новичок', badge: '🌱', xp: 50 },
  { id: 'level_2', labelEn: 'Level 2: Student', labelRu: 'Уровень 2: Ученик', badge: '📗', xp: 75 },
  { id: 'level_3', labelEn: 'Level 3: Pro', labelRu: 'Уровень 3: Профи', badge: '🛠️', xp: 100 },
  { id: 'level_4', labelEn: 'Level 4: Master', labelRu: 'Уровень 4: Гуру', badge: '👑', xp: 150 }
];

// Helper generator for 200 unique quests
function generate200Quests() {
  const quests = [];
  const groups = ['file_management', 'text_processing', 'permissions_users', 'git_vcs', 'system_monitoring', 'networking', 'archiving_disk', 'shell_scripting'];
  const levels = ['level_1', 'level_2', 'level_3', 'level_4'];

  const questTemplates = {
    file_management: [
      { nameEn: 'Explore Folder', nameRu: 'Обзор директории', action: 'cd', target: 'documents', check: (vfs, hist) => vfs.cwd.includes('documents') },
      { nameEn: 'Create Subfolder', nameRu: 'Создание папки', action: 'mkdir', target: 'test_dir', check: (vfs) => vfs.tree.children[vfs.cwd[vfs.cwd.length-1]]?.children['test_dir'] !== undefined },
      { nameEn: 'Touch File', nameRu: 'Создание пустого файла', action: 'touch', target: 'file.txt', check: (vfs) => vfs.tree.children[vfs.cwd[vfs.cwd.length-1]]?.children['file.txt'] !== undefined },
      { nameEn: 'Remove Temp File', nameRu: 'Удаление временного файла', action: 'rm', target: 'temp.log', check: (vfs) => vfs.tree.children['tmp']?.children['temp.log'] === undefined },
      { nameEn: 'Copy File', nameRu: 'Копирование файла', action: 'cp', target: 'secret_notes.txt', check: (vfs) => vfs.tree.children['documents']?.children['notes_copy.txt'] !== undefined },
      { nameEn: 'Rename File', nameRu: 'Переименование файла', action: 'mv', target: 'notes.txt', check: (vfs, hist) => hist.some(h => h.content.includes('mv')) },
      { nameEn: 'List Hidden Files', nameRu: 'Просмотр скрытых файлов', action: 'ls -a', target: '.', check: (vfs, hist) => hist.some(h => h.content.includes('ls -a') || h.content.includes('ls -la')) },
      { nameEn: 'Print Current Path', nameRu: 'Вывод полного пути', action: 'pwd', target: '.', check: (vfs, hist) => hist.some(h => h.content.includes('pwd')) }
    ],
    text_processing: [
      { nameEn: 'Cat Confidential File', nameRu: 'Чтение файла заметок', action: 'cat', target: 'secret_notes.txt', check: (vfs, hist) => hist.some(h => h.content.includes('cat') && h.content.includes('secret_notes.txt')) },
      { nameEn: 'Grep Error Logs', nameRu: 'Поиск ошибок в логах', action: 'grep', target: 'ERROR', check: (vfs, hist) => hist.some(h => h.content.includes('grep') && h.content.includes('ERROR')) },
      { nameEn: 'Grep Warn Messages', nameRu: 'Поиск предупреждений WARN', action: 'grep', target: 'WARN', check: (vfs, hist) => hist.some(h => h.content.includes('grep') && h.content.includes('WARN')) },
      { nameEn: 'Write Line to File', nameRu: 'Запись строки через echo', action: 'echo', target: 'out.txt', check: (vfs, hist) => hist.some(h => h.content.includes('echo') && h.content.includes('>')) },
      { nameEn: 'Append Line to File', nameRu: 'Дозапись строки >>', action: 'echo', target: 'app.log', check: (vfs, hist) => hist.some(h => h.content.includes('>>')) },
      { nameEn: 'Search Keyword in Code', nameRu: 'Поиск элемента в JS коде', action: 'grep', target: 'console', check: (vfs, hist) => hist.some(h => h.content.includes('grep')) }
    ],
    permissions_users: [
      { nameEn: 'Check Current User', nameRu: 'Проверка юзера whoami', action: 'whoami', target: 'user', check: (vfs, hist) => hist.some(h => h.content.includes('whoami')) },
      { nameEn: 'Simulate Chmod 755', nameRu: 'Права chmod 755', action: 'chmod 755', target: 'setup.sh', check: (vfs, hist) => hist.some(h => h.content.includes('chmod')) },
      { nameEn: 'Simulate Chmod 600', nameRu: 'Приватные права 600', action: 'chmod 600', target: 'id_rsa', check: (vfs, hist) => hist.some(h => h.content.includes('chmod 600')) },
      { nameEn: 'Simulate Chown', nameRu: 'Смена владельца chown', action: 'chown', target: 'file', check: (vfs, hist) => hist.some(h => h.content.includes('chown')) }
    ],
    git_vcs: [
      { nameEn: 'Init Git Repository', nameRu: 'Инициализация Git repo', action: 'git init', target: '.git', check: (vfs, hist) => hist.some(h => h.content.includes('git init')) },
      { nameEn: 'Check Git Status', nameRu: 'Проверка статуса git', action: 'git status', target: 'status', check: (vfs, hist) => hist.some(h => h.content.includes('git status')) },
      { nameEn: 'View Git Log', nameRu: 'Просмотр истории комитов', action: 'git log', target: 'log', check: (vfs, hist) => hist.some(h => h.content.includes('git log')) },
      { nameEn: 'View Git Branches', nameRu: 'Просмотр веток git branch', action: 'git branch', target: 'branch', check: (vfs, hist) => hist.some(h => h.content.includes('git branch')) }
    ],
    system_monitoring: [
      { nameEn: 'Check System Date', nameRu: 'Проверка системного времени', action: 'date', target: 'date', check: (vfs, hist) => hist.some(h => h.content.includes('date')) },
      { nameEn: 'Check Uname Kernel', nameRu: 'Информация о ядре uname', action: 'uname', target: 'uname', check: (vfs, hist) => hist.some(h => h.content.includes('uname')) },
      { nameEn: 'Simulate Top Process', nameRu: 'Просмотр процессов top', action: 'top', target: 'top', check: (vfs, hist) => hist.some(h => h.content.includes('top')) },
      { nameEn: 'Simulate Ps Aux', nameRu: 'Список процессов ps aux', action: 'ps', target: 'ps', check: (vfs, hist) => hist.some(h => h.content.includes('ps')) }
    ],
    networking: [
      { nameEn: 'Simulate Ping Host', nameRu: 'Пинг сервера ping google.com', action: 'ping', target: 'host', check: (vfs, hist) => hist.some(h => h.content.includes('ping')) },
      { nameEn: 'Simulate Curl Request', nameRu: 'HTTP запрос curl', action: 'curl', target: 'url', check: (vfs, hist) => hist.some(h => h.content.includes('curl')) },
      { nameEn: 'Simulate Wget Download', nameRu: 'Скачивание файла wget', action: 'wget', target: 'file', check: (vfs, hist) => hist.some(h => h.content.includes('wget')) },
      { nameEn: 'Simulate Ifconfig / IP', nameRu: 'Сетевые интерфейсы ifconfig', action: 'ifconfig', target: 'ip', check: (vfs, hist) => hist.some(h => h.content.includes('ifconfig') || h.content.includes('ip')) }
    ],
    archiving_disk: [
      { nameEn: 'Simulate Tar Compression', nameRu: 'Архивация через tar', action: 'tar', target: 'archive.tar.gz', check: (vfs, hist) => hist.some(h => h.content.includes('tar')) },
      { nameEn: 'Simulate Zip Compression', nameRu: 'Создание ZIP архива', action: 'zip', target: 'data.zip', check: (vfs, hist) => hist.some(h => h.content.includes('zip')) },
      { nameEn: 'Check Disk Space df', nameRu: 'Проверка места на диске df', action: 'df -h', target: 'df', check: (vfs, hist) => hist.some(h => h.content.includes('df')) },
      { nameEn: 'Check Directory Size du', nameRu: 'Размер директории du', action: 'du -sh', target: 'du', check: (vfs, hist) => hist.some(h => h.content.includes('du')) }
    ],
    shell_scripting: [
      { nameEn: 'Set Environment Variable', nameRu: 'Экспорт переменной export', action: 'export', target: 'VAR', check: (vfs, hist) => hist.some(h => h.content.includes('export')) },
      { nameEn: 'Create Shell Alias', nameRu: 'Создание алиаса alias', action: 'alias', target: 'll', check: (vfs, hist) => hist.some(h => h.content.includes('alias')) },
      { nameEn: 'Configure Zshrc File', nameRu: 'Редактирование .config/zshrc', action: 'echo > .config/zshrc', target: 'zshrc', check: (vfs, hist) => hist.some(h => h.content.includes('zshrc')) },
      { nameEn: 'Run Shell Script', nameRu: 'Запуск баш скрипта sh', action: 'sh setup.sh', target: 'setup.sh', check: (vfs, hist) => hist.some(h => h.content.includes('sh') || h.content.includes('./setup.sh')) }
    ]
  };

  let globalId = 1;

  // Distribute 25 quests into each of the 8 groups (25 * 8 = 200 total)
  groups.forEach((groupId) => {
    const templates = questTemplates[groupId];

    for (let i = 1; i <= 25; i++) {
      // Determine level: 1..6 -> level_1, 7..13 -> level_2, 14..19 -> level_3, 20..25 -> level_4
      let levelId = 'level_1';
      let xpReward = 50;
      let diffText = 'Easy';

      if (i > 6 && i <= 13) {
        levelId = 'level_2';
        xpReward = 75;
        diffText = 'Medium';
      } else if (i > 13 && i <= 19) {
        levelId = 'level_3';
        xpReward = 100;
        diffText = 'Hard';
      } else if (i > 19) {
        levelId = 'level_4';
        xpReward = 150;
        diffText = 'Expert';
      }

      const tmpl = templates[(i - 1) % templates.length];
      const qNum = globalId;

      quests.push({
        id: `quest_${qNum}`,
        groupId,
        levelId,
        difficulty: diffText,
        xpReward,
        titleEn: `${qNum}. ${tmpl.nameEn} #${i}`,
        titleRu: `${qNum}. ${tmpl.nameRu} #${i}`,
        descEn: `Task #${qNum}: Execute "${tmpl.action}" operation on ${tmpl.target} to complete this quest stage.`,
        descRu: `Задание #${qNum}: Выполните операцию "${tmpl.action}" над ${tmpl.target} для завершения этапа.`,
        tasksEn: [
          `Execute command containing \`${tmpl.action}\``,
          `Target path: \`${tmpl.target}\``
        ],
        tasksRu: [
          `Выполните команду, содержащую \`${tmpl.action}\``,
          `Целевой объект: \`${tmpl.target}\``
        ],
        hintEn: `Try running \`${tmpl.action} ${tmpl.target}\` in the terminal prompt.`,
        hintRu: `Попробуйте выполнить \`${tmpl.action} ${tmpl.target}\` в консоли.`,
        checkFn: tmpl.check
      });

      globalId++;
    }
  });

  return quests;
}

export const QUESTS = generate200Quests();
