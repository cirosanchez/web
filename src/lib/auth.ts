import { SignJWT, jwtVerify } from "jose";

/**
 * Session handling. Deliberately edge-safe: this module must not import
 * `node:crypto`, because `src/middleware.ts` runs on the edge runtime.
 * Password hashing lives in `src/lib/password.ts` (Node runtime only).
 */

export const SESSION_COOKIE = "session";
const SESSION_DURATION = "7d";

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(value);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secret());
}

/** Returns true only for a well-formed, unexpired, correctly signed token. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
