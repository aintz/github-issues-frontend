type sortParams = "created" | "updated" | "comments";
type orderParams = "asc" | "desc";

export function buildIssueSearchQuery(params: URLSearchParams) {
  const query = params.get("q") || "";
  if (!query) return;

  const state = (params.get("state") ?? "open").toLowerCase();
  const sort = ((params.get("sort") ?? "created").toLowerCase() as sortParams) || "created";
  const order = ((params.get("order") ?? "desc").toLowerCase() as orderParams) || "desc";

  const statePrefix = state === "open" ? "state:open" : "state:closed";
  const sortPrefix = `sort:${sort}-${order}`;

  const result = [
    "repo:facebook/react",
    "is:issue",
    statePrefix,
    sortPrefix,
    "in:title,body",
    query,
  ].join(" ");

  return result;
}
