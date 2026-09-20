export const useFileDownloader = () => {
  const toast = useToast();
  const isDownloading = ref(false);

  const download = async (
    fileUrl: string | undefined | null,
    showToast: boolean = true,
  ): Promise<void> => {
    if (!process.client) return;

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
      link.download = "";
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
    } finally {
      return;
    }
  };

  return {
    isDownloading,
    download,
  };
};
