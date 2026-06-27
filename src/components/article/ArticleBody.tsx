import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img", "h1", "h2", "h3", "h4", "h5", "h6", "figure", "figcaption",
    "section", "article", "aside", "details", "summary", "mark", "time",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height", "loading"],
    a: ["href", "target", "rel"],
    time: ["datetime"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export default function ArticleBody({ content }: { content: string }) {
  const clean = sanitizeHtml(content, SANITIZE_OPTIONS);

  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:text-[var(--color-ink)] prose-headings:font-bold
        prose-p:text-[var(--color-body)] prose-p:leading-relaxed
        prose-a:text-[var(--color-accent)] prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-border)]
        prose-blockquote:text-[var(--color-body)] prose-blockquote:italic
        prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
