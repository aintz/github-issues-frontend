import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitForElementToBeRemoved, cleanup, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import IssuesDetailPage from "../pages/IssuesDetailPage";
import IssuesPage from "../pages/IssuesPage";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";
import {
  makeIssuesSuccessMock,
  makeIssuesErrorMock,
  makeIssuesEmptySuccessMock,
  makeIssueDetailSuccessMock,
} from "../test/mocks";
import { describe, it, expect, afterEach } from "vitest";
import {
  REPO_ISSUES_SUCCESS_FIXTURE,
  ISSUE_DETAIL_SUCCESS_FIXTURE,
  REPO_CLOSED_SUCCESS_FIXTURE,
} from "../test/fixtures";
import {
  IssueOrderField,
  IssueState,
  SearchIssuesDocument,
  OrderDirection,
} from "../../../generated/graphql";
describe("Issues List", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should render the skeleton loader while loading", () => {
    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={["/issues"]}>
          <Routes>
            <Route path="/issues" element={<IssuesPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    const skeleton = screen.getByTestId("issues-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("Should render issues list component correctly on successful data fetch", async () => {
    const successMock = [
      makeIssuesSuccessMock({
        repository: REPO_ISSUES_SUCCESS_FIXTURE,
      }),
    ];
    render(
      <MockedProvider mocks={successMock}>
        <MemoryRouter initialEntries={["/issues"]}>
          <Routes>
            <Route path="/issues" element={<IssuesPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("issues-skeleton"));

    expect(
      screen.getByText(/Bug: eslint-react-hooks false positives on refs rule/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/844/i)).toBeInTheDocument();
    expect(screen.getByText(/13449/i)).toBeInTheDocument();
  });

  it("Should render the error message when the data fetch fails", async () => {
    const errorMock = [
      makeIssuesErrorMock({
        message: "Failed to fetch issues",
      }),
    ];
    render(
      <MockedProvider mocks={errorMock}>
        <MemoryRouter initialEntries={["/issues"]}>
          <Routes>
            <Route path="/issues" element={<IssuesPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("issues-skeleton"));

    const errorMessage = await screen.findByText(/Error/i);
    const retryButton = await screen.findByRole("button", { name: /retry/i });

    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
  });

  it("Should render 'No issues found' when the call is successful but there are not issues", async () => {
    const emptyMocks = [
      makeIssuesEmptySuccessMock({
        openCount: 844,
        closedCount: 13449,
        totalCount: 0,
      }),
    ];
    render(
      <MockedProvider mocks={emptyMocks}>
        <MemoryRouter initialEntries={["/issues"]}>
          <Routes>
            <Route path="/issues" element={<IssuesPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("issues-skeleton"));

    const message = await screen.findByText(/No issues found/i);
    expect(message).toBeInTheDocument();
  });

  it("Should navigate to the issue detail view when clicking the title", async () => {
    const user = userEvent.setup();
    const mocks = [
      makeIssuesSuccessMock({ repository: REPO_ISSUES_SUCCESS_FIXTURE }),
      makeIssueDetailSuccessMock({
        variables: { number: 34775 },
        repository: ISSUE_DETAIL_SUCCESS_FIXTURE,
      }),
    ];
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<IssuesPage />} />
            <Route path="/issues/:number" element={<IssuesDetailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    const issueLink = await screen.findByRole("link", {
      name: /Bug: eslint-react-hooks false positives on refs rule/i,
    });

    expect(issueLink).toBeInTheDocument();
    expect(issueLink).toHaveAttribute("href", "/issues/34775");

    await user.click(issueLink);

    const title = await screen.findByRole("heading", {
      level: 1,
      name: /Bug: eslint-react-hooks false positives on refs rule/i,
    });

    expect(title).toBeInTheDocument();
  });

  describe("Issues filtering", () => {
    it("Should read state=open/closed from the URL and highlights the correct filter", async () => {
      const mocks = [
        makeIssuesSuccessMock({
          repository: REPO_ISSUES_SUCCESS_FIXTURE,
          variables: { states: [IssueState.Open] },
        }),
      ];

      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter initialEntries={["/issues?state=closed"]}>
            <Routes>
              <Route path="/issues" element={<IssuesPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      const closedButton = await screen.findByRole("button", { name: /closed/i });
      const openButton = await screen.findByRole("button", { name: /open/i });

      expect(closedButton).toHaveClass("text-gh-text");
      expect(openButton).toHaveClass("text-gh-gray");
    });

    it("Should read the ordering and sorting from the URL and set the correct dropdown values", async () => {
      const mocks = [
        makeIssuesSuccessMock({
          repository: REPO_ISSUES_SUCCESS_FIXTURE,
          variables: {
            orderBy: { field: IssueOrderField.CreatedAt, direction: OrderDirection.Desc },
          },
        }),
      ];
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter initialEntries={["/issues?state=closed"]}>
            <Routes>
              <Route path="/issues" element={<IssuesPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      const filterButton = await screen.findByRole("button", { name: /created on/i });
      const svgIcon = await screen.findByTestId("desc-icon");

      expect(filterButton).toBeInTheDocument();
      expect(svgIcon).toBeInTheDocument();
    });

    it("Should update the URL and renders issues for that state when clicking the filters", async () => {
      const user = userEvent.setup();
      const mocks = [
        makeIssuesSuccessMock({
          repository: REPO_ISSUES_SUCCESS_FIXTURE,
          variables: { states: [IssueState.Open] },
        }),
        makeIssuesSuccessMock({
          repository: REPO_CLOSED_SUCCESS_FIXTURE, //the succcess already ha open issues, this is why i created a new fixture for closed
          variables: { states: [IssueState.Closed] },
        }),
      ];

      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter initialEntries={["/issues?state=open"]}>
            <Routes>
              <Route path="/issues" element={<IssuesPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      const openTitle = await screen.findByText(
        /Bug: eslint-react-hooks false positives on refs rule/i,
      );
      expect(openTitle).toBeInTheDocument();

      const closedButton = await screen.findByRole("button", { name: /closed/i });
      await user.click(closedButton);

      const closedTitle = await screen.findByText(/Closed issue title/i);
      expect(closedTitle).toBeInTheDocument();
    });

    it("Should show open/closed counts in the filter buttons", async () => {
      const mocks = [
        makeIssuesSuccessMock({
          repository: REPO_ISSUES_SUCCESS_FIXTURE,
          variables: { states: [IssueState.Open] },
        }),
      ];

      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter initialEntries={["/issues?state=open"]}>
            <Routes>
              <Route path="/issues" element={<IssuesPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      await waitForElementToBeRemoved(() => screen.getByTestId("issues-skeleton"));
      const openButton = await screen.findByRole("button", { name: /open/i });
      const closedButton = await screen.findByRole("button", { name: /closed/i });
      expect(within(openButton).getByText("844")).toBeInTheDocument();
      expect(within(closedButton).getByText("13449")).toBeInTheDocument();
    });
  });

  describe("Issues search bar", () => {
    vi.mock("../../../helpers/helperBuildIssueSearchQuery", () => ({
      buildIssueSearchQuery: vi.fn((_, opts) => {
        if (opts?.includeState === false) return "COUNT_QUERY";
        return "FULL_QUERY";
      }),
    }));

    function LocationDisplay() {
      const location = useLocation();
      return <div data-testid="location-display">{location.search}</div>;
    }

    function renderIssuesPage(mocks: any[], initialEntry: string) {
      return render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route
                path="/issues"
                element={
                  <>
                    <IssuesPage />
                    <LocationDisplay />
                  </>
                }
              />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );
    }

    it("Should prefills the input from the URL query param", async () => {
      const mocks = [
        {
          request: {
            query: SearchIssuesDocument,
            variables: {
              query: "FULL_QUERY",
              openQuery: "COUNT_QUERY is:open",
              closedQuery: "COUNT_QUERY is:closed",
              first: 12,
              after: null,
            },
          },
          result: {
            data: {
              open: { __typename: "SearchResultItemConnection", issueCount: 0 },
              closed: { __typename: "SearchResultItemConnection", issueCount: 0 },
              results: {
                __typename: "SearchResultItemConnection",
                issueCount: 0,
                pageInfo: {
                  __typename: "PageInfo",
                  endCursor: null,
                  hasNextPage: false,
                  startCursor: null,
                  hasPreviousPage: false,
                },
                nodes: [],
              },
            },
          },
        },
      ];
      renderIssuesPage(mocks, "/issues?query=spam");

      const searchInputPlaceholder = await screen.findByPlaceholderText(/Search issues/i);
      expect(searchInputPlaceholder).toHaveValue("spam");
    });

    it("Should update the url and render matching result when submitting a search", async () => {
      const user = userEvent.setup();

      const listMock = makeIssuesSuccessMock({
        repository: REPO_ISSUES_SUCCESS_FIXTURE,
        variables: { states: [IssueState.Open] },
      });

      const searchMock = {
        request: {
          query: SearchIssuesDocument,
          variables: {
            query: "FULL_QUERY",
            openQuery: "COUNT_QUERY is:open",
            closedQuery: "COUNT_QUERY is:closed",
            first: 12,
            after: null,
          },
        },
        result: {
          data: {
            open: { __typename: "SearchResultItemConnection", issueCount: 10 },
            closed: { __typename: "SearchResultItemConnection", issueCount: 20 },
            results: {
              __typename: "SearchResultItemConnection",
              issueCount: 30,
              pageInfo: {
                __typename: "PageInfo",
                endCursor: null,
                hasNextPage: false,
                startCursor: null,
                hasPreviousPage: false,
              },
              nodes: [
                {
                  __typename: "Issue",
                  id: "I_kwDOAJy2Ks7QXe2x",
                  number: 100,
                  title: "Search spam issue",
                  state: IssueState.Open,
                  createdAt: "2025-10-08T14:59:23Z",
                  updatedAt: "2026-01-02T14:39:28Z",
                  comments: { __typename: "IssueCommentConnection", totalCount: 1 },
                  author: { __typename: "User", login: "searcher" },
                  labels: {
                    __typename: "LabelConnection",
                    nodes: [
                      {
                        __typename: "Label",
                        id: "MDU6TGFiZWw0MDkyOTE1MQ==",
                        name: "Type: Bug",
                        color: "b60205",
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      };

      renderIssuesPage([listMock, searchMock], "/issues");

      const searchInput = await screen.findByPlaceholderText(/Search issues/i);
      await user.clear(searchInput);
      await user.type(searchInput, "spam");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByTestId("location-display")).toHaveTextContent("query=spam");
      });
    });

    it("Should render 'No issues found' when no issues match the search query", async () => {
      const emptySearchMock = {
        request: {
          query: SearchIssuesDocument,
          variables: {
            query: "FULL_QUERY",
            openQuery: "COUNT_QUERY is:open",
            closedQuery: "COUNT_QUERY is:closed",
            first: 12,
            after: null,
          },
        },
        result: {
          data: {
            open: { __typename: "SearchResultItemConnection", issueCount: 10 },
            closed: { __typename: "SearchResultItemConnection", issueCount: 20 },
            results: {
              __typename: "SearchResultItemConnection",
              issueCount: 0,
              pageInfo: {
                __typename: "PageInfo",
                endCursor: null,
                hasNextPage: false,
                startCursor: null,
                hasPreviousPage: false,
              },
              nodes: [],
            },
          },
        },
      };

      renderIssuesPage([emptySearchMock], "/issues?query=spam");
      const notFound = await screen.findByText(/No issues found/i);
      expect(notFound).toBeInTheDocument();
    });

    it("Should render error message when the search query fails", async () => {
      const errorMocks = [
        {
          request: {
            query: SearchIssuesDocument,
            variables: {
              query: "FULL_QUERY",
              openQuery: "COUNT_QUERY is:open",
              closedQuery: "COUNT_QUERY is:closed",
              first: 12,
              after: null,
            },
          },
          error: new Error("Search failed"),
        },
      ];
      renderIssuesPage(errorMocks, "/issues?query=spam");

      const errorMessage = await screen.findByText(/Error/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    function LocationDisplay() {
      const location = useLocation();
      return <div data-testid="location-display">{location.search}</div>;
    }
    function renderIssuesPage(mocks: any[], initialEntry: string) {
      return render(
        <MockedProvider
          mocks={mocks}
          defaultOptions={{
            watchQuery: { fetchPolicy: "no-cache" },
            query: { fetchPolicy: "no-cache" },
          }}
        >
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route
                path="/issues"
                element={
                  <>
                    <IssuesPage />
                    <LocationDisplay />
                  </>
                }
              />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );
    }

    it("Should load page 2 results when clickin the next button", async () => {
      const user = userEvent.setup();
      const repoPage1 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_1",
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],
              title:
                "react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice",
            },
          ],
        },
      };
      const repoPage2 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_2",
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],

              title:
                "Cannot reorder children for suspense node '333' because no matching node was found in the Store.",
            },
          ],
        },
      };
      const mocks = [
        makeIssuesSuccessMock({
          variables: { after: null, states: [IssueState.Open] },
          repository: repoPage1,
        }),
        makeIssuesSuccessMock({
          variables: { after: "CURSOR_PAGE_1", states: [IssueState.Open] },
          repository: repoPage2,
        }),
      ];

      renderIssuesPage(mocks, "/issues?state=open&page=1");

      const issueTitlePage1 = await screen.findByRole("link", {
        name: /react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice/i,
      });
      expect(issueTitlePage1).toBeInTheDocument();

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      const issueTitlePage2 = await screen.findByRole("link", {
        name: /Cannot reorder children for suspense node '333' because no matching node was found in the Store./i,
      });
      expect(issueTitlePage2).toBeInTheDocument();
    });

    it("Should return to page 1 when clicking previous from page 2", async () => {
      const user = userEvent.setup();
      const repoPage1 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_1",
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],
              title:
                "react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice",
            },
          ],
        },
      };
      const repoPage2 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_2",
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],

              title:
                "Cannot reorder children for suspense node '333' because no matching node was found in the Store.",
            },
          ],
        },
      };
      const mocks = [
        makeIssuesSuccessMock({
          variables: { after: null, states: [IssueState.Open] },
          repository: repoPage1,
        }),
        makeIssuesSuccessMock({
          variables: { after: "CURSOR_PAGE_1", states: [IssueState.Open] },
          repository: repoPage2,
        }),
        makeIssuesSuccessMock({
          variables: { after: null, states: [IssueState.Open] },
          repository: repoPage1,
        }),
      ];

      renderIssuesPage(mocks, "/issues?state=open&page=1");

      const issueTitlePage1 = await screen.findByRole("link", {
        name: /react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice/i,
      });
      expect(issueTitlePage1).toBeInTheDocument();

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId("location-display")).toHaveTextContent("page=2");
      });

      const issueTitlePage2 = await screen.findByRole("link", {
        name: /Cannot reorder children for suspense node '333' because no matching node was found in the Store./i,
      });
      expect(issueTitlePage2).toBeInTheDocument();

      const previousButton = screen.getByRole("button", { name: /previous/i });
      await user.click(previousButton);
      await waitFor(() => {
        expect(screen.getByTestId("location-display")).toHaveTextContent("page=1");
      });

      const backToPage1Title = await screen.findByRole("link", {
        name: /react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice/i,
      });
      expect(backToPage1Title).toBeInTheDocument();
    });

    it("Should disabled next button on last page", async () => {
      const user = userEvent.setup();
      const repoPage1 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_1",
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],
              title:
                "react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice",
            },
          ],
        },
      };
      const repoPage2 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_2",
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],

              title:
                "Cannot reorder children for suspense node '333' because no matching node was found in the Store.",
            },
          ],
        },
      };
      const mocks = [
        makeIssuesSuccessMock({
          variables: { after: null, states: [IssueState.Open] },
          repository: repoPage1,
        }),
        makeIssuesSuccessMock({
          variables: { after: "CURSOR_PAGE_1", states: [IssueState.Open] },
          repository: repoPage2,
        }),
      ];

      renderIssuesPage(mocks, "/issues?state=open&page=1");

      const issueTitlePage1 = await screen.findByRole("link", {
        name: /react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice/i,
      });
      expect(issueTitlePage1).toBeInTheDocument();

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      const issueTitlePage2 = await screen.findByRole("link", {
        name: /Cannot reorder children for suspense node '333' because no matching node was found in the Store./i,
      });
      expect(issueTitlePage2).toBeInTheDocument();

      const newNextButton = await screen.findByRole("button", { name: /next/i });
      expect(newNextButton).toBeDisabled();
    });

    it("Should disabled previous button on first page", async () => {
      const repoPage1 = {
        ...REPO_ISSUES_SUCCESS_FIXTURE,
        id: "repo_1",
        issues: {
          ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
          totalCount: 13,
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "CURSOR_PAGE_1",
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
          },
          nodes: [
            {
              ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],
              title:
                "react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice",
            },
          ],
        },
      };

      const mocks = [
        makeIssuesSuccessMock({
          variables: { after: null, states: [IssueState.Open] },
          repository: repoPage1,
        }),
      ];

      renderIssuesPage(mocks, "/issues?state=open&page=1");

      const issueTitlePage1 = await screen.findByRole("link", {
        name: /react-reconciler: flushSync was renamed to flushSyncFromReconciler without deprecation notice/i,
      });
      expect(issueTitlePage1).toBeInTheDocument();

      const prevButton = await screen.findByRole("button", { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });
  });
});
