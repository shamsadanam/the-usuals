---
title: "Documentation Overview"
description: "Reusable components, composables, utilities, and patterns, grouped by stack."
---

# The Usuals Documentation

Welcome to **The Usuals** documentation! This project contains a collection of reusable components, composables, and server utilities I reuse across projects, grouped by stack.

## Nuxt

### Components
- **[PP (Pretty Print)](/nuxt/components/pp)**: Collapsible interactive JSON tree viewer component with syntax highlighting and copy buttons.
- **[DownloadFilesButton](/nuxt/components/download-files-button)**: Unified single file and ZIP batch downloader button component.

### Composables
- **[useApi](/nuxt/composables/use-api)**: Declarative SSR fetch wrapper with runtime proxy base URL selection and Bearer token support.
- **[useFormattedProperties](/nuxt/composables/use-formatted-properties)**: Object formatter composable for Start Case labels, date formatting, and null fallbacks.
- **[useFileDownloader](/nuxt/composables/use-file-downloader)**: Client-side single file download composable with reactive progress tracking and toast alerts.

### Plugins
- **[$api Plugin](/nuxt/plugins/api)**: Imperative pre-configured `$fetch` client plugin with Bearer auth injection, proxy base routing, and auto-logout on `401`.

### Utilities
- **[downloadZip & Download Utilities](/nuxt/utilities/download-zip)**: Client-side ZIP archive bundling, direct download function, and secure server-side download streaming utilities.

### Patterns
- **[Authentication & Login Flow](/nuxt/patterns/authentication-login)**: Comprehensive pattern guide for browser-egress authentication, `useUserSession()` encrypted cookies, `$api` Bearer token injection, and `logged-in` route middleware.

The working code for every Nuxt page lives in `examples/nuxt`. Run it with `pnpm dev:nuxt` from the repo root.
