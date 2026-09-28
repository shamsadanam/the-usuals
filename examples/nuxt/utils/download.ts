/**
 * Downloads a file by creating a temporary anchor element and triggering a click.
 * Uses the server API endpoint to proxy the download and avoid CORS issues.
 *
 * @param fileUrl - The URL of the file to download
 * @param showToast - Optional toast instance to show error messages
 * @returns Promise that resolves when the download is triggered or rejects on error
 */
export async function download(
  fileUrl: string | undefined | null,
  showToast?: ReturnType<typeof useToast>,
): Promise<void> {
  if (!import.meta.client) return;

  if (!fileUrl) {
    showToast?.add({
      title: "File URL not available",
      orientation: "horizontal",
      color: "warning",
    });
    return;
  }

  try {
    const response = await fetch(
      `/api/download?url=${encodeURIComponent(fileUrl)}`,
    );

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // Check if the response is JSON (error response)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "File wasn't available on the site");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
