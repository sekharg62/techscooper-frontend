# TechScopper Frontend

React + TypeScript + Vite app for TechScopper. In development, `/api` is proxied to the backend (`vite.config.ts`).

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (includes npm)

## Getting started

From this folder:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (usually `http://localhost:5173`).

3. Ensure the backend is running locally if you use API routes (default proxy targets `http://localhost:3001`).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm install`     | Install project dependencies          |
| `npm run dev`     | Dev server with HMR                   |
| `npm run build`   | Type-check and production build to `dist` |
| `npm run preview` | Serve the `dist` build locally        |
| `npm run lint`    | Run ESLint                            |

## Environment

Optional `.env` in this directory:

- `VITE_API_BASE_URL` — API base URL for production or when not using the dev proxy. If unset, requests use `/api` (matching the dev proxy).

## Deploy (Vercel)

This repo includes `vercel.json` so client-side routes resolve to `index.html` after build. Connect the repo in Vercel; it should detect Vite and use `npm run build` with output `dist`. Set `VITE_API_BASE_URL` in the Vercel project environment if your API is on another origin.
