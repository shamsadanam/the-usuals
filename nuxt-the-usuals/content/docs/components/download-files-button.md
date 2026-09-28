---
title: "DownloadFilesButton"
description: "Unified UI button for downloading single files or bundling multiple files as a ZIP archive."
---

# DownloadFilesButton

`DownloadFilesButton.vue` automatically detects whether to download a file directly (for single file URLs) or package multiple files into a ZIP archive via the server API endpoint `/api/download-zip`.

## Features

- **Direct Download**: Single files are fetched directly without ZIP compression overhead.
- **ZIP Bundling**: Multiple files are streamed into a ZIP file with custom or auto-generated filenames.
- **Toast Notifications**: Built-in success and error toast alerts using `@nuxt/ui` `useToast`.
- **Debounced Actions**: Prevents rapid double-click downloads.

## Usage Examples

### Single File Download

```vue
<DownloadFilesButton
  files="https://example.com/document.pdf"
  label="Download PDF"
  color="primary"
  variant="solid"
/>
```

### Batch Images Download as ZIP

```vue
<DownloadFilesButton
  :files="[
    { url: 'https://example.com/image1.jpg', filename: 'photo-1.jpg' },
    { url: 'https://example.com/image2.jpg', filename: 'photo-2.jpg' }
  ]"
  zip-name="gallery.zip"
  base-name="photo"
  label="Download All Photos (ZIP)"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `files` | `FileWithUrl[] \| string` | `undefined` | Single URL string or array of objects with file URLs. |
| `filenames` | `string[]` | `undefined` | Optional array of custom filenames. |
| `zipName` | `string` | `"download.zip"` | Output filename for generated ZIP archive. |
| `baseName` | `string` | `"file"` | Prefix for auto-generated file names inside ZIP. |
| `showToast` | `boolean` | `true` | Enables toast notifications for download events. |
