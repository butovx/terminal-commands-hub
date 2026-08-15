import os
import json
import re

DATA_DIR = "/Users/butov/Documents/terminal"
ALL_COMMANDS_PATH = os.path.join(DATA_DIR, "all_commands.txt")
DESC_COMMANDS_PATH = os.path.join(DATA_DIR, "all_commands_with_desc.txt")
OUTPUT_JSON_PATH = os.path.join(DATA_DIR, "src", "data", "commands.json")

# Category mapping patterns
CATEGORY_RULES = [
    ("dev", r"^(git|git-.*|python.*|node|npm.*|npx|gcc|g\+\+|clang.*|make|cmake|docker.*|cargo|rustc|go|java|javac|perl.*|ruby|php|swift|bison|flex|ctags|dsymutil|lldb|gdb|xcrun|xcode.*|swiftc|pip.*|gem|bun|deno)$"),
    ("files", r"^(ls|cd|pwd|cp|mv|rm|mkdir|rmdir|touch|find|locate|stat|file|chmod|chown|chgrp|umask|tree|ln|du|df|attr|xattr|mktemp|realpath|dirname|basename|dir|vdir|ls-F|lsattr|chattr|pathchk)$"),
    ("text", r"^(grep|egrep|fgrep|rgrep|zgrep|sed|awk|cat|head|tail|cut|sort|uniq|wc|tr|diff|cmp|tee|less|more|fmt|fold|expand|unexpand|nl|paste|xargs|column|comm|csplit|hexdump|od|xxd|strings|fold|rev|join|split|tac)$"),
    ("system", r"^(top|htop|ps|kill|pkill|killall|uptime|free|vmstat|iostat|lsof|uname|hostname|reboot|shutdown|systemctl|service|cron|crontab|launchctl|sudo|su|w|who|whoami|last|id|users|dmesg|sysctl|nice|renice|nohup|at|atq|atrm|batch|ps|pgrep|fuser)$"),
    ("network", r"^(curl|wget|ping|traceroute|netstat|ss|ifconfig|ip|dig|nslookup|host|ssh|scp|sftp|rsync|ftp|telnet|nc|nmap|route|arp|whois|tcpdump|wireshark|curl-config|adig|scutil|networksetup|dns-sd|lsof)$"),
    ("archive", r"^(tar|gzip|gunzip|zip|unzip|bzip2|bunzip2|xz|unxz|7z|ar|compress|uncompress|zcat|cpio|ditto|hdiutil|pkgutil|archiveutil|aea|afclip)$"),
    ("shell", r"^(echo|export|alias|unalias|history|source|eval|exec|exit|set|unset|env|printenv|bind|bindkey|test|builtin|zsh|bash|sh|csh|tcsh|fish|type|which|where|whence|autoload|compdef|compctl|builtin|\.|\:|\[)$"),
    ("security", r"^(openssl|gpg|ssh-keygen|security|codesign|certtool|spctl|csrutil|sudo|sudoedit|pass|gpg2|keytool|ssh-add|ssh-agent|authserver)$"),
    ("media", r"^(ffmpeg|ffprobe|convert|magick|afplay|afconvert|afinfo|sips|screencapture|say|text2wave|sox|lame|mplayer|vlc)$"),
    ("utility", r"^(bc|cal|date|expr|sleep|time|watch|clear|reset|man|tldr|info|whatis|apropos|help|banner|units|factor|seq|yes|env|printenv|true|false)$"),
]

