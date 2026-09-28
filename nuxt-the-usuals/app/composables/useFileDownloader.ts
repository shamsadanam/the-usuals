// A blob: URL drops the response headers, so the name the server chose has to be copied onto the link.
const filenameFromDisposition = (header: string | null): string | null => {
  if (!header) return null;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      // Malformed encoding; the plain filename below is still usable.
    }
  }

  return header.match(/filename="([^"]+)"/i)?.[1] ?? null;
};

const filenameFromUrl = (fileUrl: string): string => {
  const basename = fileUrl.split(/[?#]/)[0]?.split("/").pop() ?? "";
  try {
    return decodeURIComponent(basename);
  } catch {
    return basename;
  }
};

export const useFileDownloader = () => {
  const toast = useToast();
  const isDownloading = ref(false);

  const download = async (
    fileUrl: string | undefined | null,
    showToast: boolean = true,
    filename?: string | null,
  ): Promise<void> => {
    if (!import.meta.client) return;

    if (!fileUrl) {
      if (showToast) {
        toast.add({
          title: "File URL not available",
          orientation: "horizontal",
          color: "warning",
        });
      }
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
        throw new Error(
          errorData.message || "File wasn't available on the site",
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename ||
        filenameFromDisposition(response.headers.get("content-disposition")) ||
        filenameFromUrl(fileUrl);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      if (showToast) {
        toast.add({
          title: "Download failed",
          description:
            error instanceof Error ? error.message : "An error occurred",
          color: "error",
          orientation: "horizontal",
        });
      }
      throw error;
    }
  };

  return {
    isDownloading,
    download,
  };
};
