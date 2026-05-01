import axios, { type AxiosInstance } from 'axios'
import { API_BASE_URL } from './apiBaseUrl'
import { STORAGE_KEYS } from '../constants'

export type TokenGetter = () => string | null | undefined

/** Default reads auth token from localStorage; override via `setAuthTokenGetter`. */
let authTokenGetter: TokenGetter = () =>
  localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

export function setAuthTokenGetter(getter: TokenGetter) {
  authTokenGetter = getter
}

function createBaseClient(): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Accept: 'application/json',
    },
  })
}

/** Unauthenticated requests (login, signup, public data). No Authorization header. */
export const publicApiClient = createBaseClient()

/** Authenticated requests. Sends `Authorization: Bearer <token>` when a token is returned by the getter. */
export const authApiClient = createBaseClient()

authApiClient.interceptors.request.use((config) => {
  const token = authTokenGetter()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
