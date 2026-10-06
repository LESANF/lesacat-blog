![blogmain](https://github.com/user-attachments/assets/51235ba3-6540-42ea-85c1-c3245b9e096c)

## Development

Use Node.js 24 LTS (`nvm use`) and pnpm 12.9.1. `pnpm-lock.yaml` is the project lockfile.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Health checks

```sh
pnpm run doctor    # Next environment, ESLint, generated route types, TypeScript, dependency audit
pnpm doctor:react  # Additional local React diagnostics; downloads pinned CLI on first run
pnpm outdated     # Check available dependency updates
pnpm build        # Production build including native sitemap/robots routes
pnpm start        # Serve the production build
pnpm analyze      # Webpack bundle report
```

Run the HTTP regression checks against a production server:

```sh
pnpm build
pnpm start --port 3100
# In another terminal (defaults to http://localhost:3100):
pnpm validate
```

React Doctor runs without score uploads or Socket.dev requests. Use `pnpm run doctor` explicitly: pnpm 12 also has its own built-in `doctor` command. The project script checks dependency advisories with `pnpm audit`. Neither command replaces a production build and browser checks.

After adding or replacing GIFs under `public/images`, run `pnpm media:optimize` and commit the smaller animated WebP siblings with the originals. Article rendering selects these WebPs automatically; conversions that grow or change timing/dimensions are rejected. The first article image is preloaded and the rest load lazily with reserved dimensions. The body font is served locally with `font-display: swap`.

The app uses Next.js 16, React 19 and Tailwind CSS 4. ESLint stays on 9 until Next's React/import/accessibility plugins support 10; TypeScript stays on 6.0 until typescript-eslint supports 7. ESLint 9 is upstream end-of-life, so check the plugin peer ranges before its next upgrade.

As of 2026-10-06, `pnpm audit` reports an advisory with no published fix: [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) in Next's ESLint tooling. It remains visible, so `pnpm run doctor` exits nonzero at the audit step. The tool uses local project glob patterns; reassess this dependency before accepting untrusted patterns.

Unknown article slugs return a working HTTP 404 page. Next currently also prints `Internal: NoFallbackError` for this `dynamicParams = false` path; this is a [tracked upstream logging bug](https://github.com/vercel/next.js/issues/90537), not a failed response.

Article code fences use the shared `CodeBlock` renderer with Expressive Code and `gruvbox-dark-soft`. Theme, font size and spacing live in `src/components/ui/CodeBlock.tsx`; `CodeBlockAssets` loads its CSS and copy-button scripts once per article. Existing Markdown language fences are supported without rewriting posts.

Expressive Code's CSS dependency is pinned to `postcss-nested` 7.0.2 so it resolves a patched selector parser ([GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)). Remove the scoped override when Expressive Code updates its own dependency range. Production build and browser rendering are checked against this override.
