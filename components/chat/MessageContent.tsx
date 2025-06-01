"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Copy, Check, ExternalLink, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  content: string;
}

function MessageContent({ content }: MessageContentProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override the default code renderer to handle code blocks properly
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            // For inline code
            if (inline) {
              return (
                <code
                  className={cn(
                    "bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // For code blocks, return a completely separate component
            // This ensures it's not wrapped in a paragraph
            return <CodeBlock language={language} code={code} />;
          },
          // Override paragraph to ensure it doesn't try to wrap disallowed elements
          p({ children }) {
            return <p>{children}</p>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6 rounded-md border border-border shadow-sm">
                <table className="border-collapse w-full">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-border px-4 py-2 bg-muted text-left font-medium">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-border px-4 py-2">{children}</td>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <div className="my-4 rounded-md overflow-hidden border border-border shadow-sm">
                <div className="relative">
                  <img
                    src={
                      src || "/placeholder.svg?height=300&width=600&query=image"
                    }
                    alt={alt || "Image"}
                    className="max-w-full h-auto object-cover rounded-md"
                    {...props}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-background/90 rounded-full p-2 shadow-lg">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                {alt && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted/50 border-t border-border">
                    <ImageIcon className="h-3 w-3 inline mr-1" />
                    {alt}
                  </div>
                )}
              </div>
            );
          },
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                {...props}
              >
                {children}
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/20 pl-4 italic bg-muted/30 py-1 px-2 rounded-sm my-4">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-md overflow-hidden shadow-md group">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-1.5 text-xs text-zinc-100">
        <span className="font-medium">{language || "code"}</span>
        <button
          className="text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 bg-zinc-700/50 px-2 py-0.5 rounded"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: "0 0 0.375rem 0.375rem" }}
          showLineNumbers
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default memo(MessageContent);
