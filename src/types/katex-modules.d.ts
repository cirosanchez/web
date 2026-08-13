/**
 * KaTeX ships no types for its auto-render contrib entry point, and the CSS
 * is pulled in via a dynamic import so it lands in its own lazy chunk.
 */
declare module "katex/contrib/auto-render" {
  interface RenderMathOptions {
    delimiters?: Array<{ left: string; right: string; display: boolean }>;
    throwOnError?: boolean;
    errorColor?: string;
    ignoredTags?: string[];
    ignoredClasses?: string[];
    macros?: Record<string, string>;
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: RenderMathOptions,
  ): void;
}

declare module "katex/dist/katex.min.css";
