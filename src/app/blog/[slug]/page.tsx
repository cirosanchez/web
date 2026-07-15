import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src/posts");
  const files = fs.readdirSync(postsDir);
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ""),
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="flex justify-center text-ctp-subtext0">
      <div className="max-w-2xl w-full pt-10 pb-10">
        <h1 className="text-2xl font-bold text-ctp-text mb-6">
          {data.title || slug}
        </h1>
        <article
          className=" leading-relaxed space-y-6 text-ctp-text"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}