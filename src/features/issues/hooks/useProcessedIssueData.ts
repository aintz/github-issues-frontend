import type { IssueFieldsFragment } from "../../../generated/graphql";
type useProcessedIssuesDataProps = {
  isSearching: boolean;
  listData: any;
  searchResult: any;
  itemsPerPage: number;
  listLoading: boolean;
  listError: any;
};
export default function useProcessedIssuesData({
  isSearching,
  listData,
  searchResult,
  itemsPerPage,
  listLoading,
  listError,
}: useProcessedIssuesDataProps) {
  const listNodes = listData?.repository?.issues?.nodes ?? [];
  const searchNodes = searchResult.data?.results?.nodes ?? [];

  const issues = (isSearching ? searchNodes : listNodes).filter(
    (node): node is IssueFieldsFragment => node != null,
  );

  const totalIssues = isSearching
    ? (searchResult.data?.results?.issueCount ?? 0)
    : (listData?.repository?.issues?.totalCount ?? 0);

  const totalOpenCount = isSearching
    ? (searchResult.data?.open?.issueCount ?? 0)
    : (listData?.repository?.openIssues?.totalCount ?? 0);
  const totalClosedCount = isSearching
    ? (searchResult.data?.closed?.issueCount ?? 0)
    : (listData?.repository?.closedIssues?.totalCount ?? 0);

  const pageInfo = isSearching
    ? searchResult.data?.results?.pageInfo
    : listData?.repository?.issues?.pageInfo;

  const totalPages = Math.ceil(totalIssues / itemsPerPage);

  const currentLoading = isSearching ? searchResult.loading : listLoading;
  const currentError = isSearching ? searchResult.error : listError;

  return {
    issues,
    totalIssues,
    totalOpenCount,
    totalClosedCount,
    pageInfo,
    totalPages,
    currentLoading,
    currentError,
  };
}
