import { HiOutlineSparkles } from 'react-icons/hi2'

import type { ProductJson } from '../../services/productServices'

import { ProductListGrid } from './ProductListGrid'

export function ProductListRecommendedSection({
  products,
  expandedId,
  onToggleProduct,
}: {
  products: ProductJson[]
  expandedId: string | null
  onToggleProduct: (productId: string) => void
}) {
  if (products.length === 0) return null

  return (
    <section className="mb-10 border-b border-slate-200 pb-10">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <HiOutlineSparkles className="size-6 shrink-0 text-amber-500" aria-hidden />
        Recommended for you
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        Based on your browsing activity.
      </p>
      <ProductListGrid
        products={products}
        expandedId={expandedId}
        onToggleProduct={onToggleProduct}
      />
    </section>
  )
}
