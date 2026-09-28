/**
 * Parses a comma-separated string of allowed domains into a clean array.
 *
 * @param domainsString - Comma-separated list of domains/URLs
 * @returns Array of trimmed domain strings
 *
 * @example
 * parseAllowedDomains("youtube.com, vimeo.com, http://example.com")
 * // Returns: ["youtube.com", "vimeo.com", "http://example.com"]
 */
export function parseAllowedDomains(domainsString: string): string[] {
  return domainsString
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
}
