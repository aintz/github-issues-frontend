export default function CommentSkeleton() {
  return (
    <div className="flex pt-4">
      <div className="issue-container flex w-full max-w-[80%] min-w-0 animate-pulse gap-6">
        <div className="avatar">
          <div className="bg-gh-muted h-10 w-10 rounded-full" />
        </div>
        <div className="border-color bg-gh-bg border-gh-muted min-h-[750px] w-full rounded-lg border">
          <div className="border-gh-muted bg-gh-bg-highlighted flex items-center gap-2 rounded-t-lg border-b py-2">
            <div className="bg-gh-muted ml-4 h-4 w-28 rounded" />
            <div className="bg-gh-muted h-4 w-40 rounded" />
          </div>
          <div className="space-y-3 px-4 pt-4 pb-1">
            <div className="bg-gh-muted h-4 w-11/12 rounded" />
            <div className="bg-gh-muted h-4 w-10/12 rounded" />
            <div className="bg-gh-muted h-4 w-9/12 rounded" />
            <div className="bg-gh-muted h-4 w-7/12 rounded" />
            <div className="bg-gh-muted h-4 w-11/12 rounded" />
            <div className="bg-gh-muted h-4 w-10/12 rounded" />
            <div className="bg-gh-muted h-4 w-9/12 rounded" />
            <div className="bg-gh-muted h-4 w-7/12 rounded" />
            <div className="bg-gh-muted h-4 w-11/12 rounded" />
            <div className="bg-gh-muted h-4 w-10/12 rounded" />
            <div className="bg-gh-muted h-4 w-9/12 rounded" />
            <div className="bg-gh-muted h-4 w-7/12 rounded" />
            <div className="bg-gh-muted h-4 w-11/12 rounded" />
            <div className="bg-gh-muted h-4 w-10/12 rounded" />
            <div className="bg-gh-muted h-4 w-9/12 rounded" />
            <div className="bg-gh-muted h-4 w-7/12 rounded" />
            <div className="bg-gh-muted h-4 w-11/12 rounded" />
            <div className="bg-gh-muted h-4 w-10/12 rounded" />
            <div className="bg-gh-muted h-4 w-9/12 rounded" />
            <div className="bg-gh-muted h-4 w-7/12 rounded" />
          </div>

          <div className="mb-2 ml-4 py-2">
            <div className="bg-gh-muted inline-block h-7 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
