import { HiOutlineRectangleStack } from 'react-icons/hi2'

import { ProductCategorySidebar } from './ProductCategorySidebar'
import { ProductListGrid } from './ProductListGrid'
import { ProductListHeader } from './ProductListHeader'
import { ProductListPagination } from './ProductListPagination'
import { ProductListRecommendedSection } from './ProductListRecommendedSection'
import { ProductListSkeletonGrid } from './ProductListSkeletonGrid'
import { ProductListSummary } from './ProductListSummary'
import { useProductList } from './useProductList'

export function ProductListPage() {
  const {
    user,
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
  } = useProductList()

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProductListHeader user={user} />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <ProductCategorySidebar
            selectedCategories={selectedCategories}
            limit={limit}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            onLimitChange={setLimitAndResetPage}
          />

          <main className="min-w-0 flex-1">
            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            {loading && <ProductListSkeletonGrid count={limit} />}

            {!loading &&
              user &&
              recommendedProducts.length > 0 && (
                <ProductListRecommendedSection
                  products={recommendedProducts}
                  expandedId={expandedId}
                  onToggleProduct={toggleProductExpanded}
                />
              )}

            {!loading && user && recommendedProducts.length > 0 && data && (
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <HiOutlineRectangleStack
                  className="size-6 shrink-0 text-indigo-600"
                  aria-hidden
                />
                All products
              </h2>
            )}

            {data && !loading && <ProductListSummary data={data} />}

            {!loading && data && data.products.length === 0 && (
              <p className="py-16 text-center text-slate-600">
                No products match this filter.
              </p>
            )}

            {!loading && data && data.products.length > 0 && (
              <ProductListGrid
                products={data.products}
                expandedId={expandedId}
                onToggleProduct={toggleProductExpanded}
              />
            )}

            {!loading && data && data.totalPages > 0 && (
              <ProductListPagination
                data={data}
                onGoFirst={() => setPage(1)}
                onGoPrev={() => setPage((p) => Math.max(1, p - 1))}
                onGoNext={() =>
                  setPage((p) =>
                    data.totalPages
                      ? Math.min(data.totalPages, p + 1)
                      : p + 1,
                  )
                }
                onGoLast={() => setPage(data.totalPages)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
