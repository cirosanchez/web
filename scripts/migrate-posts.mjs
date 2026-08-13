#!/usr/bin/env node
/**
 * One-time migration: uploads every src/posts/*.md into the Vercel Blob store.
 *
 *   node --env-file=.env.local scripts/migrate-posts.mjs
 *
 * Safe to re-run — it overwrites by exact pathname and never adds a suffix.
 * Once this succeeds and /blog looks right, src/posts/ can be deleted.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { put, list } from "@vercel/blob";

// The SDK prefers VERCEL_OIDC_TOKEN when present, which fails locally because
// OIDC is not enabled for the development environment. Force the rw token.
const token = process.env.BLOB_READ_WRITE_TOKEN;

const POSTS_DIR = join(process.cwd(), "src/posts");

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is not set.\n" +
      "Create a Blob store in the Vercel dashboard, connect it to this project,\n" +
      "then run: npx vercel env pull .env.local",
  );
  process.exit(1);
}

if (!existsSync(POSTS_DIR)) {
  console.error(`No ${POSTS_DIR} directory — nothing to migrate.`);
  process.exit(1);
}

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  console.error("No .md files found — nothing to migrate.");
  process.exit(1);
}

for (const file of files) {
  const pathname = `posts/${file}`;
  const body = readFileSync(join(POSTS_DIR, file), "utf8");

  await put(pathname, body, {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "text/markdown",
  });

  console.log(`  uploaded  ${pathname}  (${body.length} bytes)`);
}

const { blobs } = await list({ prefix: "posts/", token });
console.log(`\nStore now contains ${blobs.length} post(s):`);
for (const blob of blobs) console.log(`  ${blob.pathname}`);
console.log(
  "\nCheck /blog renders correctly, then delete src/posts/ from the repo.",
);
