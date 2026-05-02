import { Link } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from 'react-icons/hi2'

import type { AuthUser } from '../../services/authServices'

export function ProductListHeader({ user }: { user: AuthUser | null }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          TechScopper
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <HiOutlineShoppingBag
            className="size-8 shrink-0 text-indigo-600"
            aria-hidden
          />
          Product catalog
        </h1>
      </div>
      <div className="flex flex-col items-stretch gap-2 sm:items-end sm:text-right">
        {user && (
          <p className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm">
            <HiOutlineUser className="size-5 shrink-0 text-indigo-600" aria-hidden />
            <span>
              <span className="text-slate-500">Signed in as </span>
              <span className="font-semibold">
                {user.name?.trim() || user.email}
              </span>
            </span>
          </p>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 sm:justify-end"
        >
          <HiOutlineHome className="size-4 shrink-0" aria-hidden />
          Home
        </Link>
      </div>
    </header>
  )
}
