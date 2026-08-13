import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/post-editor";
import { getPost } from "@/lib/posts";

export const metadata = {
  title: "Edit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === "new";
  const post = isNew ? null : await getPost(slug);

  if (!isNew && !post) notFound();

  return (
    <PostEditor
      post={
        post ?? {
          slug: "",
          title: "",
          date: new Date().toISOString().slice(0, 10),
          description: "",
          tags: [],
          draft: true,
          content: "",
        }
      }
      isNew={isNew}
    />
  );
}
