# the-usuals

Docs and working code for the things I reuse across projects, served at docs.shamsad.com.

| Folder           | What it is                                   | Dev port | Deployed |
| ---------------- | -------------------------------------------- | -------- | -------- |
| `docs`           | Docs site (Nuxt 4 + Nuxt Content)            | 3002     | Vercel   |
| `examples/next`  | Next.js 16 + React 19 app with the examples  | 3000     | No       |
| `examples/nuxt`  | Nuxt 4 + Vue 3 app with the examples         | 3001     | No       |

Docs pages live in `docs/content/<stack>/`; the code they describe lives in `examples/<stack>/`.

## Adding a stack

1. Put a runnable project in `examples/<stack>/` with its own README and `.env.example`.
2. JS projects join the pnpm workspace automatically (`examples/*`); anything else uses its own tooling.
3. Add pages under `docs/content/<stack>/`.

## Setup

```bash
pnpm install
```

## Scripts

Run from the repo root:

| Script               | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `pnpm dev`           | Docs + both example apps in parallel           |
| `pnpm dev:docs`      | Docs site on port 3002                         |
| `pnpm dev:next`      | Next.js examples on port 3000                  |
| `pnpm dev:nuxt`      | Nuxt examples on port 3001                     |
| `pnpm build`         | Build every workspace package                  |
| `pnpm build:docs`    | Build the docs site                            |
| `pnpm build:next`    | Build the Next.js examples                     |
| `pnpm build:nuxt`    | Build the Nuxt examples                        |
| `pnpm start:next`    | Serve the Next.js production build on 3000     |
| `pnpm generate:docs` | Static-generate the docs site                  |
| `pnpm preview:docs`  | Preview the docs production build on 3002      |
| `pnpm preview:nuxt`  | Preview the Nuxt production build on 3001      |
| `pnpm lint:next`     | ESLint the Next.js examples                    |
| `pnpm clean`         | Remove all `node_modules` and build outputs    |

Anything not proxied here can be run per package:

```bash
pnpm --filter <docs|example-next|example-nuxt> run <script>
```

## Deploying

One Vercel project, Root Directory `docs`, domain `docs.shamsad.com`.
The example apps are not deployed; give one its own Vercel project only when it needs a live demo.

## History

Both example apps were merged in with `git subtree`, so their original commit
history is preserved in this repository's log.
