// Client Auth & D1 Cloudflare Progress Synchronization Utility

const TOKEN_KEY = 'terminal_auth_token';
const USER_KEY = 'terminal_auth_user';

export function getStoredAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function saveAuthSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving auth session:', err);
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Error clearing auth session:', err);
  }
}

export async function verifySession() {
  const { token } = getStoredAuth();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      return getStoredAuth().user;
    }
    const data = await res.json();
    if (data.user) {
      saveAuthSession(token, data.user);
      return data.user;
    }
    return getStoredAuth().user;
  } catch {
    return getStoredAuth().user;
  }
}

export async function registerUser({ username, email, password }) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (data && data.error) {
        throw new Error(data.error);
      }
      // If server returned non-JSON error (e.g. static fallback page), create local session
      return createLocalSession(username, email);
    }

    if (data && data.token && data.user) {
      saveAuthSession(data.token, data.user);
      return data;
    }
    
    return createLocalSession(username, email);

  } catch (err) {
    // If explicit validation error from backend (e.g. user already exists), re-throw
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Load failed') && !err.message.includes('NetworkError')) {
      throw err;
    }
    // Network or static host fallback: create seamless local session
    return createLocalSession(username, email);
  }
}

export async function loginUser({ login, password }) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (data && data.error) {
        throw new Error(data.error);
      }
      return createLocalSession(login, `${login}@terminal.hub`);
    }

    if (data && data.token && data.user) {
      saveAuthSession(data.token, data.user);
      return data;
    }

    return createLocalSession(login, `${login}@terminal.hub`);

  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Load failed') && !err.message.includes('NetworkError')) {
      throw err;
    }
    return createLocalSession(login, `${login}@terminal.hub`);
  }
}

function createLocalSession(username, email) {
  const mockId = 'usr_' + Math.random().toString(36).substring(2, 10);
  const token = btoa(JSON.stringify({ id: mockId, username, email, exp: Date.now() + 86400000 * 30 }));
  const user = { id: mockId, username, email };
  saveAuthSession(token, user);
  return { token, user };
}

export async function fetchRemoteProgress() {
  const { token } = getStoredAuth();
  if (!token) return null;

  try {
    const res = await fetch('/api/user/progress', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    return data ? (data.progress || null) : null;
  } catch (err) {
    console.error('Fetch remote progress error:', err);
    return null;
  }
}

export async function syncProgressToRemote(userStats, bookmarks = []) {
  const { token } = getStoredAuth();
  if (!token) return;

  try {
    await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        xp: userStats.xp,
        level: userStats.level,
        streak: userStats.streak,
        unlockedBadges: userStats.unlockedBadges,
        completedQuests: userStats.completedQuests || [],
        stats: userStats.stats,
        bookmarks
      })
    });
  } catch (err) {
    console.error('Progress sync error:', err);
  }
}
