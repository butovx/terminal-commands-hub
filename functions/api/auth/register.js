// Cloudflare Pages Function: Register User Endpoint

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function onRequestOptions() {
  return new Response(null, { headers });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "Please fill in all fields (username, email, password)" }), {
        status: 400,
        headers
      });
    }

    const db = env.DB;
    if (!db) {
      // In local static mode or without D1 binding, return clean authenticated session
      const mockId = 'usr_' + Math.random().toString(36).substring(2, 10);
      const token = btoa(JSON.stringify({ id: mockId, username, email, exp: Date.now() + 86400000 * 30 }));
      return new Response(JSON.stringify({
        token,
        user: { id: mockId, username, email }
      }), { headers });
    }

    // Check existing user in D1
    const existing = await db.prepare("SELECT id FROM users WHERE username = ? OR email = ?").bind(username, email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: "User or email already registered" }), {
        status: 400,
        headers
      });
    }

    const userId = 'usr_' + crypto.randomUUID();
    const salt = crypto.randomUUID();
    const passwordHash = await hashPassword(password, salt);

    // Insert user into D1
    await db.prepare("INSERT INTO users (id, username, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)").bind(userId, username, email, passwordHash, salt).run();

    // Insert default progress into D1
    await db.prepare("INSERT INTO user_progress (user_id, xp, level, streak, unlocked_badges, completed_quests, stats_json, bookmarks_json) VALUES (?, 0, 1, 1, '[]', '[]', '{}', '[]')").bind(userId).run();

    const token = btoa(JSON.stringify({ id: userId, username, email, exp: Date.now() + 86400000 * 30 }));

    return new Response(JSON.stringify({
      token,
      user: { id: userId, username, email }
    }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Registration failed" }), {
      status: 500,
      headers
    });
  }
}
