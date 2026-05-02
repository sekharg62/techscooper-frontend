import { isAxiosError } from 'axios'

import { publicApiClient } from './apiClients'

export type UserRole = 'ADMIN' | 'USER'

export interface AuthCredentials {
  name: string
  email: string
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export function getAuthErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined
    if (data?.error && typeof data.error === 'string') return data.error
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export async function register(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  const { data } = await publicApiClient.post<AuthResponse>(
    '/auth/register',
    credentials,
  )
  return data
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  const { data } = await publicApiClient.post<AuthResponse>(
    '/auth/login',
    credentials,
  )
  return data
}
