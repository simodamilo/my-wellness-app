# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (with `--host` for LAN access)
- `npm run build` — `tsc -b` then `vite build`; also copies `dist/index.html` to `dist/404.html` for GitHub Pages SPA fallback
- `npm run lint` — ESLint over the repo
- `npm run preview` — preview the production build
- `npm run deploy` — publishes `dist/` to `gh-pages` (runs `predeploy` → `build` first)

No test runner is configured.

## Architecture

React 19 + TypeScript + Vite PWA, deployed to GitHub Pages under the base path `/my-wellness-app/` (see `vite.config.ts`). The base path is baked into the router (`src/utils/routing/router.tsx`) — all routes are nested under `/my-wellness-app`.

**Auth & data layer.** Supabase (`@supabase/supabase-js`) is the backend. `src/store/supabaseClient.ts` is the shared client; `src/utils/auth/AuthProvider.tsx` exposes the current user via `useAuth()`, and `src/utils/auth/ProtectedPage.tsx` gates protected routes. Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env` / `.env.local`).

**State.** Redux Toolkit store in `src/store/`. Each domain slice (`habits/`, `inputs/`) follows the same four-file convention: `*.action.ts` (thunks calling Supabase), `*.reducer.ts`, `*.selector.ts`, `*.mapper.ts` (DB-row ↔ domain-model shape conversion), plus `types.ts`. Combined in `reducer.config.ts`; store configured in `store.config.ts` which also exports `useAppDispatch`. `global.action.ts` holds cross-slice thunks. The `inputs` slice holds the user's daily wellness entries (mood, sleep, nutrition, notes, body feeling, period info); `habits` holds habit definitions and completions.

**UI.** Ant Design 5 (with `@ant-design/v5-patch-for-react-19` for React 19 compatibility) + Tailwind CSS 4 (via `@tailwindcss/vite`). Theme colors use CSS vars like `var(--secondary-color)` defined in `src/styles/` + `src/index.css`. Charts use `recharts`; drag-and-drop uses `@dnd-kit`; animations use `framer-motion`.

**Routing.** Single `createBrowserRouter` in `router.tsx`. `App.tsx` is the layout shell (renders `NavBar` when authed + `<Outlet />`). Protected pages wrap their element with `<ProtectedPage />`.

**Feature layout.** Each page in `src/pages/` (homepage, insights, settings, login, signup, forgotPassword, resetPasswordForm) composes feature components from `src/components/` (one folder per domain: `mood`, `sleep`, `nutrition`, `habits`, `habitsCatalog`, `notes`, `bodyFeeling`, `periodInfo`, plus shared `cardContainer`, `navigationBar`, `notificationProvider`). The `insights` page consumes `src/utils/correlation/` for computing relationships between inputs.

**i18n.** `react-i18next` with `en.json` / `es.json` in `src/utils/i18n/`.

**PWA.** `vite-plugin-pwa` with `autoUpdate` + `navigateFallback: /my-wellness-app/index.html`. `index.html` includes a splash screen that `App.tsx` fades out on mount.
