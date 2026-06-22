import type * as React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  a: ({ children, href, ...props }) => (
    <a
      className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),
  li: ({ children, ...props }) => (
    <li className="ps-1" {...props}>
      {children}
    </li>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mt-3 list-decimal space-y-2 ps-5" {...props}>
      {children}
    </ol>
  ),
  p: ({ children, ...props }) => (
    <p className="not-first:mt-3" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mt-3 list-disc space-y-2 ps-5" {...props}>
      {children}
    </ul>
  ),
};

export function MarkdownContent({
  children,
  className,
}: {
  children: string;
  className?: string;
}): React.ReactElement {
  return (
    <div className={cn("text-pretty", className)}>
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
