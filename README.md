# the-usuals

A pnpm-workspace mono-repo holding the two "usuals" starter projects.

| Folder                | Stack                | Dev port |
| --------------------- | -------------------- | -------- |
| `next.js-the-usuals`  | Next.js 16 + React 19 | 3000     |
| `nuxt-the-usuals`     | Nuxt 4 + Vue 3        | 3001     |

## Setup

```bash
pnpm install
```

One install at the root covers both projects.

## Scripts

Run from the repo root:

| Script                   | What it does                                  |
| ------------------------ | --------------------------------------------- |
| `pnpm dev`               | Both dev servers in parallel (3000 + 3001)    |
| `pnpm dev:next`          | Next.js dev server on port 3000               |
| `pnpm dev:nuxt`          | Nuxt dev server on port 3001                  |
| `pnpm build`             | Build both projects                           |
| `pnpm build:next`        | Build the Next.js app                         |
| `pnpm build:nuxt`        | Build the Nuxt app                            |
| `pnpm start:next`        | Serve the Next.js production build on 3000    |
| `pnpm preview:nuxt`      | Preview the Nuxt production build on 3001     |
| `pnpm generate:nuxt`     | Static-generate the Nuxt app                  |
| `pnpm lint:next`         | ESLint the Next.js app                        |
| `pnpm clean`             | Remove all `node_modules` and build outputs   |

Anything not proxied here can be run per project:

```bash
pnpm --filter nuxt-the-usuals run <script>
```

## History

Both projects were merged in with `git subtree`, so their original commit
history is preserved in this repository's log.
