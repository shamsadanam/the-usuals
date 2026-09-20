<!--
/**
 * DownloadFilesButton Component
 * 
 * A unified button component for downloading single files or multiple files as a ZIP archive.
 * Automatically detects whether to download directly (single file) or create a ZIP (multiple files).
 * 
 * @component
 * 
 * DEPENDENCIES:
 * - types/DownloadItem.ts
 * - composables/useFileDownloader.ts
 * - utils/downloadZip.ts
 * - server/api/download-zip.post.ts
 * - @nuxt/ui (UButton, ButtonProps, useToast)
 * - @vueuse/core (useDebounce)
 * 
 * FEATURES:
 * - Single file: Downloads directly without ZIP compression
 * - Multiple files: Downloads as ZIP archive
 * - Supports mixed file types (images, PDFs, documents, etc.)
 * - Auto-detects file extensions from URLs
 * - Custom filenames support
 * - Loading states and debouncing
 * - Toast notifications for success/error states
 * - Lazy loading with ClientOnly wrapper
 * 
 * USAGE EXAMPLES:
 * 
 * // 1. Single file download (direct)
 * <DownloadFilesButton
 *   files="https://example.com/document.pdf"
 *   label="Download PDF"
 *   variant="solid"
 *   leading-icon="material-symbols:download-rounded"
 * />
 * 
 * // 2. Multiple images as ZIP
 * <DownloadFilesButton
 *   :files="vehicleImages"
 *   zip-name="vehicle-photos.zip"
 *   base-name="vehicle"
 *   label="Download Photos"
 *   variant="link-atv"
 *   leading-icon="material-symbols:download-rounded"
 * />
 * 
 * // 3. Mixed file types as ZIP
 * <DownloadFilesButton
 *   :files="[
 *     { url: 'doc.pdf' },
 *     { url: 'image.jpg' },
 *     { url: 'report.xlsx' }
 *   ]"
 *   zip-name="documents.zip"
 *   label="Download All Documents"
 * />
 * 
 * // 4. With custom filenames
 * <DownloadFilesButton
 *   :files="documents"
 *   :filenames="['Invoice', 'Receipt', 'Contract']"
 *   zip-name="my-documents.zip"
 *   label="Download Documents"
 * />
 * 
 * // 5. Lazy loaded (recommended for below-the-fold content)
 * <LazyDownloadFilesButton
 *   :files="vehicle.images"
 *   :zip-name="`${vehicle.title}.zip`"
 *   :base-name="vehicle.title"
 *   label="Download Photos"
 *   variant="link-atv"
 *   :ui="{ base: 'p-0' }"
 * />
 * 
 * PROPS:
 * @prop {FileWithUrl[] | string} files - Array of file objects or single URL string
 * @prop {string[]} filenames - Optional custom filenames (auto-adds extensions)
 * @prop {string} zipName - ZIP filename (default: "download.zip")
 * @prop {string} baseName - Base name for auto-generated filenames (default: "file")
 * @prop {boolean} showToast - Show toast notifications (default: true)
 * @prop {...ButtonProps} - All standard UButton props (variant, color, size, etc.)
 */
-->
<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import type { DownloadItem } from "~/types";

// Generic file type - accepts any object with a URL property
interface FileWithUrl {
  image_url?: string;
  url?: string;
  [key: string]: any;
}

interface Props extends /* @vue-ignore */ ButtonProps {
  // Can accept array of files or single file URL
  files?: FileWithUrl[] | string;
  // Optional custom filenames (ignored if files is a string)
  filenames?: string[];
  // Name for the ZIP file (when multiple files)
  zipName?: string;
  // Base name for files (used when auto-generating names)
  baseName?: string;
  // Show toast notifications
  showToast?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  files: undefined,
  filenames: undefined,
  zipName: "download.zip",
  baseName: "file",
  showToast: true,
});

const toast = useToast();
const isDownloading = ref(false);
const { download: downloadSingleFile } = useFileDownloader();

// Normalize files to array of DownloadItems
const normalizedFiles = computed((): DownloadItem[] => {
  if (!props.files) return [];

  // Handle string (single URL)
  if (typeof props.files === "string") {
    const urlParts = props.files.split("?")[0];
    const extension = urlParts.split(".").pop() || "";
    const filename =
      urlParts.split("/").pop() || `${props.baseName}.${extension}`;

    return [{ url: props.files, filename }];
  }

  // Handle array of file objects
  return props.files.map((file, index) => {
    const fileUrl = file.image_url || file.url || "";

    // Extract extension from URL
    const urlParts = fileUrl.split("?")[0];
    const extension = urlParts.split(".").pop() || "";

    // Use custom filename if provided, otherwise auto-generate
    let filename: string;
    if (props.filenames && props.filenames[index]) {
      filename = props.filenames[index];
      // Add extension if not present
      if (!filename.includes(".") && extension) {
        filename = `${filename}.${extension}`;
      }
    } else {
      // Auto-generate filename
      filename = `${props.baseName}-${index + 1}${extension ? `.${extension}` : ""}`;
    }

    return {
      url: fileUrl,
      filename,
    };
  });
});

const isSingleFile = computed(() => normalizedFiles.value.length === 1);
const hasFiles = computed(() => normalizedFiles.value.length > 0);

// Extract button props (exclude our custom props)
const { files, filenames, zipName, baseName, showToast, ...buttonProps } =
  props;

const handleDownload = async () => {
  if (!hasFiles.value) {
    if (showToast) {
      toast.add({
        title: "No files to download",
        color: "warning",
        orientation: "horizontal",
      });
    }
    return;
  }

  isDownloading.value = true;

  try {
    if (isSingleFile.value) {
      // Download single file directly
      await downloadSingleFile(normalizedFiles.value[0].url, showToast);
    } else {
      // Download multiple files as ZIP
      await downloadZip(
        normalizedFiles.value,
        zipName,
        showToast ? toast : undefined,
      );
    }
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
  } finally {
    isDownloading.value = false;
  }
};

const debouncedHandleDownload = useDebounce(handleDownload, 500);
</script>

<template>
  <ClientOnly>
    <UButton
      v-bind="buttonProps"
      :disabled="isDownloading || !hasFiles"
      @click="debouncedHandleDownload"
    />
    <template #fallback>
      <UButton v-bind="buttonProps" :disabled="true" />
    </template>
  </ClientOnly>
</template>
