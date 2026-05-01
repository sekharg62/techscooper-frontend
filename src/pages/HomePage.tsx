import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export function HomePage() {
  const { user } = useAuth()
  const [apiStatus, setApiStatus] = useState<string>('checking…')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setApiStatus('reachable'))
      .catch(() =>
        setApiStatus('offline (start backend on port 3001)'),
      )
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <nav className="mb-6 flex flex-wrap gap-3 text-sm">
          <Link
            to="/product-list"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-950"
          >
            Browse products
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500"
          >
            Register
          </Link>
          <Link
            to="/admin/product"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-950"
          >
            Admin · Product
          </Link>
          <Link
            to="/admin/product/bulk"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-950"
          >
            Admin · Bulk
          </Link>
        </nav>
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          TechScopper
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          React · TypeScript · Tailwind · Vite
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Frontend is wired. API proxy targets{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">
            /api → localhost:3001
          </code>
          .
        </p>
        {user && (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            Signed in as{' '}
            <span className="font-medium">
              {user.name?.trim() || user.email}
            </span>{' '}
            ({user.email}) · role{' '}
            <span className="font-mono">{user.role}</span>
          </p>
        )}
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
          Backend health: <span className="font-mono">{apiStatus}</span>
        </p>
      </div>
    </div>
  )
}
