import { useIssuesQuery } from "../../../generated/graphql";
import StateFilters from "../components/StateFilters";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect, useCallback } from "react";
import IssuesSearchBar from "../components/IssuesSearchBar";
import SortDropdown from "../components/SortDropdown";
import IssuesList from "../components/IssuesList";
import WelcomeBanner from "../components/WelcomeBanner";
import Pagination from "../components/Pagination";
import useIssueFilters from "../hooks/useIssueFilters";
import useListPagination from "../hooks/useListPagination";
import useSearchPagination from "../hooks/useSearchPagination";
import useProcessedIssuesData from "../hooks/useProcessedIssueData";
const ITEMS_PER_PAGE = 12;

export default function IssuesPage() {
  //returns filters and setters from URL search params
  const {
    isSearching,
    state,
    sort,
    order,
    orderBy,
    currentState,
    setParams,
    setSearchParams,
    searchParams,
    currentPage,
    signature,
  } = useIssueFilters();

  const { cursorByPage, setCursorByPage } = useListPagination({
    setParams,
    isSearching,
    currentPage,
  });
  const { searchCursorByPage, setSearchCursorByPage } = useSearchPagination({
    setParams,
    isSearching,
    currentPage,
  });

  //Reset cursors on filter change
  useEffect(() => {
    setCursorByPage({ 1: null });
    setSearchCursorByPage({ 1: null });
    setParams("page", "1");
  }, [signature]);

  //List query
  const after =
    currentPage === 1
      ? null
      : isSearching
        ? (searchCursorByPage[currentPage] ?? null)
        : (cursorByPage[currentPage] ?? null);

  const {
    data: listData,
    loading: listLoading,
    error: listError,
    refetch,
  } = useIssuesQuery({
    variables: {
      owner: "facebook",
      name: "react",
      states: [currentState],
      first: ITEMS_PER_PAGE,
      after,
      orderBy,
    },
    skip: isSearching,
    notifyOnNetworkStatusChange: true,
  });

  //Search query
  const [runSearch, searchResult] = useSearchIssuesLazyQuery();

  //Rerun search on filter change
  useEffect(() => {
    if (!isSearching) return;
    const countQuery = buildIssueSearchQuery(searchParams, { includeState: false });
    runSearch({
      variables: {
        query: buildIssueSearchQuery(searchParams),
        openQuery: `${countQuery} is:open`,
        closedQuery: `${countQuery} is:closed`,
        first: ITEMS_PER_PAGE,
        after,
      },
    });
  }, [isSearching, searchParams, runSearch]);

  //Data processing

  const {
    issues,
    totalIssues,
    totalOpenCount,
    totalClosedCount,
    pageInfo,
    totalPages,
    currentLoading,
    currentError,
  } = useProcessedIssuesData({
    isSearching,
    listData,
    listLoading,
    listError,
    searchResult,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const hasNextPage = pageInfo?.hasNextPage ?? false;
  const endCursor = pageInfo?.endCursor ?? null;

  //Set cursor for next page (for the list)
  useEffect(() => {
    if (!hasNextPage || !endCursor) return;

    if (isSearching) {
      setSearchCursorByPage((prev) => {
        const nextPage = currentPage + 1;
        if (prev[nextPage] === endCursor) return prev;
        return { ...prev, [nextPage]: endCursor };
      });
    } else {
      setCursorByPage((prev) => {
        const nextPage = currentPage + 1;
        if (prev[nextPage] === endCursor) return prev;
        return { ...prev, [nextPage]: endCursor };
      });
    }
  }, [isSearching, hasNextPage, endCursor, currentPage]);

  const handleNextPage = useCallback(() => {
    if (!hasNextPage || !endCursor) return;

    setParams("page", String(currentPage + 1));
  }, [isSearching, hasNextPage, endCursor, currentPage, setParams]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage <= 1) return;
    setParams("page", String(currentPage - 1));
  }, [isSearching, currentPage, setParams]);

  //Search handlers

  function clearSearchIfEmpty(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("query");
        return params;
      });
    }
  }

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

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl p-4">
        <WelcomeBanner />
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
                  isActive={state === "open"}
                  label={"open"}
                  onClick={() => setParams("state", "open")}
                  totalCount={totalOpenCount}
                  loading={currentLoading}
                />
                <StateFilters
                  label={"closed"}
                  isActive={state === "closed"}
                  onClick={() => setParams("state", "closed")}
                  totalCount={totalClosedCount}
                  loading={currentLoading}
                />
              </div>

              <div>
                <SortDropdown onClick={setParams} currentSort={sort} currentOrder={order} />
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
          loading={currentLoading}
        />
      </div>
    </>
  );
}
