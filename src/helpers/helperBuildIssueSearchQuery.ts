type sortParams = "created" | "updated" | "comments";
type orderParams = "asc" | "desc";

export function buildIssueSearchQuery(
  params: URLSearchParams,
  opts?: { includeState?: boolean },
): string {
  const query = params.get("query") || "";
  if (!query) return "";

  const includeState = opts?.includeState ?? true;
  const state = (params.get("state") ?? "open").toLowerCase();
  const sort = (params.get("sort") ?? "created").toLowerCase() as sortParams;
  const order = (params.get("order") ?? "desc").toLowerCase() as orderParams;

  const statePrefix = state === "open" ? "state:open" : "state:closed";
  const sortPrefix = `sort:${sort}-${order}`;

  const result = [
    "repo:facebook/react",
    "is:issue",
    includeState ? statePrefix : "",
    sortPrefix,
    "in:title,body",
    query,
  ]
    .filter(Boolean)
    .join(" ");

  return result;
}
