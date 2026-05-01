/** Keys used with `localStorage` / `sessionStorage` so they stay consistent app-wide. */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'access_token',
  USER_DATA: 'user_data',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
