"use client";

import { deletePost } from "@/lib/actions";

export default function DeletePostButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="text-neutral-500 hover:text-red-400 hover:underline"
      >
        delete
      </button>
    </form>
  );
}
