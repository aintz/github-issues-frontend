import { useQuery } from "@apollo/client/react";
import { REPO_ISSUES_QUERY } from "../../../api/queries/issues";
import type { IssuesQueryData, Issue } from "../../../types/types";
import { formatTime } from "../../../helpers/helpersFunctions";

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

  const totalCount = data?.repository?.issues?.totalCount ?? 0;
  const issues = (data?.repository?.issues?.nodes ?? []) as Issue[];

  return (
    <>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Issues</h1>

        <div className="mt-4 rounded-lg border p-4 text-sm">
          {loading ? (
            <p>retrieving issues...</p>
          ) : error ? (
            <>
              <p className="font-medium text-red-700">Connection failed</p>
              <p className="mt-1 text-red-700">{error.message}</p>
              <button onClick={() => refetch()} className="mt-3 rounded-md border px-3 py-2">
                Retry
              </button>
            </>
          ) : (
            <>
              <p className="mb-4">Total Issues: {totalCount}</p>
              <p>total opened issues: {data?.repository?.openIssues?.totalCount ?? 0}</p>
              <p>total closed issues: {data?.repository?.closedIssues?.totalCount ?? 0}</p>
              {issues.map((issue) => (
                <div key={issue.id} className="mb-2 border-b p-2">
                  <h3 className="font-medium">{issue.title}</h3>
                  <p>state: {issue.state}</p>
                  <p>id: {issue.number}</p>
                  <p>
                    opened{formatTime(issue.createdAt)}{" "}
                    {issue.updatedAt ? "· Updated " + formatTime(issue.updatedAt) : ""}
                  </p>
                  <p>author: {issue.author?.login ?? "unknown"}</p>
                  <p>labels: {issue.labels.nodes.map((label) => label.name).join(", ")}</p>
                  <p>comments: {issue.comments.totalCount}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
