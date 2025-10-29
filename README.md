# FoodieHub

A React + Express demo of a Swiggy-like food listing app with:

- New Swiggy API parsing (list + menu) with resilient extractors
- Backend proxy with caching to avoid CORS and rate limits
- MongoDB persistence for Favorites and Recently Viewed (anonymous via deviceId)
- Tailwind-polished UI and professional skeletons

## Quick start (local)

Prereqs: Node 18+, MongoDB connection string.

1. Backend

- cd backend
- Copy `.env.example` to `.env` and set `MONGODB_URI`, optionally `ALLOWED_ORIGIN`, `CACHE_TTL`, `PORT`.
- Run: `npm install` then `npm run dev`
- Health check: GET http://localhost:8080/health -> `{ ok: true }`

2. Frontend

- In project root: `npm install`
- Start: `npm start` (Parcel)
- By default, frontend calls Swiggy directly (with dev CORS proxies). To use your backend, set an env var at build time:
  - Windows PowerShell: `$env:API_BASE_URL="http://localhost:8080"; npm start`

## Build for production

- Set the API base URL so the frontend calls your backend:
  - Windows PowerShell: `$env:API_BASE_URL="https://YOUR-BACKEND.onrender.com"; npm run build`
- Deploy the contents of `dist/` as a static site.

## Deploy to Render

Backend (Web Service):

- Root: `backend/`
- Build command: `npm install`
- Start command: `npm start`
- Environment
  - `PORT=8080` (Render sets this automatically)
  - `MONGODB_URI=<your mongodb uri>`
  - `ALLOWED_ORIGIN=https://YOUR-FRONTEND.onrender.com` (later)
  - Optional: `CACHE_TTL=300`

Frontend (Static Site):

- Root: project root
- Build command (set API for build):
  - Windows PowerShell: `$env:API_BASE_URL="https://YOUR-BACKEND.onrender.com"; npm run build`
- Publish directory: `dist/`

## Configuration

- `src/config.js`
  - `LATITUDE`/`LONGITUDE`: default coordinates for list results
  - `API_BASE_URL`: inlined at build-time from environment

## Notes

- Anonymous deviceId is persisted in localStorage to tie favorites/recently viewed
- Server uses in-memory cache; for multi-instance production, prefer Redis
- UI includes debounced search, empty states, and modern skeletons

## Screenshots

Add a few once deployed for your portfolio.
