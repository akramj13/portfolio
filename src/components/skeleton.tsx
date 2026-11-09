/** Loading shell for detail pages while route params resolve. */
export function DetailSkeleton({ narrow = false }: { narrow?: boolean }) {
  return (
    <div
      aria-busy
      aria-label="Loading"
      className={narrow ? "mx-auto w-full max-w-[760px] px-6 pt-10 md:pt-14" : "shell pt-10 md:pt-14"}
    >
      <div className="h-4 w-24 animate-pulse rounded-full bg-surface" />
      <div className="mt-14 h-4 w-32 animate-pulse rounded-full bg-surface" />
      <div className="mt-5 h-16 w-2/3 animate-pulse rounded-2xl bg-surface md:h-20" />
      <div className="mt-6 h-5 w-1/2 animate-pulse rounded-full bg-surface" />
      <div className="mt-12 aspect-[16/9] animate-pulse rounded-[2.5rem] bg-surface" />
    </div>
  );
}
