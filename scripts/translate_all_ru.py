import json
import urllib.request
import urllib.parse
import ssl
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

COMMANDS_FILE = "src/data/commands.json"
ctx = ssl._create_unverified_context()

def translate_en_to_ru(text):
    if not text or not text.strip():
        return ""
    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=" + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            translated = "".join([item[0] for item in data[0] if item[0]])
            return clean_translation(translated)
    except Exception as e:
        return ""

def clean_translation(text):
    if not text:
        return ""
    text = text.strip()
    replacements = {
        "сценариев": "скриптов",
        "сценарии": "скрипты",
        "сценарий": "скрипт",
        "командная строка": "командная строка",
        "файла мануала": "страницы руководства man",
        "руководство man": "справочное руководство man",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    if len(text) > 0:
        text = text[0].upper() + text[1:]
    return text

def process_command(cmd):
    if not cmd.get("ru_desc") or not cmd["ru_desc"].strip():
        primary = cmd.get("primary_desc") or cmd.get("name")
        res = translate_en_to_ru(primary)
        if res:
            cmd["ru_desc"] = res
            cmd["has_desc"] = True
            return True
    return False

def main():
    print("Loading commands.json...", flush=True)
    with open(COMMANDS_FILE, "r", encoding="utf-8") as f:
        commands = json.load(f)

    missing = [c for c in commands if not c.get("ru_desc") or not c["ru_desc"].strip()]
    print(f"Total commands: {len(commands)}, missing ru_desc: {len(missing)}", flush=True)

    translated_count = 0
    with ThreadPoolExecutor(max_workers=25) as executor:
        futures = {executor.submit(process_command, cmd): cmd for cmd in missing}
        for future in as_completed(futures):
            if future.result():
                translated_count += 1
            if translated_count % 100 == 0:
                print(f"Progress: translated {translated_count} / {len(missing)} missing items...", flush=True)

    print(f"Saving updated commands.json...", flush=True)
    with open(COMMANDS_FILE, "w", encoding="utf-8") as out:
        json.dump(commands, out, ensure_ascii=False, indent=2)

    remaining_missing = [c for c in commands if not c.get("ru_desc") or not c["ru_desc"].strip()]
    print(f"Done! Translated {translated_count} commands. Remaining missing: {len(remaining_missing)}", flush=True)

if __name__ == "__main__":
    main()
