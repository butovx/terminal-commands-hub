import {
  Folder,
  FileText,
  Cpu,
  Globe,
  Code2,
  Archive,
  Terminal,
  Shield,
  Video,
  Wrench
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'all',
    label_en: 'All Commands',
    label_ru: 'Все команды',
    icon: Terminal,
    color: 'text-gray-300',
    bgColor: 'bg-gray-800/50',
    borderColor: 'border-gray-700',
    description_en: 'Complete catalog of 1834 system commands',
    description_ru: 'Полный каталог 1834 системных команд'
  },
  {
    id: 'files',
    label_en: 'Files & Directories',
    label_ru: 'Файлы и Директории',
    icon: Folder,
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-800/50',
    description_en: 'Navigation, file management, permissions',
    description_ru: 'Навигация, управление файлами, права доступа'
  },
  {
    id: 'text',
    label_en: 'Text & Streams',
    label_ru: 'Текст и Стримы',
    icon: FileText,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-800/50',
    description_en: 'Search, regular expressions, parsing',
    description_ru: 'Поиск, регулярные выражения, парсинг'
  },
  {
    id: 'system',
    label_en: 'System & Processes',
    label_ru: 'Система и Процессы',
    icon: Cpu,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-800/50',
    description_en: 'Resource monitoring, daemons, signals',
    description_ru: 'Мониторинг ресурсов, демоны, сигналы'
  },
  {
    id: 'network',
    label_en: 'Network & Services',
    label_ru: 'Сеть и Сетевые сервисы',
    icon: Globe,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-800/50',
    description_en: 'HTTP, SSH, tracing, DNS portfolio',
    description_ru: 'HTTP, SSH, трассировка, портфолио DNS'
  },
  {
    id: 'dev',
    label_en: 'Development & Git',
    label_ru: 'Разработка и Git',
    icon: Code2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-800/50',
    description_en: 'Compilers, version control, build tools',
    description_ru: 'Компиляторы, версии кода, сборка'
  },
  {
    id: 'archive',
    label_en: 'Archiving & Compression',
    label_ru: 'Архивация и Сжатие',
    icon: Archive,
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-800/50',
    description_en: 'tar, zip, gzip, dmg, cpio archivers',
    description_ru: 'tar, zip, gzip, dmg, cpio архиваторы'
  },
  {
    id: 'security',
    label_en: 'Security & Keys',
    label_ru: 'Безопасность и Ключи',
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-800/50',
    description_en: 'SSL, GPG, certificates, signatures',
    description_ru: 'SSL, GPG, сертификаты, подписи'
  },
  {
    id: 'shell',
    label_en: 'Shell Built-in Commands',
    label_ru: 'Встроенные команды оболочки',
    icon: Terminal,
    color: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-800/50',
    description_en: 'Builtins, aliases, environment variables',
    description_ru: 'Builtins, алиасы, переменные окружения'
  },
  {
    id: 'media',
    label_en: 'Media & Graphics',
    label_ru: 'Медиа и Графика',
    icon: Video,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950/40',
    borderColor: 'border-indigo-800/50',
    description_en: 'Audio, video, image processing',
    description_ru: 'Аудио, видео, конвертация изображений'
  },
  {
    id: 'utility',
    label_en: 'Utilities & Tools',
    label_ru: 'Утилиты и Инструменты',
    icon: Wrench,
    color: 'text-teal-400',
    bgColor: 'bg-teal-950/40',
    borderColor: 'border-teal-800/50',
    description_en: 'Calculators, reference guides, timers',
    description_ru: 'Калькуляторы, справочники, системные таймеры'
  }
];

export function getCategoryMeta(catId, lang = 'en') {
  const cat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  return {
    ...cat,
    label: lang === 'ru' ? cat.label_ru : cat.label_en,
    description: lang === 'ru' ? cat.description_ru : cat.description_en
  };
}

export const MAN_SECTIONS = {
  "1": { title_en: "User Commands", title_ru: "Пользовательские команды (User Commands)", badge: "man(1)", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  "2": { title_en: "Kernel System Calls", title_ru: "Системные вызовы ядра (System Calls)", badge: "man(2)", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  "3": { title_en: "C / POSIX Library Functions", title_ru: "Библиотечные функции C/POSIX", badge: "man(3)", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  "5": { title_en: "File Formats & Configurations", title_ru: "Форматы файлов и конфигурации", badge: "man(5)", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "7": { title_en: "Conventions & Reference Overviews", title_ru: "Соглашения и Справочные обзоры", badge: "man(7)", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  "8": { title_en: "System Administration (Sysadmin)", title_ru: "Администрирование системы (Sysadmin)", badge: "man(8)", color: "bg-red-500/20 text-red-300 border-red-500/30" },
  "n": { title_en: "Tcl/Tk Scripts & Macros", title_ru: "Tcl/Tk Скрипты и макросы", badge: "man(n)", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  "3pm": { title_en: "Perl Modules", title_ru: "Модули Perl (Perl Modules)", badge: "man(3pm)", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" }
};

export function getManSectionMeta(sectionId, lang = 'en') {
  const sec = MAN_SECTIONS[sectionId] || { title_en: `Section ${sectionId}`, title_ru: `Раздел ${sectionId}`, badge: `man(${sectionId})`, color: 'bg-gray-800 text-gray-400' };
  return {
    ...sec,
    title: lang === 'ru' ? sec.title_ru : sec.title_en
  };
}
