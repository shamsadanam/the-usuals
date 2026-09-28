---
title: "useApi"
description: "Nuxt 4 createUseFetch wrapper providing declarative SSR-friendly data fetching."
---

# useApi

`useApi` is a Nuxt 4 `createUseFetch` composable factory designed for SSR-friendly data fetching. It configures default API base routes, attaches session Bearer tokens, and handles auto-logout on unauthenticated `401` errors.

## Features

- **Setup Context Safe**: Defined using function syntax to prevent import-time context errors.
- **Proxy Support**: Auto-routes to `/api/proxy` when `NUXT_PUBLIC_ENABLE_PROXY` is set.
- **Bearer Token Auth**: Opt-in token injection by passing `{ auth: true }`.
- **401 Auto Logout**: Automatically clears cookie session and navigates to `/login` on auth failure.

## Usage Example

```ts
// Fetch user profile with authorization header
const { data: user, status, refresh } = await useApi("/user/profile", {
  auth: true
})

// Query parameters example
const { data: products } = await useApi("/products", {
  query: { category: "electronics" }
})
```
