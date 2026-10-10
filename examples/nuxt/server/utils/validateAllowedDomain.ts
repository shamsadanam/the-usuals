import { parseAllowedDomains } from "~~/utils/parseAllowedDomains";

// Validates URLs against configured allowlist. See docs/content/nuxt/3.utilities/1.download-zip.md
export function validateAllowedDomain(
  url: string,
  allowedDomainsString: string,
): URL {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid URL",
    });
  }

  const allowedEntries = parseAllowedDomains(allowedDomainsString);

  const isAllowed = allowedEntries.some((entry) => {
    if (entry.startsWith("http://") || entry.startsWith("https://")) {
      const normalizedEntry = entry.endsWith("/") ? entry : entry + "/";
      const normalizedUrl = parsedUrl.origin + parsedUrl.pathname;
      const normalizedUrlWithSlash = normalizedUrl.endsWith("/")
        ? normalizedUrl
        : normalizedUrl + "/";

      return (
        normalizedUrlWithSlash.startsWith(normalizedEntry) ||
        normalizedUrl.startsWith(normalizedEntry)
      );
    }

    const cleanedEntry = entry.replace(/\/$/, "");
    return parsedUrl.hostname === cleanedEntry;
  });

  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: "Domain not allowed",
    });
  }

  return parsedUrl;
}
