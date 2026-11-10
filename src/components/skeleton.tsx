/** Loading shell for detail pages while route params resolve. */
export function DetailSkeleton() {
  return (
    <div aria-busy aria-label="Loading" className="column pt-10 md:pt-14">
      <div className="h-4 w-24 animate-pulse rounded-full bg-surface" />
      <div className="mt-8 size-12 animate-pulse rounded-[14px] bg-surface" />
      <div className="mt-6 h-14 w-2/3 animate-pulse rounded-2xl bg-surface md:h-16" />
      <div className="mt-5 h-5 w-full animate-pulse rounded-full bg-surface" />
      <div className="mt-2 h-5 w-4/5 animate-pulse rounded-full bg-surface" />
      <div className="mt-10 aspect-[16/10] animate-pulse rounded-[1.75rem] bg-surface" />
    </div>
  );
}
