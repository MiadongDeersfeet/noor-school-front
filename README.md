# NoorSchool Frontend

## Environment setup
1. Copy env template:
   - `cp .env.example .env`
2. Fill required values in `.env`.

`.env` is git-ignored and must not be committed.

## Required env vars
- `VITE_API_BASE_URL`
  - Usually `/api`
- `VITE_BACKEND_BASE_URL`
  - Production origin (example: `https://yunki.store`)
- `VITE_GOOGLE_CLIENT_ID`
  - Google Web Client ID
- `VITE_GOOGLE_ID_TOKEN`
  - Optional test value, keep empty in normal usage

## Local run
- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build`

## Deploy notes
- `VITE_*` values are injected at build time.
- After changing `VITE_*`, rebuild/redeploy frontend.
- In GitHub Actions deploy workflow, ensure build `env` includes:
  - `VITE_API_BASE_URL`
  - `VITE_BACKEND_BASE_URL`
