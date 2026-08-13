import Link from "next/link";
import DeletePostButton from "@/components/admin/delete-post-button";
import { logout } from "@/lib/actions";
import { listPosts } from "@/lib/posts";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always reflect the current state of the store, never a cached copy.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await listPosts({ includeDrafts: true });

  return (
    <div className="flex justify-center text-neutral-400">
      <div className="max-w-2xl w-full pt-10 pb-10">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-300">
            <span className="text-neutral-500">\</span>admin
          </h1>
          <div className="flex items-baseline gap-4 text-sm">
            <Link
              href="/admin/edit/new"
              className="text-blue-400 hover:underline"
            >
              new post
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-neutral-500 hover:text-neutral-300 hover:underline"
              >
                log out
              </button>
            </form>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm">No posts yet.</p>
        ) : (
          <ul className="space-y-6 text-sm">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="border-b border-neutral-700 pb-4 last:border-b-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="text-neutral-300 hover:underline"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-baseline gap-3 shrink-0 text-xs">
                    {post.draft && (
                      <span className="text-yellow-500">draft</span>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-neutral-500 hover:text-neutral-300 hover:underline"
                    >
                      view
                    </Link>
                    <DeletePostButton slug={post.slug} title={post.title} />
                  </div>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {post.date || "no date"} · /{post.slug}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
