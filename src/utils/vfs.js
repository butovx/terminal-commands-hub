// Virtual File System (VFS) Engine with Rich Pre-populated Environment for 200 Quests

export function createInitialVFS() {
  return {
    cwd: ['~'],
    tree: {
      type: 'dir',
      children: {
        'documents': {
          type: 'dir',
          children: {
            'secret_notes.txt': { type: 'file', content: 'CONFIDENTIAL: Project Antigravity API key is active.\nWelcome to Terminal Commands Hub!' },
            'report.md': { type: 'file', content: '# Quarterly Terminal Report\n- 1800+ commands indexed\n- Zsh & Bash compatibility verified' },
            'notes.txt': { type: 'file', content: 'Meeting notes:\n1. Update server dependencies\n2. Backup database at 00:00\n3. Check system logs' },
            'budget.csv': { type: 'file', content: 'Category,Amount\nServers,500\nDomains,50\nCDN,120' }
          }
        },
        'projects': {
          type: 'dir',
          children: {
            'app.js': { type: 'file', content: 'console.log("Hello from Terminal Hub Virtual Environment!");' },
            'package.json': { type: 'file', content: '{\n  "name": "terminal-app",\n  "version": "1.0.0",\n  "main": "app.js"\n}' },
            'README.md': { type: 'file', content: '# Terminal Project\nWelcome to Terminal Commands Explorer sandbox!' },
            'src': {
              type: 'dir',
              children: {
                'index.js': { type: 'file', content: '// Main entry point\nimport app from "./app";\nconsole.log("Starting...");' },
                'utils.js': { type: 'file', content: '// Utility functions\nexport const add = (a, b) => a + b;' }
              }
            }
          }
        },
        'git_repo': {
          type: 'dir',
          children: {
            '.git': { type: 'dir', children: { 'HEAD': { type: 'file', content: 'ref: refs/heads/main' } } },
            'main.py': { type: 'file', content: 'print("Hello Python Git Repo")' },
            'config.ini': { type: 'file', content: '[database]\nhost=localhost\nport=5432' }
          }
        },
        'logs': {
          type: 'dir',
          children: {
            'sys.log': { type: 'file', content: '2026-08-18 10:00:00 [INFO] System boot clean.\n2026-08-18 10:02:15 [WARN] High memory usage.\n2026-08-18 10:05:00 [ERROR] Password auth attempt failed for admin.\n2026-08-18 10:10:00 [CRITICAL] Database connection timeout.' },
            'access.log': { type: 'file', content: '127.0.0.1 GET /index.html 200\n192.168.1.5 POST /login 401\n127.0.0.1 GET /api/v1/commands 200\n10.0.0.1 GET /admin 403' },
            'error.log': { type: 'file', content: 'ERROR: NullPointerException in module auth.js\nERROR: Connection refused on port 8080' }
          }
        },
        'downloads': {
          type: 'dir',
          children: {
            'setup.sh': { type: 'file', content: '#!/bin/bash\necho "Running setup..."\nmkdir -p ~/bin' },
            'data.tar.gz': { type: 'file', content: '[MOCK ARCHIVE DATA]' },
            'image.png.bak': { type: 'file', content: '[MOCK IMAGE CONTENT]' }
          }
        },
        'tmp': {
          type: 'dir',
          children: {
            'temp.log': { type: 'file', content: 'Temporary cache file generated during session' },
            'cache.tmp': { type: 'file', content: 'Cache data v1' },
            'old_session.txt': { type: 'file', content: 'Session expired' }
          }
        },
        '.config': {
          type: 'dir',
          children: {
            'zshrc': { type: 'file', content: 'alias ll="ls -la"\nalias g="git"\nexport PATH=$PATH:/usr/local/bin\nexport EDITOR=vim' },
            'bashrc': { type: 'file', content: 'export PS1="\\u@\\h:\\w\\$ "' }
          }
        }
      }
    }
  };
}

export function formatPath(cwd) {
  return cwd.join('/');
}

