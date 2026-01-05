import { useIssuesQuery } from "../../../generated/graphql";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect, useCallback } from "react";
import IssuesSearchBar from "../components/IssuesSearchBar";
import IssuesList from "../components/IssuesList";
import WelcomeBanner from "../components/WelcomeBanner";
import Pagination from "../components/Pagination";
import useIssueFilters from "../hooks/useIssueFilters";
import useListPagination from "../hooks/useListPagination";
import useSearchPagination from "../hooks/useSearchPagination";
import useProcessedIssuesData from "../hooks/useProcessedIssueData";
import useSearchHandlers from "../hooks/useSearchHandlers";
import IssuesFilterBar from "../components/IssuesFilterBar";
import useGetIssuesData from "../hooks/useGetIssuesData";

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
  const previousPageReference =
    currentPage === 1
      ? null
      : isSearching
        ? (searchCursorByPage[currentPage] ?? null)
        : (cursorByPage[currentPage] ?? null);

  const {} = useGetIssuesData();

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
      after: previousPageReference,
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
        after: previousPageReference,
      },
    });
  }, [isSearching, searchParams, runSearch, previousPageReference]);

  //Data processing
  const {
    issues,
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

  useEffect(() => {
    if (!hasNextPage || !endCursor) return;
    const cursorSetFn = isSearching ? setSearchCursorByPage : setCursorByPage;
    const nextPage = currentPage + 1;

    cursorSetFn((prev) => {
      if (prev[nextPage] === endCursor) return prev;
      return { ...prev, [nextPage]: endCursor };
    });
  }, [isSearching, hasNextPage, endCursor, currentPage]);

  const { clearSearchIfEmpty, submitSearch } = useSearchHandlers(setSearchParams);

  const handleNextPage = useCallback(() => {
    if (!hasNextPage || !endCursor) return;

    setParams("page", String(currentPage + 1));
  }, [hasNextPage, endCursor, currentPage, setParams]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage <= 1) return;
    setParams("page", String(currentPage - 1));
  }, [currentPage, setParams]);

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
          <IssuesFilterBar
            setParams={setParams}
            totalOpenCount={totalOpenCount}
            totalClosedCount={totalClosedCount}
            currentLoading={currentLoading}
            state={state}
            sort={sort}
            order={order}
          />

          <div className="issues-container pt-3">
            <IssuesList
              loading={currentLoading}
              error={currentError}
              refetch={isSearching ? searchResult.refetch : refetch}
              issues={issues}
            />
          </div>
        </div>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePreviousPage}
            loading={currentLoading}
          />
        )}
      </div>
    </>
  );
}
