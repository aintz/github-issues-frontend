import IssuesListItem from "../components/IssuesListItem";
import { IssuesListSkeleton } from "../components/IssuesListSkeleton";
import { useIssuesQuery, IssueState } from "../../../generated/graphql";
import { useSearchParams } from "react-router-dom";
import StateFilters from "../components/StateFilters";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect, useCallback } from "react";

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

  const listIssues = data?.repository?.issues?.nodes ?? [];
  const searchIssues = searchResult.data?.search?.nodes ?? [];

  console.log("searchIssues", searchIssues);

  const currentNodes = isSearching ? searchIssues : listIssues;
  const currentLoading = isSearching ? searchResult.loading : loading;
  const currentError = isSearching ? searchResult.error : error;

  const issues = currentNodes.filter((issue): issue is NonNullable<typeof issue> => issue !== null);
  //const issues = data?.repository?.issues?.nodes; //this now can be done because of codegen types
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
          <form className="relative w-full" action={submitSearch}>
            <input
              type="search"
              name="query"
              defaultValue={searchParams.get("query") ?? ""}
              placeholder="Search issues"
              className="border-gh-muted w-full rounded-lg border p-6 py-2 pr-10 pl-4 text-left text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="text-gh-gray bg-gh-tab-bg absolute inset-y-0 right-0 flex items-center rounded-tr-lg rounded-br-lg px-3"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </button>
          </form>
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
