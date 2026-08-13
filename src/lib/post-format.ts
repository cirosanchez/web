import matter from "gray-matter";

/**
 * Pure post shaping: types, slugs, frontmatter parsing and serialisation.
 *
 * Deliberately free of storage imports so client components (the editor) can
 * use `slugify` and the types without pulling `@vercel/blob` into the bundle.
 */

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO `yyyy-mm-dd`. Always a string, never a Date. */
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
};

export type Post = PostMeta & { content: string };

/** Lowercase, hyphenated, filesystem- and URL-safe. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Unquoted YAML dates (`date: 2025-03-23`) are parsed by gray-matter into JS
 * Date objects, while quoted ones stay strings. Normalise both to `yyyy-mm-dd`.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.trim();
  return "";
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: normalizeDate(data.date),
    description: typeof data.description === "string" ? data.description : "",
    tags: normalizeTags(data.tags),
    draft: data.draft === true,
    content,
  };
}

/** Serialises a post back to frontmatter + body for storage. */
export function serializePost(post: Omit<Post, "slug">): string {
  return matter.stringify(post.content, {
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    draft: post.draft,
  });
}

/** Newest first. Posts without a date sort last. */
export function byDateDesc(a: PostMeta, b: PostMeta): number {
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}
