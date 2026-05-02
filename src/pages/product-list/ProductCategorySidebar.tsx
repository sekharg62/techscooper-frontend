import {
  HiOutlineFunnel,
  HiOutlineListBullet,
  HiOutlineXMark,
} from 'react-icons/hi2'

import { PRODUCT_CATEGORIES, type ProductCategory } from '../../constants'

import { PAGE_SIZE_OPTIONS } from './constants'

const chipInactive =
  'rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50'
const chipActive =
  'rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm'

export function ProductCategorySidebar({
  selectedCategories,
  limit,
  onToggleCategory,
  onClearCategories,
  onLimitChange,
}: {
  selectedCategories: ProductCategory[]
  limit: number
  onToggleCategory: (c: ProductCategory) => void
  onClearCategories: () => void
  onLimitChange: (n: number) => void
}) {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-72 lg:max-w-[min(18rem,100%)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <HiOutlineFunnel className="size-4 shrink-0 text-indigo-600" aria-hidden />
            Categories
          </p>
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={onClearCategories}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              <HiOutlineXMark className="size-3.5" aria-hidden />
              Clear
            </button>
          )}
        </div>
        <div className="flex max-h-[min(22rem,calc(100vh-12rem))] flex-wrap gap-2 overflow-y-auto overscroll-contain pr-0.5">
          <button
            type="button"
            onClick={onClearCategories}
            className={
              selectedCategories.length === 0 ? chipActive : chipInactive
            }
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((c) => {
            const active = selectedCategories.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => onToggleCategory(c)}
                className={active ? chipActive : chipInactive}
              >
                {c.replaceAll('_', ' ')}
              </button>
            )
          })}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <HiOutlineListBullet className="size-3.5 text-indigo-600" aria-hidden />
              Per page
            </span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
    </aside>
  )
}
