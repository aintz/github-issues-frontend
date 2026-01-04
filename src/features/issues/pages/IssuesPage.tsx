import { useIssuesQuery } from "../../../generated/graphql";
import StateFilters from "../components/StateFilters";
import { useSearchIssuesLazyQuery } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";
import { useEffect, useState, useCallback } from "react";
import IssuesSearchBar from "../components/IssuesSearchBar";
import SortDropdown from "../components/SortDropdown";
import IssuesList from "../components/IssuesList";
import useIssueFilters from "../hooks/useIssueFilters";
import type { IssueFieldsFragment } from "../../../generated/graphql";
import WelcomeBanner from "../components/WelcomeBanner";
import Pagination from "../components/Pagination";

export default function IssuesPage() {
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

  const [cursorByPage, setCursorByPage] = useState<Record<number, string | null>>({ 1: null });

  useEffect(() => {
    setCursorByPage({ 1: null });
    setParams("page", "1");
  }, [signature]);

  //List query
  const after = currentPage === 1 ? null : (cursorByPage[currentPage] ?? null);

  useEffect(() => {
    if (!isSearching) return;
    if (currentPage === 1) return;
    if (!cursorByPage[currentPage]) {
      setParams("page", "1");
    }
  }, [isSearching, currentPage, cursorByPage, setParams]);

  const { data, loading, error, refetch, fetchMore } = useIssuesQuery({
    variables: {
      owner: "facebook",
      name: "react",
      states: [currentState],
      first: 12,
      after,
      orderBy,
    },
    skip: isSearching,
    notifyOnNetworkStatusChange: true,
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
        after,
      },
    });
  }, [isSearching, searchParams, runSearch]);

  //Data processing

  //Issues
  const listNodes = data?.repository?.issues?.nodes ?? [];
  const searchNodes = searchResult.data?.results?.nodes ?? [];

  const issues = (isSearching ? searchNodes : listNodes).filter(
    (node): node is IssueFieldsFragment => {
      return node?.__typename === "Issue";
    },
  );
  const totalIssues = isSearching
    ? (searchResult.data?.results?.issueCount ?? 0)
    : (data?.repository?.issues?.totalCount ?? 0);

  //Loading and error
  const currentLoading = isSearching ? searchResult.loading : loading;
  const currentError = isSearching ? searchResult.error : error;

  //Total counts
  const totalOpenCount = isSearching
    ? (searchResult.data?.open?.issueCount ?? 0)
    : (data?.repository?.openIssues?.totalCount ?? 0);
  const totalClosedCount = isSearching
    ? (searchResult.data?.closed?.issueCount ?? 0)
    : (data?.repository?.closedIssues?.totalCount ?? 0);

  //Pagination
  const pageInfo = isSearching
    ? searchResult.data?.results?.pageInfo
    : data?.repository?.issues?.pageInfo;
  const totalPages = Math.ceil(totalIssues / 12);
  const hasNextPage = pageInfo?.hasNextPage ?? false;
  const endCursor = pageInfo?.endCursor ?? null;

  useEffect(() => {
    if (isSearching) return;
    if (!hasNextPage || !endCursor) return;

    setCursorByPage((prev) => {
      const nextPage = currentPage + 1;
      if (prev[nextPage] === endCursor) return prev;
      return { ...prev, [nextPage]: endCursor };
    });
  }, [isSearching, hasNextPage, endCursor, currentPage]);

  const handleNextPage = useCallback(() => {
    if (isSearching) return;
    if (!hasNextPage || !endCursor) return;

    setParams("page", String(currentPage + 1));
  }, [isSearching, hasNextPage, endCursor, currentPage, setParams]);

  const handlePreviousPage = useCallback(() => {
    if (isSearching) return;
    if (currentPage <= 1) return;
    setParams("page", String(currentPage - 1));
  }, [isSearching, currentPage, setParams]);

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

  console.log("current issues", issues);

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
                  loading={loading}
                />
                <StateFilters
                  label={"closed"}
                  isActive={state === "closed"}
                  onClick={() => setParams("state", "closed")}
                  totalCount={totalClosedCount}
                  loading={loading}
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
          onPageChange={(page) => setParams("page", page.toString())}
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
        />
      </div>
    </>
  );
}
