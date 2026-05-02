import { publicApiClient } from './apiClients'

export type ActivityType = 'category_search' | 'product_click'

export interface TrackCategorySearchBody {
  userId: string
  type: 'category_search'
  category: string
}

export interface TrackProductClickBody {
  userId: string
  type: 'product_click'
  productId: string
}

/** POST /api/activity — category is sent/stored as uppercase (ProductCategory shape). */
export async function trackCategorySearch(
  userId: string,
  category: string,
): Promise<void> {
  await publicApiClient.post('/activity', {
    userId,
    type: 'category_search',
    category: category.trim(),
  } satisfies TrackCategorySearchBody)
}

export async function trackProductClick(
  userId: string,
  productId: string,
): Promise<void> {
  await publicApiClient.post('/activity', {
    userId,
    type: 'product_click',
    productId: productId.trim(),
  } satisfies TrackProductClickBody)
}

export interface UserActivitiesRowCategory {
  category: string
  count: number
  lastUsedAt: string
}

export interface UserActivitiesRowProduct {
  productId: string
  count: number
  lastClickedAt: string
}

/** Matches backend `productToJson` rows. */
export interface ProductRecommendationRow {
  id: string
  name: string
  description: string
  actualPrice: string
  offerPrice: string | null
  category: string
  createdAt: string
  updatedAt: string
}

/** GET /api/activity/get-activities/:userId — merged products only (`userId` path param identifies user). */
export interface UserActivitiesResponse {
  recommendedProducts: ProductRecommendationRow[]
}

export async function fetchUserActivities(
  userId: string,
): Promise<UserActivitiesResponse> {
  const encoded = encodeURIComponent(userId.trim())
  const { data } = await publicApiClient.get<UserActivitiesResponse>(
    `/activity/get-activities/${encoded}`,
  )
  return data
}
