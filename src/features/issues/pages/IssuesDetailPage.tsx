import { Link, useParams } from "react-router-dom";
import { useIssueDetailQuery } from "../../../generated/graphql";
import Comment from "../components/Comment";
import CommentSkeleton from "../components/CommentSkeleton";
import Labels from "../components/Labels";

export default function IssuesDetailPage() {
  const { number } = useParams();

  const n = Number(number);
  const issueNumber = Number.isFinite(n) && n > 0 ? Math.floor(n) : null;

  const { data, loading, error, refetch } = useIssueDetailQuery({
    variables: {
      owner: "facebook",
      name: "react",
      number: issueNumber ?? 0,
    },
    skip: issueNumber == null,
    notifyOnNetworkStatusChange: true,
  });

  if (issueNumber == null) {
    return (
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">💀 Issue not found!</h1>
          <Link to="/issues" className="text-sm underline">
            Back to issues
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto mt-6 max-w-7xl px-6 py-4">
        <div className="border-gh-muted animate-pulse border-b pb-6">
          <div className="bg-gh-muted h-9 w-2/3 rounded" />
          <div className="bg-gh-muted mt-4 h-6 w-28 rounded-full" />
        </div>

        <div className="mt-6">
          <CommentSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">❌ Error!</h1>
          <p className="text-sm">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="border-gh-muted mt-4 rounded-md border px-3 py-2 text-sm"
          >
            Retry
          </button>
          <div className="mt-3">
            <Link to="/issues" className="text-sm underline">
              Back to issues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const issue = data?.repository?.issue;

  if (!issue) {
    return (
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">💀 Issue not found!</h1>
          <Link to="/issues" className="text-sm underline">
            Back to issues
          </Link>
        </div>
      </div>
    );
  }

  const issueLikes = issue.reactions?.totalCount ?? 0;
  const comments = issue.comments?.nodes?.filter(Boolean) ?? [];
  const commentsCount = issue.comments?.totalCount ?? 0;

  const labels = (issue.labels?.nodes ?? []).filter(
    (l): l is { id: string; name: string; color: string } => l != null,
  );

  return (
    <div className="mx-auto mt-6 max-w-7xl px-6 py-4">
      <div className="mb-4">
        <Link to="/issues" className="text-sm underline">
          ← Back to issues
        </Link>
      </div>

      <div className="border-gh-muted border-b pb-6">
        <h1 className="pb-3 text-4xl">
          {issue.title}
          <span className="text-gh-gray"> #{issue.number}</span>
        </h1>

        <p className="text-gh-text pt-1 text-sm font-bold">
          <span
            className={`${
              issue.state === "OPEN" ? "bg-gh-green" : "bg-gh-purple"
            } rounded-full px-3 py-1`}
          >
            {issue.state}
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <Comment
            author={issue.author ?? { login: null, avatarUrl: null, url: null }}
            createdAt={issue.createdAt}
            bodyHTML={issue.bodyHTML}
            likes={issueLikes}
          />

          {comments.map((comment) => (
            <Comment
              isOtherComment
              key={comment?.id}
              author={comment?.author ?? { login: null, avatarUrl: null, url: null }}
              createdAt={comment?.createdAt}
              bodyHTML={comment?.bodyHTML}
              likes={comment?.reactions?.totalCount ?? 0}
            />
          ))}
        </div>

        <aside className="w-full shrink-0 lg:w-64">
          <h3 className="text-gh-gray text-xs">Labels</h3>
          <div className="pt-2">
            <Labels labels={labels} />
          </div>
        </aside>
      </div>

      {commentsCount > 20 && (
        <p className="text-gh-text-muted mt-4 text-center text-sm">
          Showing first 20 of {commentsCount} comments.
        </p>
      )}
    </div>
  );
}
