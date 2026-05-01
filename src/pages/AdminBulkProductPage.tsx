import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  createProduct,
  getProductErrorMessage,
  type CreateProductBody,
  type ProductJson,
} from '../services/productServices'
import {
  parseBulkProductInput,
  validateBulkProductItem,
} from '../utils/bulkProductJson'

const EXAMPLE_BULK = `[
  {
    "name": "iPhone 14",
    "description": "Latest Apple smartphone with A15 chip",
    "actualPrice": 80000,
    "offerPrice": 75000,
    "category": "ELECTRONICS"
  },
  {
    "name": "Nike Running Shoes",
    "description": "Comfortable running shoes for daily use",
    "actualPrice": 5000,
    "offerPrice": 4200,
    "category": "SPORTS"
  }
]`

type RowResult =
  | { index: number; name: string; status: 'ok'; product: ProductJson }
  | { index: number; name: string; status: 'error'; message: string }

export function AdminBulkProductPage() {
  const [text, setText] = useState(EXAMPLE_BULK)
  const [parseError, setParseError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  )
  const [results, setResults] = useState<RowResult[] | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParseError(null)
    setResults(null)

    let items: ReturnType<typeof parseBulkProductInput>
    try {
      items = parseBulkProductInput(text)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Invalid input.')
      return
    }

    if (items.length === 0) {
      setParseError('No product objects found.')
      return
    }

    const bodies: { index: number; name: string; body: CreateProductBody }[] = []
    const validationErrors: RowResult[] = []

    for (let i = 0; i < items.length; i++) {
      try {
        const body = validateBulkProductItem(items[i], i)
        bodies.push({ index: i, name: body.name, body })
      } catch (err) {
        validationErrors.push({
          index: i,
          name: '(invalid)',
          status: 'error',
          message: err instanceof Error ? err.message : 'Validation failed.',
        })
      }
    }

    if (validationErrors.length > 0) {
      setResults(validationErrors)
      return
    }

    setLoading(true)
    setProgress({ done: 0, total: bodies.length })
    const rowResults: RowResult[] = []

    for (let j = 0; j < bodies.length; j++) {
      const { index, name, body } = bodies[j]
      try {
        const product = await createProduct(body)
        rowResults.push({
          index,
          name,
          status: 'ok',
          product,
        })
      } catch (err) {
        rowResults.push({
          index,
          name,
          status: 'error',
          message: getProductErrorMessage(err),
        })
      }
      setProgress({ done: j + 1, total: bodies.length })
    }

    setResults(rowResults)
    setLoading(false)
    setProgress(null)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          TechScopper · Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Bulk create products
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Paste a JSON array or several objects (comma-separated). Supports JSON5:
          single quotes, trailing commas, and{' '}
          <span className="font-mono">category: ELECTRONICS</span> (unquoted enum).
          Each item is sent with{' '}
          <span className="font-mono">POST /api/product</span> in order.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="bulk-json"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Product JSON
            </label>
            <textarea
              id="bulk-json"
              name="bulkJson"
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {parseError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {parseError}
            </p>
          )}

          {progress && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Creating {progress.done} / {progress.total}…
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating products…' : 'Parse & create all'}
          </button>
        </form>

        {results && results.length > 0 && (
          <ul className="mt-6 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
            {results.map((r) => (
              <li
                key={r.index}
                className={
                  r.status === 'ok'
                    ? 'text-emerald-800 dark:text-emerald-200'
                    : 'text-red-800 dark:text-red-200'
                }
              >
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  #{r.index + 1}
                </span>{' '}
                {r.name}:{' '}
                {r.status === 'ok' ? (
                  <>
                    created id {r.product.id} · {r.product.category}
                  </>
                ) : (
                  r.message
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/admin/product"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Single product form
          </Link>
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  )
}
