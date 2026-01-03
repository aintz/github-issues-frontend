import IssuesListItem from "../components/IssuesListItem";
import { IssuesListSkeleton } from "../components/IssuesListSkeleton";
import { useIssuesQuery, IssueState } from "../../../generated/graphql";
import { useSearchParams } from "react-router-dom";
import StateFilters from "../components/StateFilters";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect, useCallback } from "react";
import IssuesSearchBar from "../components/IssuesSearchBar";

export default function IssuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = (searchParams.get("query") ?? "").trim();
  const isSearching = query.length > 0;
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
    skip: isSearching,
  });

  const [runSearch, searchResult] = useSearchIssuesLazyQuery();

  useEffect(() => {
    if (!isSearching) return;
    runSearch({
      variables: {
        query: buildIssueSearchQuery(searchParams),
        first: 12,
        after: null,
      },
    });
  }, [isSearching, searchParams, runSearch]);

  const setParams = useCallback(
    (label: string, param: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set(label, param);
        return params;
      });
    },
    [setSearchParams],
  );

  function submitSearch(formData: FormData) {
    const queryValue = formData.get("query")?.toString().trim() || "";

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (queryValue) {
        params.set("query", queryValue);
      } else {
        params.delete("query");
      }
      return params;
    });
  }

  const listNodes = data?.repository?.issues?.nodes ?? [];
  const searchNodes = searchResult.data?.search?.nodes ?? [];

  const rawNodes = isSearching ? searchNodes : listNodes;
  const currentLoading = isSearching ? searchResult.loading : loading;
  const currentError = isSearching ? searchResult.error : error;

  const issues = rawNodes.filter((i): i is NonNullable<typeof i> => i != null);
  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <div className="border-gh-muted mb-6 rounded-lg border p-6 text-center">
          <h1 className="text-base">👋 Welcome to the react issues tracker!</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae feugiat justo
          </p>
        </div>
        <div className="mb-6">
          <IssuesSearchBar onSubmit={submitSearch} defaultValue={searchParams} />
        </div>
        <div className="border-gh-muted mb-6 overflow-hidden rounded-lg border text-left">
          <div className="filter-container bg-gh-bg-highlighted">
            <div className="flex px-4 py-2">
              <div className="flex gap-0">
                <StateFilters
                  isActive={paramState === "open"}
                  label={"open"}
                  onClick={() => setParams("state", "open")}
                  totalCount={data?.repository?.openIssues?.totalCount}
                  loading={loading}
                />
                <StateFilters
                  label={"closed"}
                  isActive={paramState === "closed"}
                  onClick={() => setParams("state", "closed")}
                  totalCount={data?.repository?.closedIssues?.totalCount}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          <div className="issues-container pt-3">
            {currentLoading ? (
              <IssuesListSkeleton rows={12} />
            ) : currentError ? (
              <>
                <p className="text-sm text-red-700">Connection failed</p>
                <p className="text-sm text-red-700">{currentError.message}</p>
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
