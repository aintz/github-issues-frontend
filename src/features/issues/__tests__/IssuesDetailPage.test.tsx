import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen, waitForElementToBeRemoved, cleanup, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import IssuesPage from "../pages/IssuesPage";
import IssuesDetailPage from "../pages/IssuesDetailPage";
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
import { SearchIssuesDocument } from "../../../generated/graphql";
import { IssueDetailDocument } from "../../../generated/graphql";

describe("Issue Detail Page", () => {
  afterEach(() => {
    cleanup();
  });

  function renderDetail(mocks: any[], initialEntry: string) {
    return render(
      <MockedProvider mocks={mocks} addTypename>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/issues/:number" element={<IssuesDetailPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
  }

  it("Should show 'Issue not found' when the route param is invalid", () => {
    renderDetail([], "/issues/test");
    expect(screen.getByRole("heading", { name: /issue not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to issues/i })).toHaveAttribute(
      "href",
      "/issues",
    );
  });

  it("Should render the skeleton UI while fetching", () => {
    const loadingMock = [
      {
        request: {
          query: IssueDetailDocument,
          variables: { owner: "facebook", name: "react", number: 34775 },
        },
        result: {
          data: {
            repository: {
              __typename: "Repository",
              id: "repo_1",
              issue: {
                __typename: "Issue",
                id: "I_kwDOAJy2Ks7QXe2x",
                number: 34775,
                title: "Bug: eslint-react-hooks false positives on refs rule",
                state: "OPEN",
                createdAt: "2025-10-08T14:59:23Z",
                updatedAt: "2026-01-02T14:39:28Z",
                bodyHTML: "<p>body</p>",
                author: { __typename: "User", login: "user", avatarUrl: null, url: null },
                reactions: { __typename: "ReactionConnection", totalCount: 0 },
                comments: { __typename: "IssueCommentConnection", totalCount: 0, nodes: [] },
                labels: { __typename: "LabelConnection", nodes: [] },
              },
            },
          },
        },
        delay: Infinity,
      },
    ];
    renderDetail(loadingMock, "/issues/34775");

    const skeleton = screen.getByTestId("comment-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("Should show the error UI with retry when the query fails", async () => {
    const errorMock = [
      {
        request: {
          query: IssueDetailDocument,
          variables: { owner: "facebook", name: "react", number: 34775 },
        },
        error: new Error("Error loading issue"),
      },
    ];
    renderDetail(errorMock, "/issues/34775");
    expect(await screen.findByRole("heading", { name: / Error!/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to issues/i })).toHaveAttribute(
      "href",
      "/issues",
    );
  });

  it("Should show issue details, comments and labels on success", async () => {
    const successMock = [
      {
        request: {
          query: IssueDetailDocument,
          variables: { owner: "facebook", name: "react", number: 34775 },
        },
        result: {
          data: {
            repository: {
              __typename: "Repository",
              id: "repo_1",
              issue: {
                __typename: "Issue",
                id: "fSdfgdsfgDFSfsjjkl",
                number: 34775,
                title: "Bug: eslint-react-hooks false positives on refs rule",
                state: "OPEN",
                createdAt: "2025-10-08T14:59:23Z",
                updatedAt: "2026-01-02T14:39:28Z",
                bodyHTML: "<p>Issue body</p>",
                author: {
                  __typename: "User",
                  login: "marcospgp",
                  avatarUrl: null,
                  url: null,
                },
                reactions: { __typename: "ReactionConnection", totalCount: 2 },
                labels: {
                  __typename: "LabelConnection",
                  nodes: [{ __typename: "Label", id: "L1", name: "Type: Bug", color: "b60205" }],
                },
                comments: {
                  __typename: "IssueCommentConnection",
                  totalCount: 1,
                  nodes: [
                    {
                      __typename: "IssueComment",
                      id: "C1",
                      createdAt: "2025-12-19T22:30:46Z",
                      bodyHTML: "<p>First comment</p>",
                      author: {
                        __typename: "User",
                        login: "jordan-cutler",
                        avatarUrl: null,
                        url: null,
                      },
                      reactions: { __typename: "ReactionConnection", totalCount: 1 },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ];
    renderDetail(successMock, "/issues/34775");

    expect(
      await screen.findByRole("heading", {
        name: /Bug: eslint-react-hooks false positives on refs rule/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/^OPEN$/i)).toBeInTheDocument();

    expect(screen.getByText(/labels/i)).toBeInTheDocument();
    expect(screen.getByText(/Type: Bug/i)).toBeInTheDocument();

    expect(screen.getByText(/First comment/i)).toBeInTheDocument();
  });
});
