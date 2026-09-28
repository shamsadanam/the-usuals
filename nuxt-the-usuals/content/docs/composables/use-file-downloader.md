---
title: "useFileDownloader & downloadZip"
description: "Client-side single file download composable and batch ZIP archive utility."
---

# useFileDownloader & downloadZip

Client-side utilities for downloading files directly or bundling multiple files into a compressed ZIP archive using server API proxies (`/api/download` and `/api/download-zip`).

## Single File Downloader (`useFileDownloader`)

```vue
<script setup lang="ts">
const { download, isDownloading } = useFileDownloader()
</script>

<template>
  <button :disabled="isDownloading" @click="download('https://example.com/file.pdf')">
    {{ isDownloading ? "Downloading..." : "Download PDF" }}
  </button>
</template>
```

## Batch ZIP Downloader (`downloadZip`)

```ts
import { downloadZip } from "~/utils/downloadZip"

const toast = useToast()

await downloadZip(
  [
    { url: "https://example.com/img1.jpg", filename: "photo-1.jpg" },
    { url: "https://example.com/img2.jpg", filename: "photo-2.jpg" }
  ],
  "photos.zip",
  toast
)
```
