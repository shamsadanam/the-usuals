---
title: "Documentation Overview"
description: "Catalog of reusable Vue 3 & Nuxt 4 components, composables, and utility functions."
---

# The Usuals Documentation

Welcome to **The Usuals** documentation! This project contains a collection of reusable components, composables, and server utilities designed for Nuxt 4 web applications.

## Available Tools & Patterns

### Components
- **[PP (Pretty Print)](/docs/components/pp)**: Collapsible interactive JSON tree viewer component with syntax highlighting and copy buttons.
- **[DownloadFilesButton](/docs/components/download-files-button)**: Unified single file and ZIP batch downloader button component.

### Composables & Utilities
- **[useApi](/docs/composables/use-api)**: Declarative SSR fetch wrapper with runtime proxy base URL selection and Bearer token support.
- **[useFormattedProperties](/docs/composables/use-formatted-properties)**: Object formatter composable for Start Case labels, date formatting, and null fallbacks.
- **[useFileDownloader & downloadZip](/docs/composables/use-file-downloader)**: Client-side single file downloader and ZIP archive bundling utilities.

### Patterns & Demos
- **[Authentication & Login Flow](/docs/patterns/authentication-login)**: Comprehensive pattern guide for browser-egress authentication, `useUserSession()` encrypted cookies, `$api` Bearer token injection, and `logged-in` route middleware.
- **[Sample Login Demo](/login)**: Interactive login page demonstration.
- **[Sample Dashboard Demo](/dashboard)**: Interactive guarded area session demo.

