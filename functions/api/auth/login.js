// Cloudflare Pages Function: Login User Endpoint

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
    const { login, password } = body;

    if (!login || !password) {
      return new Response(JSON.stringify({ error: "Missing login or password" }), {
        status: 400,
        headers
      });
    }

    const db = env.DB;
    if (!db) {
      const mockId = 'usr_' + Math.random().toString(36).substring(2, 10);
      const token = btoa(JSON.stringify({ id: mockId, username: login, email: `${login}@terminal.hub`, exp: Date.now() + 86400000 * 30 }));
      return new Response(JSON.stringify({
        token,
        user: { id: mockId, username: login, email: `${login}@terminal.hub` }
      }), { headers });
    }

    const user = await db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").bind(login, login).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid login or password" }), {
        status: 401,
        headers
      });
    }

    const computedHash = await hashPassword(password, user.salt);
    if (computedHash !== user.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid login or password" }), {
        status: 401,
        headers
      });
    }

    const token = btoa(JSON.stringify({ id: user.id, username: user.username, email: user.email, exp: Date.now() + 86400000 * 30 }));

    return new Response(JSON.stringify({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Login failed" }), {
      status: 500,
      headers
    });
  }
}
