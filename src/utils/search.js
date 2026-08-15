// Russian to English Intent & Synonym Dictionary
const SYNONYMS = {
  'поиск': ['grep', 'find', 'locate', 'search', 'which', 'whereis', 'whatis', 'apropos'],
  'найти': ['grep', 'find', 'locate', 'search', 'which', 'whereis'],
  'искать': ['grep', 'find', 'locate', 'search'],
  'удалить': ['rm', 'rmdir', 'unlink', 'delete', 'clean', 'purge', 'remove'],
  'удаление': ['rm', 'rmdir', 'unlink', 'delete', 'clean', 'remove'],
  'стереть': ['rm', 'clear', 'erase'],
  'копировать': ['cp', 'scp', 'rsync', 'copy', 'duplicate'],
  'копирование': ['cp', 'scp', 'rsync', 'copy'],
  'переместить': ['mv', 'move', 'rename'],
  'переименовать': ['mv', 'rename'],
  'создать': ['mkdir', 'touch', 'create', 'mktemp', 'new'],
  'создание': ['mkdir', 'touch', 'create', 'mktemp'],
  'папка': ['mkdir', 'cd', 'ls', 'pwd', 'directory', 'folder', 'rmdir'],
  'папки': ['mkdir', 'cd', 'ls', 'pwd', 'directory', 'folder'],
  'директория': ['mkdir', 'cd', 'ls', 'pwd', 'directory', 'folder'],
  'каталог': ['mkdir', 'cd', 'ls', 'pwd', 'directory', 'folder'],
  'файл': ['file', 'cat', 'touch', 'head', 'tail', 'less', 'stat'],
  'файлы': ['file', 'ls', 'find', 'cat', 'touch'],
  'процесс': ['top', 'htop', 'ps', 'kill', 'pkill', 'killall', 'lsof', 'process'],
  'процессы': ['top', 'htop', 'ps', 'kill', 'pkill', 'killall', 'lsof', 'process'],
  'сеть': ['ping', 'curl', 'wget', 'netstat', 'ssh', 'ifconfig', 'ip', 'dig', 'network'],
  'сетевые': ['ping', 'curl', 'wget', 'netstat', 'ssh', 'network'],
  'права': ['chmod', 'chown', 'chgrp', 'umask', 'sudo', 'permissions'],
  'доступ': ['chmod', 'chown', 'sudo', 'access'],
  'архив': ['tar', 'zip', 'unzip', 'gzip', 'bzip2', '7z', 'archive', 'compress'],
  'архивация': ['tar', 'zip', 'gzip', 'archive', 'compress'],
  'распаковка': ['unzip', 'tar', 'gunzip', 'unxz', 'extract'],
  'гит': ['git'],
  'питон': ['python', 'python3', 'pip'],
  'пайтон': ['python', 'python3'],
  'докер': ['docker', 'docker-compose'],
  'доккер': ['docker'],
  'очистить': ['clear', 'reset'],
  'очистка': ['clear', 'reset', 'clean'],
  'история': ['history'],
  'справка': ['man', 'help', 'info', 'whatis', 'apropos'],
  'помощь': ['man', 'help', 'info'],
  'выход': ['exit', 'quit', 'logout'],
  'текст': ['cat', 'grep', 'sed', 'awk', 'echo', 'head', 'tail', 'cut', 'sort'],
  'редактирование': ['nano', 'vim', 'vi', 'sed', 'awk', 'edit']
};

/**
 * Normalizes text for robust comparison
 */
function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[._\-/\\]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Searches and scores commands against a query string.
 * Returns array of matching commands sorted by relevance score.
 */
export function searchCommands(commands, query) {
  if (!query || !query.trim()) {
    return commands;
  }

  const rawQuery = query.toLowerCase().trim();
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  // Check synonym expansion
  const expandedTokens = [...queryTokens];
  queryTokens.forEach(token => {
    if (SYNONYMS[token]) {
      expandedTokens.push(...SYNONYMS[token]);
    }
  });

  const scored = [];

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const cmdName = cmd.name.toLowerCase();
    const normalizedName = normalize(cmd.name);
    const ruDesc = (cmd.ru_desc || '').toLowerCase();
    const primaryDesc = (cmd.primary_desc || '').toLowerCase();
    const tagsStr = (cmd.tags || []).join(' ').toLowerCase();
    const detailsStr = (cmd.details || []).join(' ').toLowerCase();

    let score = 0;

    // 1. Exact match on command name -> Maximum priority (+2000)
    if (cmdName === rawQuery || normalizedName === normalizedQuery) {
      score += 2000;
    }
    // 2. Command name starts with query -> High priority (+800)
    else if (cmdName.startsWith(rawQuery) || normalizedName.startsWith(normalizedQuery)) {
      score += 800;
    }
    // 3. Command name contains raw query -> (+400)
    else if (cmdName.includes(rawQuery)) {
      score += 400;
    }

    // Token-based matching & Scoring across all tokens
    let matchesAllTokens = true;

    for (const token of queryTokens) {
      let tokenMatched = false;
      
      // Synonym match
      const synList = SYNONYMS[token] || [];
      if (synList.includes(cmdName) || synList.some(s => cmdName.includes(s))) {
        score += 350;
        tokenMatched = true;
      }

      if (cmdName.includes(token)) {
        score += 250;
        tokenMatched = true;
      } else if (ruDesc.includes(token)) {
        score += 150;
        tokenMatched = true;
      } else if (tagsStr.includes(token)) {
        score += 120;
        tokenMatched = true;
      } else if (primaryDesc.includes(token)) {
        score += 80;
        tokenMatched = true;
      } else if (detailsStr.includes(token)) {
        score += 30;
        tokenMatched = true;
      }

      if (!tokenMatched) {
        matchesAllTokens = false;
      }
    }

    // Only include commands where query conditions matched
    if (score > 0 && (matchesAllTokens || score >= 200)) {
      scored.push({ cmd, score });
    }
  }

  // Sort by score descending, then by command length (shorter names first), then alphabetically
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.cmd.name.length !== b.cmd.name.length) {
      return a.cmd.name.length - b.cmd.name.length;
    }
    return a.cmd.name.localeCompare(b.cmd.name);
  });

  return scored.map(item => item.cmd);
}
