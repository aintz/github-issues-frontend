import { useEffect } from "react";
import { useSearchIssuesLazyQuery, useIssuesQuery, IssueState } from "../../../generated/graphql";
import type { IssueOrder } from "../../../generated/graphql";
import { buildIssueSearchQuery } from "../../../helpers/helperBuildIssueSearchQuery";

type useGetIssuesDataProps = {
  isSearching: boolean;
  currentState: IssueState;
  previousPageReference: string | null;
  orderBy: IssueOrder;
  searchParams: URLSearchParams;
  ITEMS_PER_PAGE: number;
};

export default function useGetIssuesData({
  isSearching,
  currentState,
  previousPageReference,
  orderBy,
  searchParams,
  ITEMS_PER_PAGE,
}: useGetIssuesDataProps) {
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

  return { listData, listLoading, listError, refetch, searchResult };
}
