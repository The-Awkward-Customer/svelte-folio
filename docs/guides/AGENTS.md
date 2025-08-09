# Repository Guidelines

## Project Structure & Module Organization
- Frontend app: `frontend/` (SvelteKit). Source lives in `frontend/src`.
- Pages/routes: `frontend/src/routes` (e.g., `+page.svelte`, `+layout.svelte`, `api/`).
- Reusable code: `frontend/src/lib` (`components/`, `stores/`, `utils/`, `server/`, `types/`, `assets/`, `animations/`).
- Static assets: `frontend/static`.
- Tests: unit alongside source (e.g., `src/foo.spec.ts`); e2e in `frontend/e2e` (Playwright).
- Docs/scripts: `frontend/docs`, `frontend/src/scripts`, root `scripts/` (e.g., `scripts/generate-tokens.js`).
- Backend: `backend/` (placeholder, docs only for now).

## Build, Test, and Development Commands
Run all commands from `frontend/`.
- Dev: `npm run dev` — start SvelteKit dev server.
- Build: `npm run build` — production build. Preview with `npm run preview`.
- Type check: `npm run check` — sync and run Svelte/TS checks.
- Lint/format: `npm run lint` and `npm run format`.
- Unit tests: `npm run test:unit` (Vitest). E2E: `npm run test:e2e` (Playwright). Both: `npm test`.
- Tokens: `npm run tokens` and `npm run build:tokens` (Style Dictionary).
- Data/DB: `npm run ingest`; `npm run db:start|db:push|db:migrate|db:studio` (Drizzle, requires Docker/Postgres).

## Coding Style & Naming Conventions
- Languages: TypeScript + Svelte. Indentation: 2 spaces.
- Formatters/linters: Prettier + ESLint (Svelte configs). Ensure clean `npm run lint` before PRs.
- Routing: SvelteKit file conventions (`+page.svelte`, `+layout.svelte`, `+page.server.ts`).
- Naming: components in `src/lib/components` use PascalCase (e.g., `Avatar.svelte`); routes use kebab-case directories (e.g., `about/`).
- Organization: put shared logic in `src/lib/{utils,stores,server,types}`; avoid deep nesting.

## Testing Guidelines
- Unit: Vitest. Place specs next to code (`*.spec.ts`), keep tests small and deterministic.
- E2E: Playwright in `frontend/e2e`. Prefer data-test selectors for stability.
- Pre-submit: run `npm run lint && npm test` locally; fix regressions before opening a PR.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`). Scope optional (e.g., `feat(avatar): ...`).
- PRs: include a clear description, linked issues, and screenshots/GIFs for UI changes. Note testing impact and steps to verify.
- Keep PRs focused and update relevant docs (`README.md`, `frontend/docs`) when behavior or APIs change.

## Security & Configuration Tips
- Secrets live in `frontend/.env` (do not commit). Use Vercel environment variables in production.
- Database commands require Docker running locally; confirm Postgres connectivity before `db:*` scripts.
