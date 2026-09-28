/**
 * -------------------------------------------------------------
 * GET /api/download
 * -------------------------------------------------------------
 * Proxies a single file download through the Nuxt server.
 *
 * PURPOSE
 * - Avoids CORS issues
 * - Forces browser download using Content-Disposition
 * - Streams file (low memory usage)
 *
 * QUERY PARAMETERS
 * @param {string} url       - (required) Public file URL
 * @param {string} filename - (optional) Override download filename
 *
 * RESPONSE
 * - Content-Type: original file type or application/octet-stream
 * - Content-Disposition: attachment
 *
 * USAGE (client-side)
 * window.location.href =
 *   `/api/download?url=${encodeURIComponent(fileUrl)}`
 *
 * NOTES
 * - Do NOT use $fetch() for downloads
 * - Add domain allowlist in production
 *
 * -------------------------------------------------------------
 */

import {
  defineEventHandler,
  getQuery,
  setResponseHeaders,
  createError,
} from "h3";

export default defineEventHandler(async (event) => {
  const { url, filename } = getQuery(event);

  if (!url || typeof url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "No URL provided",
    });
  }

  // -------------------------------------------------------------
  // DOMAIN ALLOWLIST (supports http + https + IPs)
  // -------------------------------------------------------------
  const config = useRuntimeConfig();
  const parsedUrl = validateAllowedDomain(url, config.allowedDomains);

  // -------------------------------------------------------------
  // FETCH & STREAM FILE
  // -------------------------------------------------------------
  const res = await fetch(parsedUrl.toString());

  if (!res.ok || !res.body) {
    throw createError({
      statusCode: 404,
      statusMessage: "Failed to fetch file",
    });
  }

  const downloadName =
    typeof filename === "string" && filename
      ? filename
      : basenameFromPath(parsedUrl.pathname);

  setResponseHeaders(event, {
    "content-type":
      res.headers.get("content-type") ?? "application/octet-stream",
    "content-disposition": contentDisposition(downloadName),
    "cache-control": "no-store",
  });

  // Stream directly to browser
  return res.body;
});

function basenameFromPath(pathname: string): string {
  const basename = pathname.split("/").pop() || "file";
  try {
    return decodeURIComponent(basename);
  } catch {
    return basename;
  }
}

// RFC 6266: `filename` must be quoted ASCII, so non-ASCII names travel in `filename*`.
function contentDisposition(name: string): string {
  const asciiFallback = name.replace(/[^\x20-\x7e]|["\\]/g, "_");
  const encoded = encodeURIComponent(name).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}
