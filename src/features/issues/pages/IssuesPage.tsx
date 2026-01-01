import { useQuery } from "@apollo/client/react";
import { REPO_ISSUES_QUERY } from "../../../api/queries/issues";
import type { IssuesQueryData, Issue } from "../../../types/types";
import IssuesListItem from "../components/IssuesListItem";
import { IssuesListSkeleton } from "../components/IssuesListSkeleton";

export default function IssuesPage() {
  const {
    data: data,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery<IssuesQueryData>(REPO_ISSUES_QUERY, {
    variables: {
      owner: "facebook",
      name: "react",
      states: ["OPEN"],
      first: 12,
      after: null,
    },
  });

  //const totalCount = data?.repository?.issues?.totalCount ?? 0;
  const issues = (data?.repository?.issues?.nodes ?? []) as Issue[];
  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">👋 Welcome to the react issues tracker!</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae feugiat justo
          </p>
        </div>
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <p className="text-sm">THE SEARCH BAR HERE</p>
        </div>

        <div className="border-gh-muted mb-6 rounded-lg border text-left">
          <div className="filter-container bg-gh-bg-highlighted">
            <p className="text-sm">THE FILTERS HERE</p>
            <p>open {data?.repository?.openIssues?.totalCount ?? 0}</p>
            <p>closed {data?.repository?.closedIssues?.totalCount ?? 0}</p>
          </div>

          <div className="issues-container pt-3">
            {loading ? (
              <IssuesListSkeleton rows={12} />
            ) : error ? (
              <>
                <p className="text-sm text-red-700">Connection failed</p>
                <p className="text-sm text-red-700">{error.message}</p>
                <button onClick={() => refetch()} className="mt-3 rounded-md border px-3 py-2">
                  Retry
                </button>
              </>
            ) : (
              <div className="issues-list-container">
                <ul>
                  {issues.map((issue, index) => (
                    <IssuesListItem issue={issue} isLast={index === issues.length - 1} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
