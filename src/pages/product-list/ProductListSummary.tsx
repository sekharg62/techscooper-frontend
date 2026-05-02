import { HiOutlineSquares2X2 } from 'react-icons/hi2'

import type { ProductPageResponse } from '../../services/productServices'

export function ProductListSummary({ data }: { data: ProductPageResponse }) {
  return (
    <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <HiOutlineSquares2X2 className="size-4 shrink-0 text-indigo-600" aria-hidden />
      <span>
        Showing{' '}
        <span className="font-medium text-slate-900">
          {data.total === 0 ? 0 : data.skip + 1}–
          {data.skip + data.products.length}
        </span>{' '}
        of <span className="font-medium text-slate-900">{data.total}</span>
      </span>
    </p>
  )
}
