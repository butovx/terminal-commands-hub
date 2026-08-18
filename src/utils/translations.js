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
      bookmarks: "Favorites",
      quests: "Quests",
      quiz: "Quiz",
      speedtyper: "Speed Race"
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
      welcome: "⚡ Interactive VFS Terminal Sandbox (zsh)\nType virtual file commands (ls, cd, cat, mkdir, touch, rm, grep) or any of the 1,800+ catalog commands. Type \"help\" for guide.",
      helpButton: "Help",
      clearButton: "Clear",
      helpOutput: "Interactive Shell Commands:\n  - pwd, ls [-la], cd [dir], cat [file]\n  - mkdir [dir], touch [file], rm [-r] [file]\n  - echo \"txt\" > [file], grep [pattern] [file]\n  - whoami, date, clear, help\nType the name of any catalog command to view manual records!",
      executedOutput: "[EXECUTED]:",
      section: "Section",
      category: "Category",
      description: "Description",
      inputPlaceholder: "Enter command (Press Tab for completion)...",
      examplesLabel: "Quick Run:"
    },

    // Quests
    quests: {
      title: "Interactive Terminal Quests & Challenges",
      subtitle: "Solve real hands-on terminal tasks inside the virtual environment to level up and earn XP!",
      hintButton: "Show Hint",
      checkButton: "Verify Quest",
      completed: "Completed!",
      rewardXp: "+{{xp}} XP Earned!",
      allCompletedTitle: "🎉 All Quests Completed!",
      allCompletedDesc: "You are a true Terminal Legend. Great job!"
    },

    // Quiz
    quiz: {
      title: "Command Master Trivia Quiz",
      subtitle: "Test your terminal knowledge across file systems, networking, permissions, and git commands.",
      questionOf: "Question {{current}} of {{total}}",
      nextQuestion: "Next Question",
      finishQuiz: "Finish Quiz",
      scoreTitle: "Quiz Complete!",
      scoreSubtitle: "You scored {{score}} / {{total}}",
      earnedXp: "Total XP Earned: +{{xp}} XP",
      restartQuiz: "Play Again"
    },

    // Speed Typer
    speedtyper: {
      title: "Speed Typer: Terminal Command Race",
      subtitle: "Type actual Linux/macOS command strings accurately and quickly under pressure.",
      wpm: "WPM",
      accuracy: "Accuracy",
      progress: "Commands Completed",
      typePrompt: "Type the exact command below:",
      completeTitle: "Race Completed!",
      bestWpm: "Your Speed: {{wpm}} WPM",
      restart: "Race Again"
    },

    // Profile & Level Modal
    profile: {
      title: "Terminal Explorer Profile",
      levelLabel: "Level",
      xpLabel: "XP Progress",
      streakLabel: "Day Streak",
      achievementsTitle: "Unlocked Badges",
      statsTitle: "Activity Statistics",
      commandsExec: "Commands Executed",
      questsDone: "Quests Solved",
      quizzesDone: "Quizzes Completed",
      bestWpm: "Best Typing Speed"
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
      bookmarks: "Избранное",
      quests: "Квесты",
      quiz: "Викторина",
      speedtyper: "Гонка"
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
      welcome: "⚡ Интерактивный VFS Sandbox (zsh)\nВведите встроенные команды файловой системы (ls, cd, cat, mkdir, touch, rm, grep) или любые из 1800+ команд каталога. Введите \"help\" для справки.",
      helpButton: "Справка",
      clearButton: "Очистить",
      helpOutput: "Команды интерактивной оболочки:\n  - pwd, ls [-la], cd [dir], cat [file]\n  - mkdir [dir], touch [file], rm [-r] [file]\n  - echo \"txt\" > [file], grep [pattern] [file]\n  - whoami, date, clear, help\nВведите имя любой команды из каталога для просмотра ее карточки!",
      executedOutput: "[ВЫПОЛНЕНО]:",
      section: "Раздел",
      category: "Категория",
      description: "Описание",
      inputPlaceholder: "Введите команду (Tab для автодополнения)...",
      examplesLabel: "Быстрый запуск:"
    },

    // Quests
    quests: {
      title: "Интерактивные Квесты и Лабораторные",
      subtitle: "Решайте реальные практические задачи в терминале, получайте XP и повышайте свой уровень!",
      hintButton: "Показать подсказку",
      checkButton: "Проверить квест",
      completed: "Выполнено!",
      rewardXp: "+{{xp}} XP Получено!",
      allCompletedTitle: "🎉 Все квесты пройдены!",
      allCompletedDesc: "Вы настоящая Легенда Терминала. Отличная работа!"
    },

    // Quiz
    quiz: {
      title: "Викторина Заточки Консоли",
      subtitle: "Проверьте знания терминала в области файловых систем, сетей, прав доступа и Git.",
      questionOf: "Вопрос {{current}} из {{total}}",
      nextQuestion: "Следующий вопрос",
      finishQuiz: "Завершить викторину",
      scoreTitle: "Викторина завершена!",
      scoreSubtitle: "Ваш результат: {{score}} из {{total}}",
      earnedXp: "Всего получено: +{{xp}} XP",
      restartQuiz: "Сыграть снова"
    },

    // Speed Typer
    speedtyper: {
      title: "Гонка Скоростного Набора Команд",
      subtitle: "Печатайте реальные синтаксисы команд быстро и без ошибок на время.",
      wpm: "WPM (слов/мин)",
      accuracy: "Точность",
      progress: "Пройдено команд",
      typePrompt: "Напечатайте точную команду ниже:",
      completeTitle: "Забег завершен!",
      bestWpm: "Ваша скорость: {{wpm}} WPM",
      restart: "Запустить снова"
    },

    // Profile & Level Modal
    profile: {
      title: "Профиль Терминального Эксплорера",
      levelLabel: "Уровень",
      xpLabel: "Прогресс XP",
      streakLabel: "Дней серии",
      achievementsTitle: "Разблокированные Ачивки",
      statsTitle: "Статистика активности",
      commandsExec: "Выполнено команд",
      questsDone: "Пройдено квестов",
      quizzesDone: "Завершено викторин",
      bestWpm: "Лучшая скорость набора"
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
