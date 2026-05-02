import { ProductCardSkeleton } from './ProductCardSkeleton'

export function ProductListSkeletonGrid({ count }: { count: number }) {
  return (
    <div role="status" aria-label="Loading products">
      <div className="mb-4 h-4 w-56 max-w-full animate-pulse rounded bg-slate-200" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="min-w-0">
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
