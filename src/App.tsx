import { useEffect, useState } from 'react'

function App() {
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
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
          Backend health: <span className="font-mono">{apiStatus}</span>
        </p>
      </div>
    </div>
  )
}

export default App
