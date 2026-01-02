import IssuesListItem from "../components/IssuesListItem";
import { IssuesListSkeleton } from "../components/IssuesListSkeleton";
import { useIssuesQuery, IssueState } from "../../../generated/graphql";
import { useSearchParams } from "react-router-dom";
import StateFilters from "../components/StateFilters";

export default function IssuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramState = (searchParams.get("state")?.toLocaleLowerCase() ?? "open") as
    | "open"
    | "closed";

  const currentState = paramState === "closed" ? IssueState.Closed : IssueState.Open; // we need to do this because of the enum of the state

  const { data, loading, error, refetch } = useIssuesQuery({
    variables: {
      owner: "facebook",
      name: "react",
      states: [currentState],
      first: 12,
      after: null,
    },
  });

  const issues = data?.repository?.issues?.nodes; //this now can be done because of codegen types

  function setParams(label: string, param: string) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set(label, param);
      return params;
    });
  }

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">👋 Welcome to the react issues tracker!</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae feugiat justo
          </p>
        </div>
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <p className="text-sm">THE SEARCH BAR HERE</p>
        </div>

        <div className="border-gh-muted mb-6 overflow-hidden rounded-lg border text-left">
          <div className="filter-container bg-gh-bg-highlighted">
            <div className="flex px-4 py-2">
              <div className="flex gap-0">
                <StateFilters
                  paramState={paramState}
                  setParams={setParams}
                  state="open"
                  totalCount={data?.repository?.openIssues?.totalCount}
                />
                <StateFilters
                  paramState={paramState}
                  setParams={setParams}
                  state="closed"
                  totalCount={data?.repository?.closedIssues?.totalCount}
                />
              </div>
            </div>
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
                {issues && issues?.length > 0 ? (
                  <ul>
                    {issues.map(
                      (issue, index) =>
                        issue && (
                          <IssuesListItem
                            key={issue.id}
                            issue={issue}
                            isLast={index === issues.length - 1}
                          />
                        ),
                    )}
                  </ul>
                ) : (
                  <p className="text-gh-muted p-6 text-center text-sm">No issues found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
