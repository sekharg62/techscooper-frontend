import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2'

import { resolveProductCategoryIcon } from '../../constants/productCategoryIcons'
import type { ProductJson } from '../../services/productServices'

import { formatMoney } from './formatMoney'

export function ProductExploreCard({
  product,
  expanded,
  onToggle,
}: {
  product: ProductJson
  expanded: boolean
  onToggle: () => void
}) {
  const CategoryIcon = resolveProductCategoryIcon(product.category)
  const categoryLabel = product.category.replaceAll('_', ' ')

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-2 p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex flex-col gap-2">
          <span
            className="inline-flex w-fit items-center rounded-full bg-slate-100 px-2 py-0.5 text-slate-700"
            title={categoryLabel}
          >
            <CategoryIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="sr-only">{categoryLabel}</span>
          </span>
          <h2 className="text-base font-semibold leading-snug text-slate-900">
            {product.name}
          </h2>
        </div>
        {!expanded && (
          <p className="line-clamp-3 text-sm text-slate-600">
            {product.description}
          </p>
        )}
        <p className="inline-flex items-center gap-1 text-xs text-slate-500">
          {expanded ? (
            <>
              <HiOutlineChevronUp className="size-3.5 shrink-0" aria-hidden />
              Tap to collapse
            </>
          ) : (
            <>
              <HiOutlineChevronDown className="size-3.5 shrink-0" aria-hidden />
              Tap for details
            </>
          )}
        </p>
      </button>
      {expanded && (
        <div className="flex flex-1 flex-col space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 text-sm">
          <p className="whitespace-pre-wrap text-slate-700">
            {product.description}
          </p>
          <dl className="grid grid-cols-1 gap-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Actual price
              </dt>
              <dd className="font-mono text-slate-900">
                {formatMoney(product.actualPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Offer price
              </dt>
              <dd className="font-mono text-slate-900">
                {product.offerPrice != null
                  ? formatMoney(product.offerPrice)
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Product ID
              </dt>
              <dd className="font-mono text-slate-900">{product.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Updated
              </dt>
              <dd className="text-slate-700">
                {new Date(product.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </article>
  )
}
