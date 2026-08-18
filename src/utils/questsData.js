// Quests & Terminal Lab Challenges Data

export const QUESTS = [
  {
    id: 'quest_1',
    titleEn: '1. File Explorer',
    titleRu: '1. Навигатор в консоли',
    difficulty: 'Easy',
    xpReward: 75,
    descEn: 'Navigate into the "documents" directory and view the contents of "secret_notes.txt".',
    descRu: 'Перейдите в папку "documents" и посмотрите содержимое файла "secret_notes.txt".',
    tasksEn: [
      'Use `cd documents` to enter the documents folder',
      'Use `cat secret_notes.txt` to read the confidential file'
    ],
    tasksRu: [
      'Используйте `cd documents`, чтобы перейти в папку documents',
      'Используйте `cat secret_notes.txt`, чтобы прочитать файл'
    ],
    hintEn: 'Type "ls" to see available folders, then "cd documents" and "cat secret_notes.txt".',
    hintRu: 'Введите "ls" для просмотра папок, затем "cd documents" и "cat secret_notes.txt".',
    checkFn: (vfsState, history) => {
      const readNotes = history.some(h => h.type === 'input' && h.content.includes('cat') && h.content.includes('secret_notes.txt'));
      const inDocs = vfsState.cwd.includes('documents') || history.some(h => h.type === 'input' && h.content.includes('cd documents'));
      return readNotes && inDocs;
    }
  },
  {
    id: 'quest_2',
    titleEn: '2. Directory Architect',
    titleRu: '2. Архитектор каталогов',
    difficulty: 'Medium',
    xpReward: 100,
    descEn: 'Create a new directory named "backups" in your home folder, then create a file "system.cfg" inside it.',
    descRu: 'Создайте новую папку "backups" в домашней директории, а затем файл "system.cfg" внутри нее.',
    tasksEn: [
      'Execute `mkdir backups` in your home folder',
      'Execute `cd backups` and `touch system.cfg`'
    ],
    tasksRu: [
      'Выполните `mkdir backups` в домашней папке',
      'Перейдите `cd backups` и выполните `touch system.cfg`'
    ],
    hintEn: 'Run "mkdir backups", then "cd backups" followed by "touch system.cfg".',
    hintRu: 'Выполните "mkdir backups", затем "cd backups" и "touch system.cfg".',
    checkFn: (vfsState) => {
      const rootChildren = vfsState.tree.children;
      const backupsNode = rootChildren['backups'];
      return backupsNode && backupsNode.type === 'dir' && backupsNode.children['system.cfg'] !== undefined;
    }
  },
  {
    id: 'quest_3',
    titleEn: '3. Log Detective',
    titleRu: '3. Детектив Логов',
    difficulty: 'Medium',
    xpReward: 100,
    descEn: 'Search for critical "ERROR" entries inside the system log file "logs/sys.log" using the grep command.',
    descRu: 'Найдите критические записи "ERROR" в системном лог-файле "logs/sys.log" с помощью команды grep.',
    tasksEn: [
      'Run `grep ERROR logs/sys.log` (or `cd logs` then `grep ERROR sys.log`)'
    ],
    tasksRu: [
      'Запустите `grep ERROR logs/sys.log` (или `cd logs`, затем `grep ERROR sys.log`)'
    ],
    hintEn: 'The syntax for grep is: `grep [search_word] [filename]`. Try `grep ERROR logs/sys.log`.',
    hintRu: 'Синтаксис grep: `grep [искомое_слово] [имя_файла]`. Попробуйте `grep ERROR logs/sys.log`.',
    checkFn: (vfsState, history) => {
      return history.some(h => 
        h.type === 'input' && 
        h.content.toLowerCase().includes('grep') && 
        h.content.includes('ERROR') && 
        h.content.includes('sys.log')
      );
    }
  },
  {
    id: 'quest_4',
    titleEn: '4. System Cleanup',
    titleRu: '4. Очистка Мусора',
    difficulty: 'Medium',
    xpReward: 100,
    descEn: 'Delete the temporary cache file "temp.log" located inside the "tmp" directory using the rm command.',
    descRu: 'Удалите временный файл "temp.log", расположенный в папке "tmp", с помощью команды rm.',
    tasksEn: [
      'Navigate into `tmp` or target it directly',
      'Remove `temp.log` using `rm temp.log`'
    ],
    tasksRu: [
      'Перейдите в `tmp` или укажите путь к файлу',
      'Удалите `temp.log` с помощью `rm temp.log`'
    ],
    hintEn: 'You can run `cd tmp` and then `rm temp.log`.',
    hintRu: 'Вы можете выполнить `cd tmp`, а затем `rm temp.log`.',
    checkFn: (vfsState) => {
      const tmpNode = vfsState.tree.children['tmp'];
      return tmpNode && tmpNode.type === 'dir' && tmpNode.children['temp.log'] === undefined;
    }
  },
  {
    id: 'quest_5',
    titleEn: '5. Zsh Shell Configurator',
    titleRu: '5. Настройка Конфига Zsh',
    difficulty: 'Hard',
    xpReward: 150,
    descEn: 'Add a custom alias `alias project="cd ~/projects"` to the `.config/zshrc` file using the echo redirection operator `>`.',
    descRu: 'Добавьте кастомный алиас `alias project="cd ~/projects"` в файл `.config/zshrc` с помощью оператора перенаправления `>`.',
    tasksEn: [
      'Use `echo "alias project=\\"cd ~/projects\\"" > .config/zshrc`'
    ],
    tasksRu: [
      'Используйте `echo "alias project=\\"cd ~/projects\\"" > .config/zshrc`'
    ],
    hintEn: 'Use `echo "alias project" > .config/zshrc`.',
    hintRu: 'Используйте `echo "alias project" > .config/zshrc`.',
    checkFn: (vfsState) => {
      const configNode = vfsState.tree.children['.config'];
      const zshrc = configNode?.children?.['zshrc'];
      return zshrc && zshrc.content.includes('alias project');
    }
  }
];
