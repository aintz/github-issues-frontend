export interface Issue {
  id: string;
  number: number;
  title: string;
  state: "OPEN" | "CLOSED";
  updatedAt: string;
  createdAt: string;
  comments: { totalCount: number };
  author?: { login: string } | null;
  labels: { nodes: Array<{ id: string; name: string; color: string }> };
}

export interface IssuesQueryData {
  repository: {
    issues: {
      totalCount: number;
      nodes: Issue[] | null;
    } | null;
    openIssues: { totalCount: number } | null;
    closedIssues: { totalCount: number } | null;
  } | null;
}
