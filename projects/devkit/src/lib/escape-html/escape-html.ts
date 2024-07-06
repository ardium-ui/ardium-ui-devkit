const UNESCAPED_HTML_REGEX = /[&<>"']/g;
const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
} as const;

export function escapeHTML(value: string) {
  if (!value || !UNESCAPED_HTML_REGEX.test(value)) return value;

  return value.replace(
    UNESCAPED_HTML_REGEX,
    (chr) => HTML_ESCAPES[chr as keyof typeof HTML_ESCAPES],
  );
}
