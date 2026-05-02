import type { ProductJson } from '../../services/productServices'

import { ProductExploreCard } from './ProductExploreCard'

export function ProductListGrid({
  products,
  expandedId,
  onToggleProduct,
}: {
  products: ProductJson[]
  expandedId: string | null
  onToggleProduct: (productId: string) => void
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <li key={p.id} className="min-w-0">
          <ProductExploreCard
            product={p}
            expanded={expandedId === p.id}
            onToggle={() => onToggleProduct(p.id)}
          />
        </li>
      ))}
    </ul>
  )
}
