import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import type { ProductCategory } from '../../constants'
import { trackCategorySearch, trackProductClick, fetchUserActivities } from '../../services/activityServices'
import {
  fetchProductsPage,
  getProductErrorMessage,
  type ProductJson,
  type ProductPageResponse,
} from '../../services/productServices'

import { DEFAULT_PAGE_SIZE } from './constants'

export function useProductList() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([])
  const [data, setData] = useState<ProductPageResponse | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<ProductJson[]>(
    [],
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const pendingCategorySearchRef = useRef<Set<ProductCategory>>(new Set())

  const categoriesKey = selectedCategories.slice().sort().join(',')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchProductsPage({
        page,
        limit,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
      })
      setData(res)

      if (user) {
        try {
          const act = await fetchUserActivities(user.id)
          const list = act.recommendedProducts ?? []
          setRecommendedProducts(list as ProductJson[])
        } catch {
          setRecommendedProducts([])
        }
      } else {
        setRecommendedProducts([])
      }

      if (
        user &&
        pendingCategorySearchRef.current.size > 0 &&
        selectedCategories.length > 0
      ) {
        const selectedSet = new Set(selectedCategories)
        const toTrack = [...pendingCategorySearchRef.current].filter((c) =>
          selectedSet.has(c),
        )
        for (const c of toTrack) {
          pendingCategorySearchRef.current.delete(c)
        }
        if (toTrack.length > 0) {
          void Promise.all(
            toTrack.map((category) =>
              trackCategorySearch(user.id, category),
            ),
          ).catch(() => undefined)
        }
      }
    } catch (err) {
      setData(null)
      setRecommendedProducts([])
      setError(getProductErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, limit, categoriesKey, selectedCategories, user])

  useEffect(() => {
    void load()
  }, [load])

  const toggleCategory = useCallback((c: ProductCategory) => {
    setSelectedCategories((prev) => {
      if (!prev.includes(c)) {
        pendingCategorySearchRef.current.add(c)
        return [...prev, c]
      }
      pendingCategorySearchRef.current.delete(c)
      return prev.filter((x) => x !== c)
    })
    setPage(1)
  }, [])

  const clearCategories = useCallback(() => {
    pendingCategorySearchRef.current.clear()
    setSelectedCategories([])
    setPage(1)
  }, [])

  const setLimitAndResetPage = useCallback((next: number) => {
    setLimit(next)
    setPage(1)
  }, [])

  const toggleProductExpanded = useCallback(
    (productId: string) => {
      setExpandedId((current) => {
        const willExpand = current !== productId
        if (willExpand && user) {
          void trackProductClick(user.id, productId).catch(() => undefined)
        }
        return willExpand ? productId : null
      })
    },
    [user],
  )

  return {
    user,
    page,
    setPage,
    limit,
    setLimitAndResetPage,
    selectedCategories,
    toggleCategory,
    clearCategories,
    data,
    loading,
    error,
    expandedId,
    toggleProductExpanded,
    recommendedProducts,
  }
}
