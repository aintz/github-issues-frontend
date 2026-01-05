import type { ApolloError } from "@apollo/client";
import IssuesListItem from "./IssuesListItem";
import { IssuesListSkeleton } from "./IssuesListSkeleton";
import type { IssueFieldsFragment } from "../../../generated/graphql";

type IssuesListProps = {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  issues: IssueFieldsFragment[];
};

export default function IssuesList({ loading, error, refetch, issues }: IssuesListProps) {
  if (loading) return <IssuesListSkeleton rows={12} />;

  if (error)
    return (
      <>
        <p className="text-sm text-red-700">Error</p>
        <p className="text-sm text-red-700">Failed to load issues. Please retry.</p>
        <button onClick={() => refetch()} className="mt-3 rounded-md border px-3 py-2">
          Retry
        </button>
      </>
    );

  if (issues.length === 0)
    return <p className="text-gh p-6 text-center text-sm">No issues found</p>;

  return (
    <div className="issues-list-container">
      <ul>
        {issues.map(
          (issue, index) =>
            issue && (
              <IssuesListItem key={issue.id} issue={issue} isLast={index === issues.length - 1} />
            ),
        )}
      </ul>
    </div>
  );
}
