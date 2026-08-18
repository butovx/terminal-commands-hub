// Cloudflare Pages Function: Load & Save Progress to D1 Database

function parseToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const raw = authHeader.replace("Bearer ", "");
  try {
    const payload = JSON.parse(atob(raw));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const user = parseToken(request.headers.get("Authorization"));
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ progress: null }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const row = await db.prepare("SELECT * FROM user_progress WHERE user_id = ?").bind(user.id).first();

    if (!row) {
      return new Response(JSON.stringify({ progress: null }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      progress: {
        xp: row.xp,
        level: row.level,
        streak: row.streak,
        unlockedBadges: JSON.parse(row.unlocked_badges || '[]'),
        completedQuests: JSON.parse(row.completed_quests || '[]'),
        stats: JSON.parse(row.stats_json || '{}'),
        bookmarks: JSON.parse(row.bookmarks_json || '[]')
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const user = parseToken(request.headers.get("Authorization"));
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { xp, level, streak, unlockedBadges, completedQuests, stats, bookmarks } = await request.json();
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({ success: true, synced: 'offline_mode' }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    await db.prepare(`
      INSERT INTO user_progress (user_id, xp, level, streak, unlocked_badges, completed_quests, stats_json, bookmarks_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        xp = excluded.xp,
        level = excluded.level,
        streak = excluded.streak,
        unlocked_badges = excluded.unlocked_badges,
        completed_quests = excluded.completed_quests,
        stats_json = excluded.stats_json,
        bookmarks_json = excluded.bookmarks_json,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      user.id,
      xp || 0,
      level || 1,
      streak || 1,
      JSON.stringify(unlockedBadges || []),
      JSON.stringify(completedQuests || []),
      JSON.stringify(stats || {}),
      JSON.stringify(bookmarks || [])
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
