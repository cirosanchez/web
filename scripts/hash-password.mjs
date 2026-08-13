#!/usr/bin/env node
/**
 * Generates the ADMIN_PASSWORD_HASH value for .env.local and Vercel.
 *
 *   node scripts/hash-password.mjs
 *
 * The plaintext password is never written anywhere — only the salted scrypt
 * hash is printed. Use a 20+ character random password from a password
 * manager: it is the only thing protecting the admin panel.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline";

const scryptAsync = promisify(scrypt);

// Must match src/lib/password.ts
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LENGTH = 64;

async function readPassword() {
  // Piped input (`echo pw | node scripts/hash-password.mjs`) for scripted use.
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString("utf8").trim();
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  process.stdout.write("Password: ");

  // Suppress echo so the password never appears on screen or in scrollback.
  const originalWrite = rl.output.write.bind(rl.output);
  rl.output.write = () => {};

  const password = await new Promise((resolve) => rl.question("", resolve));

  rl.output.write = originalWrite;
  process.stdout.write("\n");
  rl.close();
  return password.trim();
}

const password = await readPassword();

if (!password) {
  console.error("No password provided.");
  process.exit(1);
}

if (password.length < 20) {
  console.error(
    `\nRefusing: password is ${password.length} characters, minimum is 20.\n` +
      `This password is the entire attack surface for your admin panel —\n` +
      `generate a long random one in your password manager instead.\n`,
  );
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scryptAsync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);

console.log("\nAdd this to .env.local and to your Vercel environment variables:\n");
console.log(`ADMIN_PASSWORD_HASH=${salt.toString("hex")}:${hash.toString("hex")}`);
console.log("\nAnd generate a session signing secret with:\n");
console.log("  openssl rand -base64 32\n");
