import { marked } from "marked";
import DOMPurify from "dompurify";

function markdownToHtml(markdown?: string) {
  if (!markdown) return "";

  const html = marked.parse(markdown, { async: false });
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

export function Markdown({ markdown }: { markdown?: string }) {
  return (
    <div
      className="markdown-body"
      style={{ color: "inherit !important" }}
      dangerouslySetInnerHTML={{
        __html: markdownToHtml(markdown),
      }}
    ></div>
  );
}
