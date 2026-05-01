import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { PRODUCT_CATEGORIES, type ProductCategory } from '../constants'
import {
  fetchProductsPage,
  getProductErrorMessage,
  type ProductJson,
  type ProductPageResponse,
} from '../services/productServices'

const DEFAULT_LIMIT = 10

function formatMoney(value: string): string {
  const n = Number.parseFloat(value)
  if (!Number.isFinite(n)) return value
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function ProductCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
      aria-hidden
    >
      <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mb-3 h-5 w-4/5 max-w-[14rem] animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="mb-2 h-3 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
    </article>
  )
}

function ProductExploreCard({
  product,
  expanded,
  onToggle,
}: {
  product: ProductJson
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-2 p-4 text-left transition"
      >
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {product.category.replaceAll('_', ' ')}
          </span>
          <h2 className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
            {product.name}
          </h2>
        </div>
        {!expanded && (
          <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
            {product.description}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {expanded ? 'Tap to collapse' : 'Tap for details'}
        </p>
      </button>
      {expanded && (
        <div className="flex flex-1 flex-col space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 text-sm dark:border-slate-700">
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {product.description}
          </p>
          <dl className="grid grid-cols-1 gap-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Actual price
              </dt>
              <dd className="font-mono text-slate-900 dark:text-white">
                {formatMoney(product.actualPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Offer price
              </dt>
              <dd className="font-mono text-slate-900 dark:text-white">
                {product.offerPrice != null
                  ? formatMoney(product.offerPrice)
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Product ID
              </dt>
              <dd className="font-mono text-slate-900 dark:text-white">
                {product.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Updated
              </dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {new Date(product.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </article>
  )
}

export function ProductListPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([])
  const [data, setData] = useState<ProductPageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
console.log("user", user)
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
    } catch (err) {
      setData(null)
      setError(getProductErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, limit, categoriesKey])

  useEffect(() => {
    void load()
  }, [load])

  function toggleCategory(c: ProductCategory) {
    setSelectedCategories((prev) => {
      const next = prev.includes(c)
        ? prev.filter((x) => x !== c)
        : [...prev, c]
      return next
    })
    setPage(1)
  }

  function clearCategories() {
    setSelectedCategories([])
    setPage(1)
  }

  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              TechScopper
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Product catalog
            </h1>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end sm:text-right">
            {user && (
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <span className="text-slate-500 dark:text-slate-400">
                  Signed in as{' '}
                </span>
                <span className="font-semibold">
                  {user.name?.trim() || user.email}
                </span>
              </p>
            )}
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              ← Home
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-72 lg:max-w-[min(18rem,100%)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Categories
                </p>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCategories}
                    className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex max-h-[min(22rem,calc(100vh-12rem))] flex-wrap gap-2 overflow-y-auto overscroll-contain pr-0.5">
                <button
                  type="button"
                  onClick={clearCategories}
                  className={
                    selectedCategories.length === 0
                      ? 'rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm'
                      : 'rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
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
                      onClick={() => toggleCategory(c)}
                      className={
                        active
                          ? 'rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm'
                          : 'rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                      }
                    >
                      {c.replaceAll('_', ' ')}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Per page
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value))
                      setPage(1)
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                  >
                    {[10, 20, 30, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          </aside>

          <main className="min-w-0 flex-1">
            {data && !loading && (
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Showing{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {data.total === 0 ? 0 : data.skip + 1}–
                  {data.skip + data.products.length}
                </span>{' '}
                of <span className="font-medium">{data.total}</span>
              </p>
            )}

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </p>
            )}

            {loading && (
              <div role="status" aria-label="Loading products">
                <div className="mb-4 h-4 w-56 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: limit }, (_, i) => (
                    <li key={i} className="min-w-0">
                      <ProductCardSkeleton />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && data && data.products.length === 0 && (
              <p className="py-16 text-center text-slate-600 dark:text-slate-400">
                No products match this filter.
              </p>
            )}

            {!loading && data && data.products.length > 0 && (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.products.map((p) => (
                  <li key={p.id} className="min-w-0">
                    <ProductExploreCard
                      product={p}
                      expanded={expandedId === p.id}
                      onToggle={() =>
                        setExpandedId((id) => (id === p.id ? null : p.id))
                      }
                    />
                  </li>
                ))}
              </ul>
            )}

            {!loading && data && data.totalPages > 0 && (
              <nav
                className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row dark:border-slate-800"
                aria-label="Pagination"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Page{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {data.page}
                  </span>{' '}
                  of {data.totalPages}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={!data.hasPreviousPage}
                    onClick={() => setPage(1)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    disabled={!data.hasPreviousPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={!data.hasNextPage}
                    onClick={() =>
                      setPage((p) =>
                        data.totalPages
                          ? Math.min(data.totalPages, p + 1)
                          : p + 1,
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    disabled={!data.hasNextPage}
                    onClick={() => setPage(data.totalPages)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
                  >
                    Last
                  </button>
                </div>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
