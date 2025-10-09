import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
};

export default function BlogIndex() {
  const postsDir = path.join(process.cwd(), "src/posts");
  const files = fs.readdirSync(postsDir);

  const posts: PostMeta[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fileContent = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(fileContent);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      description: data.description || "",
    };
  });

  // Sort posts by date (descending)
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

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