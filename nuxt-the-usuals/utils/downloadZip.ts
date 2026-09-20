import type { DownloadItem } from "~/types";

/**
 * -------------------------------------------------------------
 * downloadZip
 * -------------------------------------------------------------
 * Downloads multiple files as a ZIP archive using the server API endpoint.
 * Creates a temporary anchor element to trigger the download in the browser.
 *
 * @param items - Array of files to include in the ZIP, each with a URL and optional filename
 * @param zipName - Name for the downloaded ZIP file (including .zip extension)
 * @param showToast - Optional toast instance to show error messages
 * @returns Promise that resolves when the download is triggered
 *
 * @example
 * ```ts
 * await downloadZip(
 *   [
 *     { url: 'https://example.com/image1.jpg', filename: 'photo-1.jpg' },
 *     { url: 'https://example.com/image2.jpg', filename: 'photo-2.jpg' }
 *   ],
 *   'my-photos.zip'
 * );
 * ```
 */
export async function downloadZip(
  items: DownloadItem[],
  zipName: string,
  showToast?: ReturnType<typeof useToast>,
): Promise<void> {
  if (!process.client) return;

  if (!items || !items.length) {
    showToast?.add({
      title: "No files to download",
      color: "warning",
      orientation: "horizontal",
    });
    return;
  }

  try {
    const res = await fetch("/api/download-zip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zipName,
        files: items,
      }),
    });

    if (!res.ok) {
      throw new Error(`Download failed: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = zipName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    showToast?.add({
      title: "Download failed",
      description: error instanceof Error ? error.message : "An error occurred",
      color: "error",
      orientation: "horizontal",
    });
    throw error;
  }
}
