import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import IssuesPage from "../IssuesPage";
import { IssuesDocument, IssueState } from "../../../../generated/graphql";
import { MemoryRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import IssuesDetailPage from "../IssuesDetailPage";
import userEvent from "@testing-library/user-event";

const mockVariables = {
  owner: "facebook",
  name: "react",
  states: [IssueState.Open],
  first: 12,
  after: null,
  orderBy: { field: "UPDATED_AT", direction: "DESC" }, // MUST MATCH COMPONENT EXACTLY
};

const loadingMock = [
  {
    request: {
      query: IssuesDocument,
      variables: mockVariables,
    },
    result: {
      data: {
        repository: {
          __typename: "Repository",
          openIssues: {
            __typename: "IssueConnection",
            totalCount: 0,
          },
          closedIssues: {
            __typename: "IssueConnection",
            totalCount: 0,
          },
          issues: {
            __typename: "IssueConnection",
            totalCount: 0,
            nodes: [],
          },
        },
      },
    },
    delay: Infinity, // Never resolve to keep it in loading state
  },
];

const successMock = [
  {
    request: {
      query: IssuesDocument,
      variables: mockVariables,
    },
    result: {
      data: {
        repository: {
          __typename: "Repository",
          openIssues: {
            __typename: "IssueConnection",
            totalCount: 844,
          },
          closedIssues: {
            __typename: "IssueConnection",
            totalCount: 13449,
          },
          issues: {
            __typename: "IssueConnection",
            totalCount: 844,
            nodes: [
              {
                __typename: "Issue",
                id: "I_kwDOAJy2Ks7QXe2x",
                number: 34775,
                title: "Bug: eslint-react-hooks false positives on refs rule",
                state: "OPEN",
                updatedAt: "2026-01-02T14:39:28Z",
                createdAt: "2025-10-08T14:59:23Z",
                comments: {
                  __typename: "IssueCommentConnection",
                  totalCount: 18,
                },
                author: {
                  __typename: "User",
                  login: "marcospgp",
                },
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
              {
                __typename: "Issue",
                id: "I_kwDOAJy2Ks7fdwJV",
                number: 35395,
                title:
                  "Perf: react-hooks ESLint plugin (eslint-plugin-react-hooks) rules are extremely slow, dominating lint time",
                state: "OPEN",
                updatedAt: "2026-01-01T23:21:15Z",
                createdAt: "2025-12-19T22:30:46Z",
                comments: {
                  __typename: "IssueCommentConnection",
                  totalCount: 4,
                },
                author: {
                  __typename: "User",
                  login: "jordan-cutler",
                },
                labels: {
                  __typename: "LabelConnection",
                  nodes: [],
                },
              },
            ],
          },
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
];

const errorMock = [
  {
    request: {
      query: IssuesDocument,
      variables: mockVariables,
    },
    error: new Error("An error occurred"),
  },
];

const emptyMock = [
  {
    request: {
      query: IssuesDocument,
      variables: mockVariables,
    },
    result: {
      data: {
        repository: {
          __typename: "Repository",
          openIssues: {
            __typename: "IssueConnection",
            totalCount: 0,
          },
          closedIssues: {
            __typename: "IssueConnection",
            totalCount: 0,
          },
          issues: {
            __typename: "IssueConnection",
            totalCount: 0,
            nodes: [],
          },
        },
      },
    },
  },
];

describe("IssuesPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should render the skeleton loader while loading", () => {
    render(
      <MockedProvider mocks={loadingMock} addTypename={false}>
        <MemoryRouter>
          <IssuesPage />
        </MemoryRouter>
      </MockedProvider>,
    );
    const skeleton = screen.getByTestId("issues-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("Should render issues list component correctly on successful data fetch", async () => {
    render(
      <MockedProvider mocks={successMock} addTypename={false}>
        <MemoryRouter>
          <IssuesPage />
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitForElementToBeRemoved(() => screen.queryByTestId("issues-skeleton"));
    expect(screen.getByText(/Bug: eslint-react-hooks/i)).toBeInTheDocument();
    expect(screen.getByText(/open 844/i)).toBeInTheDocument();
    expect(screen.getByText(/closed 13449/i)).toBeInTheDocument();
  });

  it("renders error message on data fetch error", async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <MemoryRouter>
          <IssuesPage />
        </MemoryRouter>
      </MockedProvider>,
    );

    const errorMessage = await screen.findByText(/Connection failed/i);
    const retryButton = await screen.findByRole("button", { name: /retry/i });

    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
  });

  describe("Issues list component", () => {
    it("Should render renders issue details correctly", async () => {
      render(
        <MockedProvider mocks={successMock} addTypename={false}>
          <MemoryRouter>
            <IssuesPage />
          </MemoryRouter>
        </MockedProvider>,
      );

      const issueTitle = await screen.findByText(
        /Bug: eslint-react-hooks false positives on refs rule/i,
      );

      const issueAuthor = await screen.findByText(/marcospgp/i);

      const issueLabel = await screen.findByText(/Type: Bug/i);

      expect(issueTitle).toBeInTheDocument();
      expect(issueLabel).toBeInTheDocument();
      expect(issueAuthor).toBeInTheDocument();
    });

    it("Should navigate to the issue detail view when clicking the title", async () => {
      const user = userEvent.setup();

      const { unmount } = render(
        //neeed to unmount, double renders otherwise
        <MockedProvider mocks={successMock} addTypename={false}>
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

      const issueNumber = issueLink.getAttribute("href");
      const cleanIssueNumber = issueNumber ? issueNumber.split("/issues/")[1] : null;

      await user.click(issueLink);

      const detailMessage = await screen.findByText(
        new RegExp(`the issue number is:${cleanIssueNumber}`, "i"),
      );
      expect(detailMessage).toBeInTheDocument();

      unmount();
    });

    it("Should render 'No issues found' when the call is successful but there are not issues", async () => {
      render(
        <MockedProvider mocks={emptyMock} addTypename={false}>
          <MemoryRouter>
            <IssuesPage />
          </MemoryRouter>
        </MockedProvider>,
      );

      const message = await screen.findByText(/No issues found/i);
      expect(message).toBeInTheDocument();
    });
  });
});
