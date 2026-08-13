"use client";

import { useEffect, useRef } from "react";

/** Cheap pre-check so text-only posts never download KaTeX at all. */
function hasMath(html: string): boolean {
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\(|\\\[/.test(html);
}

/**
 * Renders post HTML, then enhances it in the browser: syntax highlighting for
 * fenced code and KaTeX for math. Both libraries are heavy, so they load
 * lazily after mount and only when the post actually needs them — the server
 * never runs either one.
 */
export default function PostContent({ html }: { html: string }) {
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = container.current;
    if (!root) return;

    let cancelled = false;

    const blocks = root.querySelectorAll<HTMLElement>("pre code");
    if (blocks.length > 0) {
      import("highlight.js/lib/common").then(({ default: hljs }) => {
        if (cancelled) return;
        blocks.forEach((block) => hljs.highlightElement(block));
      });
    }

    if (hasMath(html)) {
      Promise.all([
        import("katex/contrib/auto-render"),
        import("katex/dist/katex.min.css"),
      ]).then(([{ default: renderMathInElement }]) => {
        if (cancelled) return;
        renderMathInElement(root, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      });
    }

    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <article
      ref={container}
      className="prose prose-invert prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
