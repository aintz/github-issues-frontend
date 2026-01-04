import { useIssuesQuery } from "../../../generated/graphql";
import StateFilters from "../components/StateFilters";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect } from "react";
import IssuesSearchBar from "../components/IssuesSearchBar";
import SortDropdown from "../components/SortDropdown";
import IssuesList from "../components/IssuesList";
import useIssueFilters from "../hooks/useIssueFilters";

export default function IssuesPage() {
  const {
    query,
    isSearching,
    state,
    sort,
    order,
    orderBy,
    currentState,
    setParam,
    reset,
    searchParams,
  } = useIssueFilters();

  //List query
  const { data, loading, error, refetch } = useIssuesQuery({
    variables: {
      owner: "facebook",
      name: "react",
      states: [currentState],
      first: 12,
      after: null,
      orderBy: orderBy,
    },
    skip: isSearching,
  });

  //Search query
  const [runSearch, searchResult] = useSearchIssuesLazyQuery();

  useEffect(() => {
    if (!isSearching) return;
    const countQuery = buildIssueSearchQuery(searchParams, { includeState: false });
    runSearch({
      variables: {
        query: buildIssueSearchQuery(searchParams),
        openQuery: `${countQuery} is:open`,
        closedQuery: `${countQuery} is:closed`,
        first: 12,
        after: null,
      },
    });
  }, [isSearching, searchParams, runSearch]);

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
  const searchNodes = searchResult.data?.results?.nodes ?? [];
  const rawNodes = isSearching ? searchNodes : listNodes;
  const currentLoading = isSearching ? searchResult.loading : loading;
  const currentError = isSearching ? searchResult.error : error;

  const totalOpenCount = isSearching
    ? (searchResult.data?.open?.issueCount ?? 0)
    : (data?.repository?.openIssues?.totalCount ?? 0);
  const totalClosedCount = isSearching
    ? (searchResult.data?.closed?.issueCount ?? 0)
    : (data?.repository?.closedIssues?.totalCount ?? 0);

  const issues = rawNodes.filter((i): i is NonNullable<typeof i> => i != null);

  function clearSearchIfEmpty(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("query");
        return params;
      });
    }
  }

  function resetFilters() {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("state");
      params.delete("sort");
      params.delete("order");
      params.delete("query");
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
        <div className="mb-6">
          <IssuesSearchBar
            onSubmit={submitSearch}
            defaultValue={searchParams}
            clearSearchIfEmpty={clearSearchIfEmpty}
          />
        </div>
        <div className="border-gh-muted mb-6 overflow-hidden rounded-lg border text-left">
          <div className="filter-container bg-gh-bg-highlighted">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex gap-0">
                <StateFilters
                  isActive={paramState === "open"}
                  label={"open"}
                  onClick={() => setParams("state", "open")}
                  totalCount={totalOpenCount}
                  loading={loading}
                />
                <StateFilters
                  label={"closed"}
                  isActive={paramState === "closed"}
                  onClick={() => setParams("state", "closed")}
                  totalCount={totalClosedCount}
                  loading={loading}
                />
              </div>

              <div className="flex items-center gap-2">
                <SortDropdown
                  onClick={setParams}
                  currentSort={sortParam}
                  currentOrder={orderParam}
                />
                <button
                  onClick={resetFilters}
                  className="text-gh-text hover:border-gh-muted hover:bg-gh-bg-highlighted rounded-md px-3 py-2 text-sm font-semibold hover:border"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="issues-container pt-3">
            <IssuesList
              loading={currentLoading}
              error={currentError}
              refetch={isSearching ? searchResult.refetch : refetch}
              issues={issues}
            />
          </div>
        </div>
      </div>
    </>
  );
}
