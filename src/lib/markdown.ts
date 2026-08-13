import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

/**
 * Markdown → HTML. Isomorphic on purpose: the published page renders this on
 * the server and the editor preview renders it in the browser, so both go
 * through the identical pipeline and cannot drift apart.
 *
 * Deliberately light — syntax highlighting and math are applied client-side
 * after mount by `<PostContent>`, keeping the heavy libraries off the server
 * and off the critical path.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const processed = await remark().use(gfm).use(html).process(markdown);
  return processed.toString();
}