function resolvePath(cwd, pathStr) {
  if (!pathStr || pathStr === '~') return ['~'];
  const parts = pathStr.split('/').filter(Boolean);
  let result = pathStr.startsWith('/') || pathStr.startsWith('~') ? ['~'] : [...cwd];

  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') {
      if (result.length > 1) result.pop();
    } else {
      result.push(p);
    }
  }
  return result;
}

export function executeVfsCommand(vfsState, inputStr, commandsCatalog = [], language = 'en') {
  const trimmed = inputStr.trim();
  if (!trimmed) return { output: '', vfsState, action: null };

  const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1).map(a => a.replace(/^"|"$/g, ''));

  let { cwd, tree } = JSON.parse(JSON.stringify(vfsState));
  let output = '';
  let action = null;

  const getCwdNode = () => {
    let curr = tree;
    for (let i = 1; i < cwd.length; i++) {
      curr = curr.children[cwd[i]];
    }
    return curr;
  };

  switch (cmd) {
    case 'pwd': {
      output = formatPath(cwd);
      break;
    }
    case 'ls': {
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
      
      let targetPathStr = args.find(a => !a.startsWith('-')) || '';
      let targetCwd = resolvePath(cwd, targetPathStr);
      
      let targetNode = tree;
      let valid = true;
      for (let i = 1; i < targetCwd.length; i++) {
        if (targetNode.children && targetNode.children[targetCwd[i]]) {
          targetNode = targetNode.children[targetCwd[i]];
        } else {
          valid = false;
          break;
        }
      }

      if (!valid || targetNode.type !== 'dir') {
        output = `ls: ${targetPathStr || '.'}: No such file or directory`;
      } else {
        const entries = Object.keys(targetNode.children || {}).filter(name => {
          return showHidden || !name.startsWith('.');
        });

        if (showHidden) {
          entries.unshift('.', '..');
        }

        if (longFormat) {
          output = entries.map(name => {
            const isDir = name === '.' || name === '..' || targetNode.children[name]?.type === 'dir';
            const size = isDir ? 4096 : (targetNode.children[name]?.content?.length || 0);
            const mode = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const date = 'Aug 18 10:00';
            return `${mode} 1 user staff ${size.toString().padStart(6)} ${date} ${name}${isDir ? '/' : ''}`;
          }).join('\n');
        } else {
          output = entries.map(name => {
            const isDir = name === '.' || name === '..' || targetNode.children[name]?.type === 'dir';
            return `${name}${isDir ? '/' : ''}`;
          }).join('  ');
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'cd': {
      const targetPathStr = args[0] || '~';
      const targetCwd = resolvePath(cwd, targetPathStr);

      let targetNode = tree;
      let valid = true;
      for (let i = 1; i < targetCwd.length; i++) {
        if (targetNode.children && targetNode.children[targetCwd[i]]) {
          targetNode = targetNode.children[targetCwd[i]];
        } else {
          valid = false;
          break;
        }
      }

      if (!valid || targetNode.type !== 'dir') {
        output = `cd: no such file or directory: ${targetPathStr}`;
      } else {
        cwd = targetCwd;
        output = '';
      }
      action = 'vfs_action';
      break;
    }
    case 'cat': {
      if (!args[0]) {
        output = 'cat: missing filename argument';
      } else {
        const targetPath = resolvePath(cwd, args[0]);
        const fileName = targetPath[targetPath.length - 1];
        const dirPath = targetPath.slice(0, -1);
        
        let dirNode = tree;
        let valid = true;
        for (let i = 1; i < dirPath.length; i++) {
          if (dirNode.children && dirNode.children[dirPath[i]]) {
            dirNode = dirNode.children[dirPath[i]];
          } else {
            valid = false;
            break;
          }
        }

        const fileNode = dirNode?.children?.[fileName];
        if (!valid || !fileNode) {
          output = `cat: ${args[0]}: No such file or directory`;
        } else if (fileNode.type === 'dir') {
          output = `cat: ${args[0]}: Is a directory`;
        } else {
          output = fileNode.content;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'mkdir': {
      if (!args[0]) {
        output = 'mkdir: missing operand';
      } else {
        const dirName = args[0];
        const cwdNode = getCwdNode();
        if (cwdNode.children[dirName]) {
          output = `mkdir: cannot create directory '${dirName}': File exists`;
        } else {
          cwdNode.children[dirName] = { type: 'dir', children: {} };
          output = `Directory '${dirName}' created`;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'touch': {
      if (!args[0]) {
        output = 'touch: missing file operand';
      } else {
        const fileName = args[0];
        const cwdNode = getCwdNode();
        if (!cwdNode.children[fileName]) {
          cwdNode.children[fileName] = { type: 'file', content: '' };
        }
        output = '';
      }
      action = 'vfs_action';
      break;
    }
    case 'rm': {
      const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-f');
      const targetName = args.find(a => !a.startsWith('-'));
      if (!targetName) {
        output = 'rm: missing operand';
      } else {
        const cwdNode = getCwdNode();
        const node = cwdNode.children[targetName];
        if (!node) {
          output = `rm: cannot remove '${targetName}': No such file or directory`;
        } else if (node.type === 'dir' && !recursive) {
          output = `rm: cannot remove '${targetName}': Is a directory (use -r)`;
        } else {
          delete cwdNode.children[targetName];
          output = `Removed ${targetName}`;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'cp': {
      if (args.length < 2) {
        output = 'cp: missing destination file operand';
      } else {
        const src = args[0];
        const dest = args[1];
        const cwdNode = getCwdNode();
        const srcNode = cwdNode.children[src];
        if (!srcNode) {
          output = `cp: cannot stat '${src}': No such file or directory`;
        } else {
          cwdNode.children[dest] = JSON.parse(JSON.stringify(srcNode));
          output = `Copied ${src} to ${dest}`;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'mv': {
      if (args.length < 2) {
        output = 'mv: missing destination file operand';
      } else {
        const src = args[0];
        const dest = args[1];
        const cwdNode = getCwdNode();
        const srcNode = cwdNode.children[src];
        if (!srcNode) {
          output = `mv: cannot stat '${src}': No such file or directory`;
        } else {
          cwdNode.children[dest] = JSON.parse(JSON.stringify(srcNode));
          delete cwdNode.children[src];
          output = `Renamed/moved ${src} to ${dest}`;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'echo': {
      const redirectIdx = args.indexOf('>');
      const appendIdx = args.indexOf('>>');

      if (redirectIdx !== -1) {
        const text = args.slice(0, redirectIdx).join(' ');
        const fileName = args[redirectIdx + 1];
        if (!fileName) {
          output = 'zsh: syntax error near unexpected token \'newline\'';
        } else {
          const cwdNode = getCwdNode();
          cwdNode.children[fileName] = { type: 'file', content: text };
          output = '';
        }
      } else if (appendIdx !== -1) {
        const text = args.slice(0, appendIdx).join(' ');
        const fileName = args[appendIdx + 1];
        if (!fileName) {
          output = 'zsh: syntax error near unexpected token \'newline\'';
        } else {
          const cwdNode = getCwdNode();
          const existing = cwdNode.children[fileName]?.content || '';
          cwdNode.children[fileName] = { type: 'file', content: existing ? `${existing}\n${text}` : text };
          output = '';
        }
      } else {
        output = args.join(' ');
      }
      action = 'vfs_action';
      break;
    }
    case 'grep': {
      if (args.length < 2) {
        output = 'grep: usage: grep [pattern] [filename]';
      } else {
        const pattern = args[0];
        const fileName = args[1];
        const cwdNode = getCwdNode();
        const fileNode = cwdNode.children[fileName];
        if (!fileNode) {
          output = `grep: ${fileName}: No such file or directory`;
        } else if (fileNode.type === 'dir') {
          output = `grep: ${fileName}: Is a directory`;
        } else {
          const lines = fileNode.content.split('\n');
          const matched = lines.filter(l => l.toLowerCase().includes(pattern.toLowerCase()));
          output = matched.length > 0 ? matched.join('\n') : `[grep] No matches found for pattern "${pattern}"`;
        }
      }
      action = 'vfs_action';
      break;
    }
    case 'whoami': {
      output = 'user';
      break;
    }
    case 'date': {
      output = new Date().toUTCString();
      break;
    }
    case 'uname': {
      output = 'Darwin macbook-pro.local 23.4.0 x86_64';
      break;
    }
    case 'git': {
      const sub = args[0];
      if (sub === 'init') {
        const cwdNode = getCwdNode();
        cwdNode.children['.git'] = { type: 'dir', children: { 'HEAD': { type: 'file', content: 'ref: refs/heads/main' } } };
        output = 'Initialized empty Git repository in ' + formatPath(cwd) + '/.git/';
      } else if (sub === 'status') {
        output = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean';
      } else if (sub === 'log') {
        output = 'commit a1b2c3d4e5f6 (HEAD -> main)\nAuthor: Dev <user@macbook.local>\nDate:   Tue Aug 18 10:00:00 2026\n\n    feat: initial commit';
      } else if (sub === 'branch') {
        output = '* main';
      } else {
        output = `git: '${sub}' is simulated git command`;
      }
      action = 'vfs_action';
      break;
    }
    case 'help': {
      output = language === 'ru'
        ? `🔥 ВИТУАЛЬНЫЙ ТЕРМИНАЛ ZSH (Интерактивная среда VFS — 200 Квестов)\n` +
          `Доступные встроенные команды:\n` +
          `  - pwd, ls [-la], cd [dir], cat [file]\n` +
          `  - mkdir [dir], touch [file], rm [-r] [file]\n` +
          `  - cp [src] [dest], mv [src] [dest]\n` +
          `  - echo "txt" > [file], echo "txt" >> [file]\n` +
          `  - grep [pattern] [file]\n` +
          `  - git [init/status/log/branch]\n` +
          `  - whoami, date, uname, clear, help\n`
        : `🔥 VIRTUAL ZSH TERMINAL (Interactive VFS — 200 Quests Sandbox)\n` +
          `Available built-in commands:\n` +
          `  - pwd, ls [-la], cd [dir], cat [file]\n` +
          `  - mkdir [dir], touch [file], rm [-r] [file]\n` +
          `  - cp [src] [dest], mv [src] [dest]\n` +
          `  - echo "txt" > [file], echo "txt" >> [file]\n` +
          `  - grep [pattern] [file]\n` +
          `  - git [init/status/log/branch]\n` +
          `  - whoami, date, uname, clear, help\n`;
      break;
    }
    default: {
      const match = commandsCatalog.find(c => c.name.toLowerCase() === cmd);
      if (match) {
        const desc = language === 'ru' ? (match.ru_desc || match.primary_desc) : match.primary_desc;
        output = `⚡ CATALOG ENTRY: ${match.name}\nCategory: ${match.category} | Section: ${match.section || '1'}\nDescription: ${desc}\nExample: ${match.example || match.name}`;
      } else {
        output = `zsh: command not found: ${cmd} (type "help" for list of commands)`;
      }
    }
  }

  return {
    output,
    vfsState: { cwd, tree },
    action
  };
}

export function autocompleteVfs(vfsState, currentInput) {
  const parts = currentInput.split(' ');
  const lastPart = parts[parts.length - 1] || '';

  const builtins = ['pwd', 'ls', 'cd', 'cat', 'mkdir', 'touch', 'rm', 'cp', 'mv', 'echo', 'grep', 'git', 'whoami', 'date', 'clear', 'help', 'uname'];

  if (parts.length === 1) {
    const matches = builtins.filter(b => b.startsWith(lastPart.toLowerCase()));
    if (matches.length === 1) {
      return matches[0] + ' ';
    }
    return currentInput;
  }

  let { cwd, tree } = vfsState;
  let dirNode = tree;
  for (let i = 1; i < cwd.length; i++) {
    if (dirNode.children && dirNode.children[cwd[i]]) {
      dirNode = dirNode.children[cwd[i]];
    }
  }

  if (dirNode && dirNode.children) {
    const options = Object.keys(dirNode.children);
    const matches = options.filter(o => o.startsWith(lastPart));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      return parts.join(' ') + (dirNode.children[matches[0]].type === 'dir' ? '/' : ' ');
    }
  }

  return currentInput;
}
