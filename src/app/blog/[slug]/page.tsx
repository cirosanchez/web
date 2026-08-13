import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import PostContent from "@/components/post-content";

export async function generateStaticParams() {
  const posts = await listPosts({ includeDrafts: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const contentHtml = await renderMarkdown(post.content);

  return (
    <div className="flex justify-center text-neutral-400">
      <div className="max-w-2xl w-full pt-10 pb-10">
        <h1 className="text-2xl font-bold text-neutral-300 mb-6">
          {post.title}
        </h1>
        <PostContent html={contentHtml} />
      </div>
    </div>
  );
}
