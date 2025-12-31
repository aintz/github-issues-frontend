export interface Issue {
  id: string;
  number: number;
  title: string;
  state: "OPEN" | "CLOSED";
  updatedAt: string;
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
  } | null;
}