# Russian summaries & usage examples for core terminal commands
RU_DESCRIPTIONS = {
    "ls": {"ru": "Выводит список файлов и каталогов в текущей или указанной директории.", "example": "ls -la", "tags": ["файлы", "просмотр", "содержимое"]},
    "cd": {"ru": "Переход в другую директорию (смена текущего рабочего каталога).", "example": "cd /path/to/dir", "tags": ["навигация", "переход", "директории"]},
    "pwd": {"ru": "Печатает абсолютный путь к текущей рабочей директории.", "example": "pwd", "tags": ["путь", "директория", "текущий"]},
    "mkdir": {"ru": "Создаёт одну или несколько новых директорий.", "example": "mkdir -p project/src", "tags": ["создание", "директория", "папка"]},
    "rm": {"ru": "Удаляет файлы или директории (с флагом -r). Будьте осторожны!", "example": "rm -rf node_modules", "tags": ["удаление", "файлы", "опасно"]},
    "cp": {"ru": "Копирует файлы или директории из одного места в другое.", "example": "cp -r src/ src_backup/", "tags": ["копирование", "дублирование"]},
    "mv": {"ru": "Перемещает или переименовывает файлы и директории.", "example": "mv old_name.txt new_name.txt", "tags": ["перемещение", "переименование"]},
    "touch": {"ru": "Создаёт пустой файл или обновляет время последнего изменения существующего файла.", "example": "touch index.js", "tags": ["файл", "создание", "время"]},
    "cat": {"ru": "Выводит содержимое файла в консоль или объединяет несколько файлов.", "example": "cat file.txt", "tags": ["чтение", "вывод", "текст"]},
    "grep": {"ru": "Ищет строки, соответствующие заданному шаблону/регулярному выражению в файлах.", "example": "grep -rn 'TODO' ./src", "tags": ["поиск", "фильтрация", "текст"]},
    "find": {"ru": "Ищет файлы и директории в файловой системе по именам, дате, размеру и т.д.", "example": "find . -name '*.js'", "tags": ["поиск", "файловая система"]},
    "chmod": {"ru": "Изменяет права доступа (чтение, запись, выполнение) к файлам и папкам.", "example": "chmod +x script.sh", "tags": ["права", "безопасность", "доступ"]},
    "chown": {"ru": "Изменяет владельца и/или группу файла или директории.", "example": "chown -R user:group ./app", "tags": ["владелец", "права", "пользователь"]},
    "sudo": {"ru": "Выполняет команду с правами суперпользователя (root) или другого пользователя.", "example": "sudo systemctl restart nginx", "tags": ["root", "админ", "права"]},
    "curl": {"ru": "Утилита для отправки HTTP/HTTPS запросов и скачивания файлов по сети.", "example": "curl -O https://example.com/file.zip", "tags": ["сеть", "HTTP", "скачивание"]},
    "wget": {"ru": "Инструмент для неинтерактивной загрузки файлов из веб по протоколам HTTP, HTTPS, FTP.", "example": "wget https://example.com/archive.tar.gz", "tags": ["скачивание", "сеть"]},
    "git": {"ru": "Распределённая система управления версиями исходного кода.", "example": "git status", "tags": ["версии", "git", "разработка"]},
    "python3": {"ru": "Интерпретатор языка программирования Python 3.", "example": "python3 main.py", "tags": ["пайтон", "скрипт", "код"]},
    "tar": {"ru": "Архиватор файлов (создание, распаковка и просмотр tar.gz, tar.bz2 архивов).", "example": "tar -czvf archive.tar.gz ./folder", "tags": ["архив", "сжатие"]},
    "zip": {"ru": "Создаёт сжатые zip-архивы из файлов и папок.", "example": "zip -r backup.zip ./data", "tags": ["zip", "архивация"]},
    "unzip": {"ru": "Распаковывает zip-архивы.", "example": "unzip backup.zip", "tags": ["распаковка", "zip"]},
    "top": {"ru": "Динамический монитор процессов и загрузки процессора/памяти в реальном времени.", "example": "top", "tags": ["процессы", "мониторинг", "память"]},
    "kill": {"ru": "Отправляет сигнал процессу (например, SIGKILL или SIGTERM для завершения).", "example": "kill -9 1234", "tags": ["процесс", "завершение", "сигнал"]},
    "ps": {"ru": "Выводит список активных процессов текущей системы.", "example": "ps aux | grep node", "tags": ["процессы", "список"]},
    "ssh": {"ru": "Клиент для защищённого удалённого подключения к серверу по протоколу SSH.", "example": "ssh user@remote-server.com", "tags": ["удаленный доступ", "сервер", "ssh"]},
    "scp": {"ru": "Безопасное копирование файлов между хостами по протоколу SSH.", "example": "scp file.txt user@remote:/var/www/", "tags": ["копирование", "ssh", "сеть"]},
    "df": {"ru": "Показывает свободное и занятое дисковое пространство файловых систем.", "example": "df -h", "tags": ["диск", "память", "место"]},
    "du": {"ru": "Оценивает занимаемый объем диска файлами и директориями.", "example": "du -sh *", "tags": ["размер", "папка", "диск"]},
    "nano": {"ru": "Простой текстовый редактор в консоли.", "example": "nano config.json", "tags": ["редактор", "текст"]},
    "vim": {"ru": "Мощный консольный текстовый редактор с модальным управлением.", "example": "vim script.py", "tags": ["редактор", "текст", "vim"]},
    "clear": {"ru": "Очищает экран терминала.", "example": "clear", "tags": ["очистка", "терминал"]},
    "history": {"ru": "Выводит историю ранее выполненных команд в сессии.", "example": "history | grep git", "tags": ["история", "команды"]},
    "man": {"ru": "Выводит справочное руководство (manual page) по любой указанной команде.", "example": "man grep", "tags": ["справка", "мануал", "помощь"]},
    "echo": {"ru": "Выводит переданную строку или значение переменной окружения в консоль.", "example": "echo $PATH", "tags": ["вывод", "текст", "переменные"]},
    "open": {"ru": "macOS утилита: открывает файл, папку или URL в стандартной программе macOS.", "example": "open .", "tags": ["macOS", "открытие", "файлы"]},
}

