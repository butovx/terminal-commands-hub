// Cloudflare Pages Function: Login User Endpoint

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
    const { login, password } = await request.json();

    if (!login || !password) {
      return new Response(JSON.stringify({ error: "Missing login or password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const db = env.DB;
    if (!db) {
      const mockId = 'user_' + Math.random().toString(36).substring(2, 9);
      const token = btoa(JSON.stringify({ id: mockId, username: login, email: `${login}@terminal.hub`, exp: Date.now() + 86400000 * 7 }));
      return new Response(JSON.stringify({
        token,
        user: { id: mockId, username: login, email: `${login}@terminal.hub` }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").bind(login, login).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = btoa(JSON.stringify({ id: user.id, username: user.username, email: user.email, exp: Date.now() + 86400000 * 7 }));

    return new Response(JSON.stringify({
      token,
      user: { id: user.id, username: user.username, email: user.email }
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
