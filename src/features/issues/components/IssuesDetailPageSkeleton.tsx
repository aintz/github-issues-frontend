import CommentSkeleton from "./CommentSkeleton";
import LabelsSkeleton from "./LabelsSkeleton";

export default function IssueDetailPageSkeleton() {
  return (
    <div className="mx-auto mt-6 max-w-7xl px-6 py-4">
      <div className="border-gh-muted animate-pulse border-b pb-6">
        <div className="bg-gh-muted h-9 w-2/3 rounded" />
        <div className="bg-gh-muted mt-4 h-6 w-28 rounded-full" />
      </div>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="mt-6">
            <CommentSkeleton />
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-64">
          <h3 className="text-gh-gray text-xs">Labels</h3>
          <div className="pt-2">
            <LabelsSkeleton />
          </div>
        </aside>
      </div>
    </div>
  );
}
