function SkeletonLine({ w }: { w: string }) {
  return <div className={`bg-gh-border/40 h-3 rounded ${w} animate-pulse`} />;
}

export function IssuesListSkeleton({ rows = 12 }: { rows?: number }) {
  return (
    <div data-testid="issues-skeleton">
      <ul>
        {Array.from({ length: rows }).map((_, index) => (
          <li
            key={index}
            className={`border-gh-muted min-h-[44px] px-4 py-3 ${index === rows - 1 ? "" : "border-b"}`}
          >
            <div className="flex gap-2">
              <div className="bg-gh-border/40 mt-1 h-4 w-4 animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonLine w={index % 3 === 0 ? "w-2/3" : index % 3 === 1 ? "w-1/2" : "w-3/4"} />
                <div className="flex gap-2">
                  <SkeletonLine w="w-14" />
                  <SkeletonLine w="w-24" />
                  <SkeletonLine w="w-28" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
