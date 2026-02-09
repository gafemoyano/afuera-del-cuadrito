import type { APIRoute } from "astro";
import turso from "@/lib/turso";

export const prerender = false;

async function ensureTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_slug TEXT NOT NULL,
      author_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      approved INTEGER NOT NULL DEFAULT 1
    )
  `);
  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug)
  `);
}

let tableReady = false;

async function init() {
  if (!tableReady) {
    await ensureTable();
    tableReady = true;
  }
}

export const GET: APIRoute = async ({ url }) => {
  await init();

  const postSlug = url.searchParams.get("postSlug");
  if (!postSlug) {
    return new Response(JSON.stringify({ error: "postSlug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await turso.execute({
    sql: "SELECT id, post_slug, author_name, message, created_at FROM comments WHERE post_slug = ? AND approved = 1 ORDER BY created_at DESC",
    args: [postSlug],
  });

  const comments = result.rows.map((row) => ({
    id: row.id,
    postSlug: row.post_slug,
    authorName: row.author_name,
    message: row.message,
    createdAt: row.created_at,
  }));

  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  await init();

  let body: { postSlug?: string; authorName?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { postSlug, authorName, message } = body;

  if (!postSlug || typeof postSlug !== "string") {
    return new Response(JSON.stringify({ error: "postSlug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (
    !authorName ||
    typeof authorName !== "string" ||
    authorName.trim().length === 0
  ) {
    return new Response(JSON.stringify({ error: "authorName is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (authorName.trim().length > 100) {
    return new Response(
      JSON.stringify({ error: "authorName too long (max 100)" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  if (message.trim().length > 2000) {
    return new Response(
      JSON.stringify({ error: "message too long (max 2000)" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Honeypot: silently accept but don't store — bots think it worked
  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return new Response(
      JSON.stringify({
        id: -1,
        postSlug,
        authorName: authorName.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = await turso.execute({
    sql: "INSERT INTO comments (post_slug, author_name, message) VALUES (?, ?, ?) RETURNING id, post_slug, author_name, message, created_at",
    args: [postSlug, authorName.trim(), message.trim()],
  });

  const row = result.rows[0];
  const comment = {
    id: row.id,
    postSlug: row.post_slug,
    authorName: row.author_name,
    message: row.message,
    createdAt: row.created_at,
  };

  return new Response(JSON.stringify(comment), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
