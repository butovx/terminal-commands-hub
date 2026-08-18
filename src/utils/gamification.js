// Gamification & User Progress System for TerminalHub

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, titleEn: 'Terminal Novice', titleRu: 'Новичок терминала', badge: '🌱' },
  { level: 2, xp: 100, titleEn: 'Command Student', titleRu: 'Ученик консоли', badge: '📗' },
  { level: 3, xp: 250, titleEn: 'Junior Sysadmin', titleRu: 'Младший сисадмин', badge: '🛠️' },
  { level: 4, xp: 500, titleEn: 'Shell Power User', titleRu: 'Продвинутый юзер', badge: '⚡' },
  { level: 5, xp: 900, titleEn: 'Bash Artisan', titleRu: 'Мастер Bash', badge: '🎨' },
  { level: 6, xp: 1400, titleEn: 'Zsh Commander', titleRu: 'Командир Zsh', badge: '🎖️' },
  { level: 7, xp: 2000, titleEn: 'Kernel Guru', titleRu: 'Гуру Ядра', badge: '🔮' },
  { level: 8, xp: 3000, titleEn: 'Terminal Legend', titleRu: 'Легенда Терминала', badge: '👑' }
];

export const BADGES = {
  first_command: {
    id: 'first_command',
    icon: '🎯',
    nameEn: 'First Command',
    nameRu: 'Первая команда',
    descEn: 'Execute your first command in the sandbox',
    descRu: 'Выполните первую команду в симуляторе'
  },
  vfs_explorer: {
    id: 'vfs_explorer',
    icon: '📂',
    nameEn: 'File Explorer',
    nameRu: 'Исследователь',
    descEn: 'Navigate virtual directories using cd and ls',
    descRu: 'Перейдите по директориям с помощью cd и ls'
  },
  quest_solver: {
    id: 'quest_solver',
    icon: '🕵️',
    nameEn: 'Quest Hunter',
    nameRu: 'Охотник за квестами',
    descEn: 'Complete your first terminal quest challenge',
    descRu: 'Пройдите свой первый квест в терминале'
  },
  quest_master: {
    id: 'quest_master',
    icon: '🏆',
    nameEn: 'Quest Champion',
    nameRu: 'Чемпион Квестов',
    descEn: 'Successfully complete all terminal quests',
    descRu: 'Успешно завершите все интерактивные квесты'
  },
  quiz_ace: {
    id: 'quiz_ace',
    icon: '🧠',
    nameEn: 'Quiz Ace',
    nameRu: 'Знаток Терминала',
    descEn: 'Score 100% on any terminal command quiz round',
    descRu: 'Наберите 100% правильных ответов в викторине'
  },
  speed_demon: {
    id: 'speed_demon',
    icon: '⚡',
    nameEn: 'Speed Typer',
    nameRu: 'Скоростной набор',
    descEn: 'Reach over 40 WPM in the command typing race',
    descRu: 'Достигните более 40 WPM в скоростном наборе'
  },
  bookmark_collector: {
    id: 'bookmark_collector',
    icon: '📚',
    nameEn: 'Command Collector',
    nameRu: 'Коллекционер',
    descEn: 'Bookmark 5 or more terminal commands',
    descRu: 'Добавьте 5 или более команд в избранное'
  },
  streak_fire: {
    id: 'streak_fire',
    icon: '🔥',
    nameEn: 'Streak Flame',
    nameRu: 'Огонь серии',
    descEn: 'Maintain an active daily learning streak',
    descRu: 'Поддерживайте ежедневную серию занятий'
  },
  level_5_master: {
    id: 'level_5_master',
    icon: '👑',
    nameEn: 'Shell Master',
    nameRu: 'Мастер Консоли',
    descEn: 'Reach Level 5 or higher',
    descRu: 'Достигните 5 уровня или выше'
  }
};

const STORAGE_KEY = 'terminal_user_stats';

export function getDefaultStats() {
  const today = new Date().toISOString().split('T')[0];
  return {
    xp: 0,
    level: 1,
    unlockedBadges: [],
    streak: 1,
    lastActiveDate: today,
    stats: {
      commandsExecuted: 0,
      questsCompleted: 0,
      quizzesPlayed: 0,
      quizCorrectAnswers: 0,
      speedTyperBestWpm: 0,
    }
  };
}

export function loadUserStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return checkAndUpdateStreak(getDefaultStats());
    const parsed = JSON.parse(raw);
    return checkAndUpdateStreak({
      ...getDefaultStats(),
      ...parsed,
      stats: { ...getDefaultStats().stats, ...(parsed.stats || {}) }
    });
  } catch (err) {
    console.error('Error loading gamification stats:', err);
    return getDefaultStats();
  }
}

export function saveUserStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving gamification stats:', err);
  }
}

export function getCurrentLevelInfo(xp) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || null;
    }
  }

  const currentLevelXp = current.xp;
  const nextLevelXp = next ? next.xp : current.xp;
  const xpInLevel = xp - currentLevelXp;
  const levelXpRequired = nextLevelXp - currentLevelXp;
  const progressPercent = next ? Math.min(100, Math.floor((xpInLevel / (levelXpRequired || 1)) * 100)) : 100;

  return {
    current,
    next,
    progressPercent,
    xpInLevel,
    levelXpRequired
  };
}

function checkAndUpdateStreak(stats) {
  const today = new Date().toISOString().split('T')[0];
  if (stats.lastActiveDate === today) return stats;

  const lastDate = new Date(stats.lastActiveDate);
  const currentDate = new Date(today);
  const diffTime = Math.abs(currentDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = stats.streak;
  if (diffDays === 1) {
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1;
  }

  const updated = {
    ...stats,
    streak: newStreak,
    lastActiveDate: today
  };
  saveUserStats(updated);
  return updated;
}
