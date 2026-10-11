// `?redirect=` is user-controlled. navigateTo() throws on external URLs, so an
// unchecked value turns a phishing link into an error page right after login.
// `//host` and `/\host` are protocol-relative in browsers, hence the extra checks.
export function safeRedirect(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
