export function ProductCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-hidden
    >
      <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="mb-3 h-5 w-4/5 max-w-56 animate-pulse rounded-md bg-slate-200" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-slate-100" />
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-slate-100" />
      <div className="mb-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
    </article>
  )
}
