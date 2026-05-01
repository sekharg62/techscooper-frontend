/**
 * Base URL for API requests.
 * Set `VITE_API_BASE_URL` in `.env` for production or a non-proxied backend.
 * Default `/api` matches the dev proxy in `vite.config.ts`.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || '/api'
