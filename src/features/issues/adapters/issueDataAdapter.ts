interface NormalizedIssueData {
  nodes: any[];
  totalCount: number;
  openCount: number;
  closedCount: number;
  pageInfo: any;
  loading: boolean;
  error: any;
}

export function normalizeSearchData(searchResult: any): NormalizedIssueData {
  return {
    nodes: searchResult.data?.results?.nodes ?? [],
    totalCount: searchResult.data?.results?.issueCount ?? 0,
    openCount: searchResult.data?.open?.issueCount ?? 0,
    closedCount: searchResult.data?.closed?.issueCount ?? 0,
    pageInfo: searchResult.data?.results?.pageInfo,
    loading: searchResult.loading,
    error: searchResult.error,
  };
}

export function normalizeListData(
  listData: any,
  listLoading: boolean,
  listError: any,
): NormalizedIssueData {
  return {
    nodes: listData?.repository?.issues?.nodes ?? [],
    totalCount: listData?.repository?.issues?.totalCount ?? 0,
    openCount: listData?.repository?.openIssues?.totalCount ?? 0,
    closedCount: listData?.repository?.closedIssues?.totalCount ?? 0,
    pageInfo: listData?.repository?.issues?.pageInfo,
    loading: listLoading,
    error: listError,
  };
}
