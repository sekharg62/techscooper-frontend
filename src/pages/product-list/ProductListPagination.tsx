import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2'

import type { ProductPageResponse } from '../../services/productServices'

const pageBtn =
  'inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'

export function ProductListPagination({
  data,
  onGoFirst,
  onGoPrev,
  onGoNext,
  onGoLast,
}: {
  data: ProductPageResponse
  onGoFirst: () => void
  onGoPrev: () => void
  onGoNext: () => void
  onGoLast: () => void
}) {
  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-slate-600">
        Page{' '}
        <span className="font-semibold text-slate-900">{data.page}</span> of{' '}
        {data.totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={!data.hasPreviousPage}
          onClick={onGoFirst}
          className={pageBtn}
          aria-label="First page"
        >
          <HiOutlineChevronDoubleLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">First</span>
        </button>
        <button
          type="button"
          disabled={!data.hasPreviousPage}
          onClick={onGoPrev}
          className={pageBtn}
          aria-label="Previous page"
        >
          <HiOutlineChevronLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <button
          type="button"
          disabled={!data.hasNextPage}
          onClick={onGoNext}
          className={pageBtn}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <HiOutlineChevronRight className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={!data.hasNextPage}
          onClick={onGoLast}
          className={pageBtn}
          aria-label="Last page"
        >
          <span className="hidden sm:inline">Last</span>
          <HiOutlineChevronDoubleRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
