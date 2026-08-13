import { del, get, list, put } from "@vercel/blob";
import {
  byDateDesc,
  parsePost,
  serializePost,
  type Post,
  type PostMeta,
} from "@/lib/post-format";

export type { Post, PostMeta } from "@/lib/post-format";
export { slugify } from "@/lib/post-format";

const PREFIX = "posts/";

/**
 * `vercel env pull` writes a VERCEL_OIDC_TOKEN into .env.local, and the SDK
 * prefers OIDC over the read-write token whenever it sees one — which fails
 * locally, since OIDC is not enabled for the development environment. Passing
 * the token explicitly makes credential selection deterministic everywhere.
 */
export function blobToken(): { token: string } | Record<string, never> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token ? { token } : {};
}

/** Posts are private blobs: drafts must not be readable by URL guessing. */
const ACCESS = { access: "private" } as const;

export function pathForSlug(slug: string): string {
  return `${PREFIX}${slug}.md`;
}

async function readBlob(pathname: string): Promise<string | null> {
  // useCache: false so an edit is visible immediately rather than serving a
  // stale CDN copy back to the editor.
  const result = await get(pathname, {
    ...ACCESS,
    ...blobToken(),
    useCache: false,
  });
  if (!result) return null;
  return new Response(result.stream).text();
}

export async function listPosts({ includeDrafts = false } = {}): Promise<
  PostMeta[]
> {
  const { blobs } = await list({ prefix: PREFIX, ...blobToken() });

  const posts = await Promise.all(
    blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map(async (blob) => {
        const slug = blob.pathname.slice(PREFIX.length, -".md".length);
        const raw = await readBlob(blob.pathname);
        if (!raw) return null;
        const post = parsePost(slug, raw);
        // Listing only needs metadata; drop the body.
        const { content, ...meta } = post;
        void content;
        return meta;
      }),
  );

  return posts
    .filter((post): post is PostMeta => post !== null)
    .filter((post) => includeDrafts || !post.draft)
    .sort(byDateDesc);
}

export async function getPost(slug: string): Promise<Post | null> {
  const raw = await readBlob(pathForSlug(slug));
  return raw === null ? null : parsePost(slug, raw);
}

export async function savePost(
  slug: string,
  post: Omit<Post, "slug">,
): Promise<void> {
  await put(pathForSlug(slug), serializePost(post), {
    ...ACCESS,
    ...blobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "text/markdown",
  });
}

export async function deletePost(slug: string): Promise<void> {
  await del(pathForSlug(slug), { ...blobToken() });
}
