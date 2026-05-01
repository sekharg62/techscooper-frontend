import { useState } from 'react'
import { Link } from 'react-router-dom'

import { PRODUCT_CATEGORIES, type ProductCategory } from '../constants'
import { createProduct, getProductErrorMessage } from '../services/productServices'

export function AdminProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [actualPrice, setActualPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [category, setCategory] = useState<ProductCategory>('ELECTRONICS')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const actual = Number.parseFloat(actualPrice)
    if (!Number.isFinite(actual) || actual < 0) {
      setError('Actual price must be a valid non-negative number.')
      return
    }

    let offer: number | null = null
    if (offerPrice.trim() !== '') {
      const o = Number.parseFloat(offerPrice)
      if (!Number.isFinite(o) || o < 0) {
        setError('Offer price must be a valid non-negative number or empty.')
        return
      }
      offer = o
    }

    setLoading(true)
    try {
      const product = await createProduct({
        name,
        description,
        actualPrice: actual,
        offerPrice: offer,
        category,
      })
      setSuccess(
        `Created product #${product.id} — ${product.name} (${product.category}).`,
      )
      setName('')
      setDescription('')
      setActualPrice('')
      setOfferPrice('')
      setCategory('ELECTRONICS')
    } catch (err) {
      setError(getProductErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          TechScopper · Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Create product
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          POST <span className="font-mono text-xs">/api/product</span> — offer
          price is optional and must not exceed actual price.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Name
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="product-description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="product-description"
              name="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-actual-price"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Actual price
              </label>
              <input
                id="product-actual-price"
                name="actualPrice"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                required
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="product-offer-price"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Offer price (optional)
              </label>
              <input
                id="product-offer-price"
                name="offerPrice"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Category
            </label>
            <select
              id="product-category"
              name="category"
              required
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ProductCategory)
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:border-indigo-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create product'}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-center text-sm">
          <Link
            to="/admin/product/bulk"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Bulk JSON import
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
