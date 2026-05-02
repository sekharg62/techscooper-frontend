import { isAxiosError } from 'axios'

import type { ProductCategory } from '../constants/productCategories'
import { authApiClient, publicApiClient } from './apiClients'

export interface CreateProductBody {
  name: string
  description: string
  actualPrice: number
  /** Omit or `null` when there is no sale price. */
  offerPrice?: number | null
  category: ProductCategory
}

export interface ProductJson {
  id: string
  name: string
  description: string
  actualPrice: string
  offerPrice: string | null
  category: ProductCategory
  createdAt: string
  updatedAt: string
}

export interface ProductPageResponse {
  products: ProductJson[]
  page: number
  limit: number
  skip: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/** Paginated catalog. Omit categories or pass none for all products. Uses repeated `category` query params. */
export async function fetchProductsPage(params: {
  page: number
  limit: number
  categories?: ProductCategory[]
}): Promise<ProductPageResponse> {
  const usp = new URLSearchParams()
  usp.set('page', String(params.page))
  usp.set('limit', String(params.limit))
  for (const c of params.categories ?? []) {
    usp.append('category', c)
  }
  const qs = usp.toString()
  const { data } = await publicApiClient.get<ProductPageResponse>(
    `/product/page?${qs}`,
  )
  return data
}

/** Unpaginated — `GET /api/product?category=A&category=B` or comma-separated in one param. */
export async function fetchProducts(params: {
  categories?: ProductCategory[]
}): Promise<{ products: ProductJson[] }> {
  const usp = new URLSearchParams()
  for (const c of params.categories ?? []) {
    usp.append('category', c)
  }
  const qs = usp.toString()
  const path = qs ? `/product?${qs}` : '/product'
  const { data } = await publicApiClient.get<{ products: ProductJson[] }>(path)
  return data
}

export function getProductErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined
    if (data?.error && typeof data.error === 'string') return data.error
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export async function createProduct(
  body: CreateProductBody,
): Promise<ProductJson> {
  const offerPrice =
    body.offerPrice == null || Number.isNaN(body.offerPrice)
      ? null
      : body.offerPrice

  const { data } = await authApiClient.post<ProductJson>('/product', {
    name: body.name.trim(),
    description: body.description.trim(),
    actualPrice: body.actualPrice,
    offerPrice,
    category: body.category,
  })
  return data
}
