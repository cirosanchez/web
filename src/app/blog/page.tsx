import Link from "next/link";
import { listPosts } from "@/lib/posts";

export default async function BlogIndex() {
  const posts = await listPosts();

  return (
    <div className="flex justify-center text-neutral-400">
      <div className="max-w-2xl w-full pt-10 pb-10">
        <h1 className="text-2xl font-bold text-neutral-300 mb-8">Blog</h1>
        <ul className="space-y-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-neutral-700 pb-6 last:border-b-0 last:pb-0"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="text-xl font-semibold text-blue-400 hover:underline transition-colors duration-200"
              >
                {post.title}
              </Link>
              <div className="text-xs text-neutral-500 mt-1">
                {post.date && (
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      // Dates are date-only, so parse and format in UTC —
                      // otherwise a UTC-5 viewer sees the previous day.
                      timeZone: "UTC",
                    })}
                  </time>
                )}
              </div>
              {post.description && (
                <p className="mt-2 text-sm text-neutral-300">
                  {post.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
