export default function HomePageLoading() {
  return (
    <section className="grid h-full grid-rows-[auto,1fr] gap-4">
      <nav className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-col items-center gap-2 sm:flex-row md:gap-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-muted md:max-w-[180px]" />
          <div className="h-10 w-full animate-pulse rounded-md bg-muted md:max-w-[180px]" />
          <div className="h-10 w-full animate-pulse rounded-md bg-muted md:max-w-[180px]" />
        </div>
        <div className="h-4 w-full max-w-[230px] animate-pulse bg-muted" />
      </nav>
      <div className="h-full w-full animate-pulse bg-muted" />
    </section>
  );
}
