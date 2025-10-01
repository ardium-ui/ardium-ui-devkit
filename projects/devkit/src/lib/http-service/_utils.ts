export function normalizePath(input: string | string[]): string {
  if (!Array.isArray(input)) {
    input = input.trim();
    return input.replace(/\/\/+$/g, "/");
  }
  return input
    .filter(Boolean)
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/+$/g, "");
      }
      return part.replace(/^\/+|\/+$/g, "");
    })
    .join("/")
    .replace(/\/\/+/g, "/");
}