def determine_category(cmd_name, primary_desc, details):
    cmd_lower = cmd_name.lower()
    full_text = f"{cmd_lower} {primary_desc.lower()} {' '.join(details).lower()}"

    for cat_id, pattern in CATEGORY_RULES:
        if re.search(pattern, cmd_lower):
            return cat_id

    # Fallback search in description text
    if any(k in full_text for k in ["git", "compiler", "python", "developer", "assembler", "library", "debug"]):
        return "dev"
    elif any(k in full_text for k in ["file", "directory", "folder", "path", "attribute"]):
        return "files"
    elif any(k in full_text for k in ["net", "http", "socket", "dns", "url", "ip", "connection", "port"]):
        return "network"
    elif any(k in full_text for k in ["process", "thread", "cpu", "memory", "kernel", "daemon", "service"]):
        return "system"
    elif any(k in full_text for k in ["text", "string", "parse", "format", "pattern", "print", "display"]):
        return "text"
    elif any(k in full_text for k in ["compress", "archive", "zip", "tar", "extract"]):
        return "archive"
    elif any(k in full_text for k in ["security", "auth", "crypto", "ssl", "key", "password", "sign"]):
        return "security"

    return "utility"

def determine_section(cmd_name, details):
    # Extract man section numbers from details e.g. (1), (8), (3), etc.
    sections = set()
    for line in details:
        found = re.findall(r'\((\d+|[a-z]+)\)', line)
        for f in found:
            sections.add(f)
    if not sections:
        return "1"
    # Priority: 1 (User commands), 8 (Sysadmin), 2 (Sys calls), 3 (C lib), 5 (Formats), 7 (Misc)
    for s in ["1", "8", "2", "3", "5", "7", "n", "3pm"]:
        if s in sections:
            return s
    return list(sections)[0]

def parse_data():
    with open(ALL_COMMANDS_PATH, "r", encoding="utf-8") as f:
        commands = [line.strip() for line in f if line.strip()]

    with open(DESC_COMMANDS_PATH, "r", encoding="utf-8") as f:
        raw_lines = f.readlines()

    cmd_indices = []
    for idx, line in enumerate(raw_lines):
        for cmd in commands:
            if line.startswith(cmd + ":"):
                cmd_indices.append((idx, cmd))
                break

    cmd_entries = {}
    for i in range(len(cmd_indices)):
        start_idx, cmd_name = cmd_indices[i]
        end_idx = cmd_indices[i+1][0] if i + 1 < len(cmd_indices) else len(raw_lines)
        lines = [raw_lines[j].strip() for j in range(start_idx, end_idx)]
        if lines and lines[0].startswith(cmd_name + ":"):
            lines[0] = lines[0][len(cmd_name) + 1:].strip()
        cmd_entries[cmd_name] = [l for l in lines if l]

    parsed_list = []
    category_counts = {}

    for idx, cmd in enumerate(commands, 1):
        lines = cmd_entries.get(cmd, [])
        has_desc = True
        primary_desc = ""

        if not lines or any("описание не найдено в whatis" in l.lower() for l in lines):
            has_desc = False
            primary_desc = "Описание не найдено в whatis (man)"
        else:
            matched = ""
            for line in lines:
                if " - " in line:
                    left, right = line.split(" - ", 1)
                    tokens = re.findall(r'\b[a-zA-Z0-9_\-\.]+\b', left)
                    if cmd in tokens:
                        matched = right.strip()
                        break
            if not matched:
                for line in lines:
                    if " - " in line:
                        matched = line.split(" - ", 1)[1].strip()
                        break
            primary_desc = matched or (lines[0] if lines else "Нет подробного описания")

        category = determine_category(cmd, primary_desc, lines)
        section = determine_section(cmd, lines)
        ru_info = RU_DESCRIPTIONS.get(cmd, {})

        entry = {
            "id": idx,
            "name": cmd,
            "has_desc": has_desc,
            "primary_desc": primary_desc,
            "ru_desc": ru_info.get("ru", None),
            "example": ru_info.get("example", f"{cmd} --help" if has_desc else f"{cmd}"),
            "tags": ru_info.get("tags", []),
            "category": category,
            "section": section,
            "details": lines[:10]  # Cap at 10 most relevant lines for performance
        }

        parsed_list.append(entry)
        category_counts[category] = category_counts.get(category, 0) + 1

    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(parsed_list, f, ensure_ascii=False, indent=2)

    print(f"✅ Successfully parsed {len(parsed_list)} commands into {OUTPUT_JSON_PATH}")
    print("Category breakdown:")
    for cat, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  - {cat}: {count} commands")

if __name__ == "__main__":
    parse_data()
