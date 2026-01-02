import type { IssueFieldsFragment } from "../generated/graphql";

export interface IssuesQueryData {
  repository: {
    issues: {
      totalCount: number;
      nodes: IssueFieldsFragment[] | null;
    } | null;
    openIssues: { totalCount: number } | null;
    closedIssues: { totalCount: number } | null;
  } | null;
}
