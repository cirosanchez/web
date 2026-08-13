"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import {
  deletePost as deletePostBlob,
  getPost,
  savePost as savePostBlob,
  blobToken,
  slugify,
  type Post,
} from "@/lib/posts";

/**
 * Server actions are reachable by anyone who knows the action id, so every
 * mutation re-checks the session rather than trusting middleware alone.
 */
async function requireSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    throw new Error("Unauthorized");
  }
}

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return { error: "Password required." };
  }

  if (!(await verifyPassword(password))) {
    // Deliberately vague: no hint about whether the password was close.
    return { error: "Incorrect password." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);

  // redirect() throws internally, so it must sit outside any try/catch.
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export type SaveState = { error?: string };

function revalidatePost(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function savePost(
  _prevState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const originalSlug = String(formData.get("originalSlug") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!title) return { error: "Title is required." };

  const slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return { error: "Could not derive a slug from that title." };

  // Creating, or renaming onto an existing slug, must not silently clobber.
  if (slug !== originalSlug && (await getPost(slug))) {
    return { error: `A post with the slug "${slug}" already exists.` };
  }

  const post: Omit<Post, "slug"> = {
    title,
    date: String(formData.get("date") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    draft: formData.get("draft") === "on",
    content,
  };

  await savePostBlob(slug, post);

  // A renamed post leaves its old blob behind; remove it.
  if (originalSlug && originalSlug !== slug) {
    await deletePostBlob(originalSlug);
    revalidatePost(originalSlug);
  }

  revalidatePost(slug);
  redirect("/admin");
}

export async function deletePost(formData: FormData) {
  await requireSession();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  await deletePostBlob(slug);
  revalidatePost(slug);
  revalidatePath("/admin");
}

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Uploads a pasted or picked image and returns its public URL. */
export async function uploadImage(formData: FormData): Promise<string> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is larger than 10MB");
  }

  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
    : (file.type.split("/")[1] ?? "png");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";

  const blob = await put(`images/${base}.${extension}`, file, {
    access: "public",
    ...blobToken(),
    addRandomSuffix: true, // avoids collisions between same-named pastes
    contentType: file.type,
  });

  return blob.url;
}
