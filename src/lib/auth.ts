/**
 * Lightweight signed-cookie session auth using Web Crypto API (HMAC-SHA256).
 * Works on both Edge (middleware) and Node.js (API routes).
 * No external dependencies required.
 */

export const COOKIE_NAME = "lrl_session";
const SESSION_MS = 24 * 60 * 60 * 1000; // 24 hours

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function fromB64url(s: string): ArrayBuffer {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer as ArrayBuffer;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(email: string): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET not set");

  const payload = btoa(JSON.stringify({ email, exp: Date.now() + SESSION_MS }));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const dot = token.lastIndexOf(".");
    if (dot < 0) return null;

    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromB64url(sig),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;

    const { email, exp } = JSON.parse(atob(payload));
    if (Date.now() > exp) return null;

    return { email };
  } catch {
    return null;
  }
}
