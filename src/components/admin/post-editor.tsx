"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { savePost, uploadImage, type SaveState } from "@/lib/actions";
import { slugify, type Post } from "@/lib/post-format";
import { renderMarkdown } from "@/lib/markdown";

const initialState: SaveState = {};

const inputClass =
  "w-full bg-transparent border border-neutral-700 px-3 py-2 text-neutral-300 outline-none focus:border-neutral-500";

function autosaveKey(slug: string) {
  return `post-draft:${slug || "new"}`;
}

export default function PostEditor({
  post,
  isNew,
}: {
  post: Post;
  isNew: boolean;
}) {
  const [state, formAction, pending] = useActionState(savePost, initialState);

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [restored, setRestored] = useState(false);

  // Only auto-derive the slug until the user types one themselves.
  const slugTouched = useRef(!isNew);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!slugTouched.current) setSlug(slugify(title));
  }, [title]);

  // Debounced preview so every keystroke doesn't re-run the pipeline.
  useEffect(() => {
    const timer = setTimeout(() => {
      renderMarkdown(content).then(setPreview);
    }, 200);
    return () => clearTimeout(timer);
  }, [content]);

  // Restore an unsaved draft left behind by a closed tab.
  useEffect(() => {
    const saved = localStorage.getItem(autosaveKey(post.slug));
    if (saved && saved !== post.content) {
      setContent(saved);
      setRestored(true);
    }
    // Intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(autosaveKey(post.slug), content);
    }, 500);
    return () => clearTimeout(timer);
  }, [content, post.slug]);

  /** Splices text in at the cursor, keeping the caret after it. */
  function insertAtCursor(text: string) {
    const el = textarea.current;
    if (!el) {
      setContent((current) => current + text);
      return;
    }
    const { selectionStart: start, selectionEnd: end } = el;
    setContent((current) => current.slice(0, start) + text + current.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + text.length;
    });
  }

  function replaceInContent(needle: string, replacement: string) {
    setContent((current) => current.replace(needle, replacement));
  }

  async function handleFiles(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;

    setUploading(true);
    for (const file of images) {
      const token = `![uploading ${crypto.randomUUID().slice(0, 8)}...]()`;
      insertAtCursor(`\n${token}\n`);
      try {
        const data = new FormData();
        data.set("file", file);
        const url = await uploadImage(data);
        replaceInContent(token, `![${file.name}](${url})`);
      } catch (error) {
        replaceInContent(
          token,
          `<!-- upload failed: ${error instanceof Error ? error.message : "unknown error"} -->`,
        );
      }
    }
    setUploading(false);
  }

  return (
    <div className="flex justify-center text-neutral-400">
      <div className="max-w-5xl w-full pt-10 pb-10 px-4">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-300">
            <span className="text-neutral-500">\</span>
            {isNew ? "new" : "edit"}
          </h1>
          <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
            back
          </Link>
        </div>

        {restored && (
          <p className="mb-4 text-xs text-yellow-500">
            Restored an unsaved draft from this browser.
          </p>
        )}

        <form action={formAction} className="space-y-4 text-sm">
          <input type="hidden" name="originalSlug" value={post.slug} />
          <input type="hidden" name="content" value={content} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 block">
              <span className="block text-neutral-400">title</span>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="space-y-1 block">
              <span className="block text-neutral-400">slug</span>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  setSlug(e.target.value);
                }}
                className={inputClass}
              />
            </label>

            <label className="space-y-1 block">
              <span className="block text-neutral-400">date</span>
              <input
                name="date"
                type="date"
                defaultValue={post.date}
                className={inputClass}
              />
            </label>

            <label className="space-y-1 block">
              <span className="block text-neutral-400">
                tags <span className="text-neutral-600">(comma separated)</span>
              </span>
              <input
                name="tags"
                defaultValue={post.tags.join(", ")}
                className={inputClass}
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="block text-neutral-400">description</span>
            <input
              name="description"
              defaultValue={post.description}
              className={inputClass}
            />
          </label>

          <label className="flex items-center gap-2 text-neutral-400">
            <input
              name="draft"
              type="checkbox"
              defaultChecked={post.draft}
              className="accent-neutral-500"
            />
            draft <span className="text-neutral-600">(hidden from /blog)</span>
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-neutral-400">markdown</span>
                <span className="text-xs text-neutral-600">
                  {uploading ? "uploading image..." : "paste or drop an image"}
                </span>
              </div>
              <textarea
                ref={textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={(e) => {
                  const files = Array.from(e.clipboardData.files);
                  if (files.some((f) => f.type.startsWith("image/"))) {
                    e.preventDefault();
                    handleFiles(files);
                  }
                }}
                onDrop={(e) => {
                  const files = Array.from(e.dataTransfer.files);
                  if (files.some((f) => f.type.startsWith("image/"))) {
                    e.preventDefault();
                    handleFiles(files);
                  }
                }}
                spellCheck={false}
                className="w-full h-[60vh] bg-transparent border border-neutral-700 p-3 text-neutral-300 outline-none focus:border-neutral-500 resize-y font-mono text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400">preview</span>
              <div
                className="prose prose-invert prose-sm max-w-none h-[60vh] overflow-y-auto border border-neutral-800 p-3"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending || uploading}
              className="border border-neutral-700 px-4 py-2 text-neutral-300 hover:border-neutral-500 hover:underline disabled:opacity-50"
            >
              {pending ? "saving..." : "save"}
            </button>
            {state.error && (
              <p role="alert" className="text-red-400">
                {state.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
