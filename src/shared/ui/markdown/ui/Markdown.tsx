import { marked } from "marked";
import DOMPurify from "dompurify";
import { cn } from "@/shared/lib";

function markdownToHtml(markdown?: string) {
  if (!markdown) return "";

  const html = marked.parse(markdown, { async: false });
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

export function Markdown({
  markdown,
  className,
}: {
  markdown?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("markdown-body", className)}
      style={{ color: "inherit !important" }}
      dangerouslySetInnerHTML={{
        __html: markdownToHtml(markdown),
      }}
    ></div>
  );
}
