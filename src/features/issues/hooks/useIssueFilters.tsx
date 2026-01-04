import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { IssueState, IssueOrderField, OrderDirection } from "../../../generated/graphql";

export default function useIssueFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = (searchParams.get("query") ?? "").trim();
  const isSearching = query.length > 0;

  const state = (searchParams.get("state")?.toLocaleLowerCase() ?? "open") as "open" | "closed";
  const order = (searchParams.get("order") ?? "desc").toLowerCase();
  const sort = (searchParams.get("sort") ?? "created").toLowerCase();

  const orderBy = useMemo(
    () => ({
      field:
        sort === "comments"
          ? IssueOrderField.Comments
          : sort === "created"
            ? IssueOrderField.CreatedAt
            : IssueOrderField.UpdatedAt,
      direction: order === "asc" ? OrderDirection.Asc : OrderDirection.Desc,
    }),
    [sort, order],
  );

  const currentState = state === "closed" ? IssueState.Closed : IssueState.Open;

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

  return {
    query,
    isSearching,
    state,
    sort,
    order,
    orderBy,
    currentState,
    setParams,
    searchParams,
    setSearchParams,
  };
}
