export const translations = {
  en: {
    // App & Header
    appTitle: "Terminal Commands Explorer",
    appSubtitle: "macOS / Linux terminal commands directory and interactive sandbox.",
    commandsCount: "commands",
    resCount: "res.",
    searchPlaceholder: "Search command or description (ls, grep, git)...",
    
    // View Tabs
    tabs: {
      grid: "Cards",
      table: "Table",
      terminal: "Sandbox",
      cheatsheet: "Cheat Sheet",
      bookmarks: "Favorites"
    },

    // Results Bar & Pagination
    showing: "Showing",
    of: "of",
    commands: "commands",
    forQuery: "for query",
    prev: "Prev",
    next: "Next",
    nothingFoundTitle: "Nothing found",
    nothingFoundDesc: "No commands found matching",
    resetFilters: "Reset filters",

    // Category & Status Filters
    statusFilter: {
      all: "All commands",
      hasDesc: "With description",
      noDesc: "Without description"
    },

    sorting: {
      label: "Sort by:",
      popular: "⭐ Popular first",
      nameAsc: "🔤 Alphabetical (A-Z)",
      nameDesc: "🔤 Alphabetical (Z-A)",
      category: "📁 By category"
    },

    // Table Headers
    table: {
      bookmark: "★",
      command: "Command",
      category: "Category",
      description: "Description (whatis / man)",
      example: "Example call",
      actions: "Actions"
    },

    // Card & General Tooltips / Actions
    actions: {
      copy: "Copy",
      copied: "Copied!",
      runInSandbox: "Run in Sandbox",
      addToFavorites: "Add to Favorites",
      inFavorites: "In Favorites"
    },

    // Detail Modal
    modal: {
      descriptionHeader: "DESCRIPTION",
      exampleHeader: "EXAMPLE CALL",
      whatisHeader: "WHATIS REFERENCE RECORDS",
      copyCommand: "Copy",
      copiedCommand: "Copied"
    },

    // Terminal Sandbox
    sandbox: {
      welcome: "⚡ Terminal Sandbox (macOS zsh)\nEnter a command name from catalog (e.g. ls, grep, git, python3) or type \"help\".",
      helpButton: "Help",
      clearButton: "Clear",
      helpOutput: "Simulator commands:\n  - clear : clear screen\n  - help  : show this help\nType the name of any of the 1834 commands!",
      executedOutput: "[EXECUTED]:",
      section: "Section",
      category: "Category",
      description: "Description",
      inputPlaceholder: "Enter command...",
      examplesLabel: "Examples:"
    },

    // Cheat Sheet
    cheatsheet: {
      bannerTitle: "Terminal Cheat Sheet",
      bannerDesc: "Quick reference of the most popular command combinations and flags for daily macOS and Linux terminal work."
    },

    // Bookmarks View
    bookmarks: {
      emptyTitle: "Favorites list is empty",
      emptyDesc: "Click the bookmark icon on any command card to save it here for quick access.",
      headerTitle: "Favorite Commands",
      headerDesc: "Saved commands are stored locally in your browser session.",
      exportJson: "Export JSON",
      clearAll: "Clear all"
    }
  },

  ru: {
    // App & Header
    appTitle: "Terminal Commands Explorer",
    appSubtitle: "Интерактивный справочник и симулятор для 1800+ терминальных команд.",
    commandsCount: "команд",
    resCount: "рез.",
    searchPlaceholder: "Поиск команды или описания (ls, grep, git)...",

    // View Tabs
    tabs: {
      grid: "Карточки",
      table: "Таблица",
      terminal: "Sandbox",
      cheatsheet: "Шпаргалка",
      bookmarks: "Избранное"
    },

    // Results Bar & Pagination
    showing: "Показано",
    of: "из",
    commands: "команд",
    forQuery: "по запросу",
    prev: "Назад",
    next: "Вперед",
    nothingFoundTitle: "Ничего не найдено",
    nothingFoundDesc: "По запросу ничего не найдено:",
    resetFilters: "Сбросить фильтры",

    // Category & Status Filters
    statusFilter: {
      all: "Все команды",
      hasDesc: "С описанием",
      noDesc: "Без описания"
    },

    sorting: {
      label: "Сортировка:",
      popular: "⭐ Сначала популярные",
      nameAsc: "🔤 Алфавиту (A-Z)",
      nameDesc: "🔤 Алфавиту (Z-A)",
      category: "📁 По категориям"
    },

    // Table Headers
    table: {
      bookmark: "★",
      command: "Команда",
      category: "Category",
      description: "Описание (whatis / man)",
      example: "Пример вызова",
      actions: "Действия"
    },

    // Card & General Tooltips / Actions
    actions: {
      copy: "Скопировать",
      copied: "Скопировано!",
      runInSandbox: "Запустить в Sandbox",
      addToFavorites: "В избранное",
      inFavorites: "В избранном"
    },

    // Detail Modal
    modal: {
      descriptionHeader: "ОПИСАНИЕ",
      exampleHeader: "ПРИМЕР ВЫЗОВА",
      whatisHeader: "ЗАПИСИ СПРАВОЧНИКА WHATIS",
      copyCommand: "Копировать",
      copiedCommand: "Скопировано"
    },

    // Terminal Sandbox
    sandbox: {
      welcome: "⚡ Терминальный Sandbox (macOS zsh)\nВведите имя команды из каталога (например: ls, grep, git, python3) или \"help\".",
      helpButton: "Справка",
      clearButton: "Очистить",
      helpOutput: "Команды симулятора:\n  - clear : очистить экран\n  - help  : показать эту справку\nВведите имя любой из 1834 команд!",
      executedOutput: "[ВЫПОЛНЕНО]:",
      section: "Раздел",
      category: "Категория",
      description: "Описание",
      inputPlaceholder: "Введите команду...",
      examplesLabel: "Примеры:"
    },

    // Cheat Sheet
    cheatsheet: {
      bannerTitle: "Шпаргалка главных команд (Terminal Cheat Sheet)",
      bannerDesc: "Быстрый справочник наиболее популярных комбинаций и флагов для ежедневной работы в консоли macOS и Linux."
    },

    // Bookmarks View
    bookmarks: {
      emptyTitle: "Список избранного пуст",
      emptyDesc: "Нажмите иконку закладки на любой карточке команды, чтобы сохранить её здесь для быстрого доступа.",
      headerTitle: "Избранные команды",
      headerDesc: "Сохраненные команды доступны локально в вашей сессии браузера.",
      exportJson: "Экспорт JSON",
      clearAll: "Очистить все"
    }
  }
};
