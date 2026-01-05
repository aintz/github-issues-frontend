import { useEffect } from "react";
import { useSearchIssuesLazyQuery, useIssuesQuery } from "../../../generated/graphql";

const ITEMS_PER_PAGE = 12;

type useGetIssuesData = {
  currentState: string;
  previousPageReference: string;
  orderBy:
  isSearching: boolean
};

export default function useGetIssuesData({
  currentState,
  previousPageReference,
  orderBy,
  isSearching,
}:useGetIssuesData) {
  //Regular list query
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

  return { listData, listError, listLoading, refetch };
}
