<!-- See docs/content/nuxt/1.components/2.download-files-button.md -->
<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import type { DownloadItem } from "~/types";

interface FileWithUrl {
  image_url?: string;
  url?: string;
  [key: string]: any;
}

interface Props extends /* @vue-ignore */ ButtonProps {
  files?: FileWithUrl[] | string;
  filenames?: string[];
  zipName?: string;
  baseName?: string;
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

const normalizedFiles = computed((): DownloadItem[] => {
  if (!props.files) return [];

  if (typeof props.files === "string") {
    const urlParts = props.files.split("?")[0];
    const extension = urlParts.split(".").pop() || "";
    const filename =
      urlParts.split("/").pop() || `${props.baseName}.${extension}`;

    return [{ url: props.files, filename }];
  }

  return props.files.map((file, index) => {
    const fileUrl = file.image_url || file.url || "";

    const urlParts = fileUrl.split("?")[0];
    const extension = urlParts.split(".").pop() || "";

    let filename: string;
    if (props.filenames && props.filenames[index]) {
      filename = props.filenames[index];
      if (!filename.includes(".") && extension) {
        filename = `${filename}.${extension}`;
      }
    } else {
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
      await downloadSingleFile(normalizedFiles.value[0].url, showToast);
    } else {
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
