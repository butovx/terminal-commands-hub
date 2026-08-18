// Quiz Questions & Command Master Trivia Data

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'FileSystem',
    questionEn: 'Which command lists all files including hidden files starting with a dot (.)?',
    questionRu: 'Какая команда выводит список всех файлов, включая скрытые файлы с точкой (.)?',
    options: ['ls -l', 'ls -a', 'ls -h', 'dir /all'],
    correct: 1,
    explanationEn: 'The `-a` (or `--all`) flag tells `ls` to include directory entries that start with a dot (.)',
    explanationRu: 'Флаг `-a` (или `--all`) заставляет `ls` показывать скрытые элементы, начинающиеся с точки (.)'
  },
  {
    id: 2,
    category: 'Permissions',
    questionEn: 'What command gives read, write, and execute permissions to the file owner (700)?',
    questionRu: 'Какая команда дает права чтения, записи и выполнения владельцу файла (700)?',
    options: ['chmod 777 file', 'chmod 700 file', 'chown 700 file', 'chgrp 700 file'],
    correct: 1,
    explanationEn: '`chmod 700 file` sets Read (4) + Write (2) + Execute (1) = 7 for owner, and 0 for group and others.',
    explanationRu: '`chmod 700 file` задает Чтение (4) + Запись (2) + Выполнение (1) = 7 для владельца и 0 для остальных.'
  },
  {
    id: 3,
    category: 'Text Processing',
    questionEn: 'Which tool is best suited for searching matching text patterns using regular expressions in files?',
    questionRu: 'Какая утилита лучше всего подходит для поиска шаблонов текста с помощью регулярных выражений в файлах?',
    options: ['cat', 'grep', 'touch', 'tar'],
    correct: 1,
    explanationEn: '`grep` (Global Regular Expression Print) searches line by line for matching patterns in files.',
    explanationRu: '`grep` (Global Regular Expression Print) выполняет построчный поиск заданных шаблонов в файлах.'
  },
  {
    id: 4,
    category: 'Processes',
    questionEn: 'How do you forcefully terminate a unresponsive process with PID 4321?',
    questionRu: 'Как принудительно завершить зависший процесс с PID 4321?',
    options: ['kill -9 4321', 'stop 4321', 'end -f 4321', 'exit 4321'],
    correct: 0,
    explanationEn: '`kill -9 4321` sends the SIGKILL signal (signal 9) which immediately terminates the process.',
    explanationRu: '`kill -9 4321` отправляет сигнал SIGKILL (сигнал 9), который немедленно завершает процесс.'
  },
  {
    id: 5,
    category: 'Networking',
    questionEn: 'Which command tests network latency and host connectivity by sending ICMP ECHO_REQUEST packets?',
    questionRu: 'Какая команда проверяет задержку сети и доступность узла путем отправки ICMP-пакетов?',
    options: ['curl', 'ping', 'netstat', 'ifconfig'],
    correct: 1,
    explanationEn: '`ping` sends ICMP ECHO_REQUEST packets to network hosts to check connectivity and round-trip time.',
    explanationRu: '`ping` отправляет ICMP-запросы сетевому узлу для проверки связи и времени задержки.'
  },
  {
    id: 6,
    category: 'Git',
    questionEn: 'Which Git command displays the state of the working directory and staging area?',
    questionRu: 'Какая команда Git показывает состояние рабочей директории и индексных файлов?',
    options: ['git diff', 'git status', 'git log', 'git check'],
    correct: 1,
    explanationEn: '`git status` inspects tracked, untracked, and modified files in the repository.',
    explanationRu: '`git status` инспектирует отслеживаемые, неотслеживаемые и измененные файлы репозитория.'
  },
  {
    id: 7,
    category: 'Archives',
    questionEn: 'Which command compresses a folder "dist" into a gzip archive "dist.tar.gz"?',
    questionRu: 'Какая команда сжимает папку "dist" в архив gzip "dist.tar.gz"?',
    options: ['zip -r dist.tar.gz dist', 'tar -czvf dist.tar.gz dist', 'gzip -c dist', 'pack dist.tar.gz'],
    correct: 1,
    explanationEn: '`tar -czvf` creates (-c), gzips (-z), shows verbose output (-v), writing to file (-f).',
    explanationRu: '`tar -czvf` создает (-c), сжимает gzip (-z), выводит детали (-v), пишет в файл (-f).'
  },
  {
    id: 8,
    category: 'System Info',
    questionEn: 'Which command displays available disk space on mounted file systems in human-readable format?',
    questionRu: 'Какая команда отображает свободное место на дисках в понятном для человека формате (MB/GB)?',
    options: ['du -sh *', 'df -h', 'top', 'free -m'],
    correct: 1,
    explanationEn: '`df -h` (Disk Free, human-readable) displays total, used, and available space on file systems.',
    explanationRu: '`df -h` (Disk Free) показывает общий, занятый и свободный объем на всех смонтированных дисках.'
  }
];
