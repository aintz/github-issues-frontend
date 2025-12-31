import { useQuery } from "@apollo/client/react";
import { REPO_ISSUES_QUERY } from "../../../api/queries/issues";
import type { IssuesQueryData, Issue } from "../../../types/types";

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
            {issues.map((issue) => (
              <div key={issue.id} className="mb-2 border-b p-2">
                <h3 className="font-medium">{issue.title}</h3>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
