/**
 * -------------------------------------------------------------
 * POST /api/download-zip
 * -------------------------------------------------------------
 * Downloads multiple remote files and returns them as a ZIP.
 *
 * BODY
 * @param {Object} body
 * @param {Array<{ url: string; filename?: string }>} body.files
 * @param {string} body.zipName - (optional) ZIP file name
 *
 * RESPONSE
 * - application/zip
 * - attachment; filename="{zipName}"
 *
 * USAGE
 * fetch('/api/download-zip', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     zipName: 'files.zip',
 *     files: [{ url: '...', filename: 'a.pdf' }]
 *   })
 * })
 *
 * LIMITATIONS
 * - JSZip loads files into memory
 * - Use archiver package for large files
 *
 * -------------------------------------------------------------
 */

import {
  defineEventHandler,
  readBody,
  setResponseHeaders,
  createError,
} from "h3";
import JSZip from "jszip";
import type { DownloadItem } from "~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    files: DownloadItem[];
    zipName?: string;
  }>(event);

  if (!body?.files?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No files provided",
    });
  }

  const zipName = body.zipName ?? "files.zip";
  const zip = new JSZip();

  // 🔒 prevent open proxy
  const config = useRuntimeConfig();

  // Validate all URLs upfront
  body.files.forEach(({ url }) => {
    validateAllowedDomain(url, config.allowedDomains);
  });

  for (const file of body.files) {
    const res = await fetch(file.url);

    if (!res.ok) continue;

    const arrayBuffer = await res.arrayBuffer();

    const filename =
      file.filename || file.url.split("/").pop() || `file-${Date.now()}`;

    zip.file(filename, arrayBuffer);
  }

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  setResponseHeaders(event, {
    "content-type": "application/zip",
    "content-disposition": `attachment; filename="${zipName}"`,
    "content-length": zipBuffer.length,
  });

  return zipBuffer;
});
