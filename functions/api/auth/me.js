// Cloudflare Pages Function: Verify Session Token & Get Current User

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
    const tokenData = parseToken(request.headers.get("Authorization"));
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({
        user: { id: tokenData.id, username: tokenData.username, email: tokenData.email }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const user = await db.prepare("SELECT id, username, email FROM users WHERE id = ?").bind(tokenData.id).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ user }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
