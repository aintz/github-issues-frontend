export default function IssuesPageSkeleton() {
  return (
    <div className="mx-auto mt-6 max-w-7xl animate-pulse p-4">
      <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
        <div className="bg-gh-muted mx-auto h-6 w-2/3 rounded" />
        <div className="bg-gh-muted mx-auto mt-3 h-4 w-3/4 rounded" />
      </div>

      <div className="mb-6">
        <div className="border-gh-muted relative w-full rounded-lg border px-4 py-2">
          <div className="bg-gh-muted h-5 w-1/2 rounded" />
          <div className="bg-gh-muted absolute inset-y-0 right-0 my-auto mr-3 h-8 w-8 rounded" />
        </div>
      </div>

      <div className="border-gh-muted mb-6 overflow-hidden rounded-lg border text-left">
        <div className="bg-gh-bg-highlighted px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="bg-gh-muted h-9 w-24 rounded" />
              <div className="bg-gh-muted h-9 w-24 rounded" />
            </div>

            <div className="bg-gh-muted h-9 w-44 rounded" />
          </div>
        </div>

        <div className="pt-3">
          <ul className="divide-gh-muted divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="bg-gh-muted mt-1 h-4 w-4 rounded" />
                  <div className="min-w-0 flex-1">
                    <div className="bg-gh-muted h-5 w-3/4 rounded" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="bg-gh-muted h-5 w-16 rounded-full" />
                      <div className="bg-gh-muted h-5 w-20 rounded-full" />
                      <div className="bg-gh-muted h-5 w-14 rounded-full" />
                    </div>
                    <div className="bg-gh-muted mt-2 h-4 w-1/2 rounded" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <div className="bg-gh-muted h-8 w-24 rounded" />
        <div className="bg-gh-muted h-5 w-24 rounded" />
        <div className="bg-gh-muted h-8 w-24 rounded" />
      </div>
    </div>
  );
}
