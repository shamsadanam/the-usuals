import { parseAllowedDomains } from "~~/utils/parseAllowedDomains";

/**
 * Validates if a URL is allowed based on domain/path restrictions.
 * Supports both hostname-only matching and full URL prefix matching.
 *
 * @param url - The URL to validate
 * @param allowedDomainsString - Comma-separated list of allowed domains/URLs
 * @returns The parsed URL if valid
 * @throws H3Error with 400 or 403 status code if invalid
 *
 * @example
 * // Allows any path on this host:
 * "194.233.76.204"
 *
 * // Only allows URLs starting with this base path:
 * "http://194.233.76.204/atv-ecom/"
 */
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
    // Case 1: Entry is a full URL with protocol (e.g., "http://194.233.76.204/atv-ecom/")
    if (entry.startsWith("http://") || entry.startsWith("https://")) {
      // Normalize: ensure trailing slash for proper prefix matching
      const normalizedEntry = entry.endsWith("/") ? entry : entry + "/";
      const normalizedUrl = parsedUrl.origin + parsedUrl.pathname;
      const normalizedUrlWithSlash = normalizedUrl.endsWith("/")
        ? normalizedUrl
        : normalizedUrl + "/";

      // Check if URL starts with the allowed base path
      return (
        normalizedUrlWithSlash.startsWith(normalizedEntry) ||
        normalizedUrl.startsWith(normalizedEntry)
      );
    }

    // Case 2: Entry is just a hostname/IP (e.g., "194.233.76.204")
    // Remove trailing slash if present
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
