import { scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Must match scripts/hash-password.mjs
const SCRYPT_PARAMS: ScryptOptions = { N: 16384, r: 8, p: 1 };
const KEY_LENGTH = 64;

/**
 * `promisify(scrypt)` drops the options overload, so wrap it by hand to keep
 * the cost parameters typed.
 */
function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) =>
      err ? reject(err) : resolve(derivedKey),
    );
  });
}

/** Slows down online guessing regardless of how fast the attacker's network is. */
const FAILURE_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifies a password against ADMIN_PASSWORD_HASH (`salt:hash`, both hex).
 *
 * Node runtime only — `node:crypto`'s scrypt is not available on the edge.
 * Failures are delayed; successes return immediately.
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) throw new Error("ADMIN_PASSWORD_HASH is not set");

  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) {
    throw new Error("ADMIN_PASSWORD_HASH is malformed, expected 'salt:hash'");
  }

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(
    password,
    Buffer.from(saltHex, "hex"),
    KEY_LENGTH,
    SCRYPT_PARAMS,
  );

  // Length check first: timingSafeEqual throws on a length mismatch.
  const ok =
    actual.length === expected.length && timingSafeEqual(actual, expected);

  if (!ok) await delay(FAILURE_DELAY_MS);
  return ok;
}
