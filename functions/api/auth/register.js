// Cloudflare Pages Function: Register User Endpoint

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password + salt),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  const hashArray = Array.from(new Uint8Array(exported));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const db = env.DB;
    if (!db) {
      // In local static mode without D1 binding, return mock successful response
      const mockId = 'user_' + Math.random().toString(36).substring(2, 9);
      const token = btoa(JSON.stringify({ id: mockId, username, email, exp: Date.now() + 86400000 * 7 }));
      return new Response(JSON.stringify({
        token,
        user: { id: mockId, username, email }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check existing user
    const existing = await db.prepare("SELECT id FROM users WHERE username = ? OR email = ?").bind(username, email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: "User or email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = 'usr_' + crypto.randomUUID();
    const salt = crypto.randomUUID();
    const passwordHash = await hashPassword(password, salt);

    // Insert user into D1
    await db.prepare("INSERT INTO users (id, username, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)").bind(userId, username, email, passwordHash, salt).run();

    // Insert default progress into D1
    await db.prepare("INSERT INTO user_progress (user_id, xp, level, streak, unlocked_badges, completed_quests, stats_json, bookmarks_json) VALUES (?, 0, 1, 1, '[]', '[]', '{}', '[]')").bind(userId).run();

    const token = btoa(JSON.stringify({ id: userId, username, email, exp: Date.now() + 86400000 * 7 }));

    return new Response(JSON.stringify({
      token,
      user: { id: userId, username, email }
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
