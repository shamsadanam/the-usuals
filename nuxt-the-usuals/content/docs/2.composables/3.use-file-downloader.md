---
title: "useFileDownloader & downloadZip"
description: "Client-side single file download composable and batch ZIP archive utility."
---

# useFileDownloader & downloadZip

Client-side utilities for downloading files directly or bundling multiple files into a compressed ZIP archive using server API proxies (`/api/download` and `/api/download-zip`).

## Features

- **CORS Bypass**: Proxies remote files through the Nuxt server to prevent cross-origin download restrictions.
- **Filename Resolution**: Automatically extracts filenames from explicit arguments, RFC 6266 `Content-Disposition` headers, or decoded URL paths.
- **Domain Whitelisting**: Secures server endpoints via `runtimeConfig.allowedDomains`.
- **Batch ZIP Bundling**: Downloads multiple files into a single ZIP archive client-side.

## Single File Downloader (`useFileDownloader`)

Composable for downloading single files with built-in toast notifications and filename override support.

```vue
<script setup lang="ts">
const { download, isDownloading } = useFileDownloader()

// Download with default filename from server headers or URL
async function handleDownload() {
  await download("https://example.com/file.pdf")
}

// Download with explicit custom filename
async function handleDownloadCustomName() {
  await download(
    "https://example.com/document.pdf",
    true, // showToast
    "custom-report.pdf" // explicit filename
  )
}
</script>

<template>
  <button :disabled="isDownloading" @click="handleDownload">
    {{ isDownloading ? "Downloading..." : "Download PDF" }}
  </button>
</template>
```

### Parameters (`download`)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `fileUrl` | `string \| undefined \| null` | Required | Public file URL to download. |
| `showToast` | `boolean` | `true` | Show warning/error toast on failure or missing URL. |
| `filename` | `string \| null` | `undefined` | Optional filename override for the downloaded file. |

### Filename Resolution Order

1. Explicit `filename` argument passed to `download()`.
2. `Content-Disposition` header returned by the server endpoint (RFC 6266 `filename*` or `filename`).
3. Decoded basename extracted from `fileUrl`.

---

## Standalone Single File Downloader (`download`)

A direct utility function when a reactive composable is not required:

```ts
import { download } from "~/utils/download"

const toast = useToast()

await download("https://example.com/file.pdf", toast)
```

---

## Batch ZIP Downloader (`downloadZip`)

Bundles multiple remote files into a `.zip` archive:

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

---

## Server Requirements & Configuration

The client utilities depend on the `/api/download` and `/api/download-zip` server endpoints. Ensure domain security is configured in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    allowedDomains: process.env.NUXT_ALLOWED_DOMAINS || "example.com, 194.233.76.204"
  }
})
```
