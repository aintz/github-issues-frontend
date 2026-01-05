import type { IssueFieldsFragment } from "../../../generated/graphql";
import { normalizeSearchData, normalizeListData } from "../adapters/issueDataAdapter";

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
  const normalizedData = isSearching
    ? normalizeSearchData(searchResult)
    : normalizeListData(listData, listLoading, listError);

  const issues = normalizedData.nodes.filter((node): node is IssueFieldsFragment => node != null);

  const totalPages = Math.ceil(normalizedData.totalCount / itemsPerPage);

  return {
    issues,
    totalIssues: normalizedData.totalCount,
    totalOpenCount: normalizedData.openCount,
    totalClosedCount: normalizedData.closedCount,
    pageInfo: normalizedData.pageInfo,
    totalPages,
    currentLoading: normalizedData.loading,
    currentError: normalizedData.error,
  };
}
