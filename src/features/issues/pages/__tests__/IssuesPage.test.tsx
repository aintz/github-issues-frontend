import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import IssuesPage from "../pages/IssuesPage";
import type { IssuesQueryData, Issue } from "../../../types/types";
import { REPO_ISSUES_QUERY } from "../../../../api/queries/issues";

const mockVariables = {
  owner: "facebook",
  name: "react",
  states: ["OPEN"],
  first: 12,
  after: null,
  orderBy: { field: "UPDATED_AT", direction: "DESC" },
};

const successMock = {
  request: {
    query: REPO_ISSUES_QUERY,
    variables: mockVariables,
  },
  result: {
    data: {
      repository: {
        openIssues: { totalCount: 2 },
        closedIssues: { totalCount: 3 },
        issues: {
          totalCount: 2,
          nodes: [
            {
              id: "I_kwDOAJy2Ks60CBkX",
              number: 33021,
              title: "[react-refresh] no changelog found",
              state: "OPEN",
              createdAt: "2025-04-25T15:51:40Z",
              updatedAt: "2025-12-31T17:04:59Z",
              comments: { totalCount: 4 },
              author: { login: "ImLunaHey" },
              labels: {
                nodes: [
                  { id: "MDU6TGFiZWwxNTU5ODQxNjA=", name: "Status: Unconfirmed", color: "d4c5f9" },
                  { id: "MDU6TGFiZWwxNzc1OTU3MTgy", name: "Resolution: Stale", color: "e6e6e6" },
                ],
              },
            },
            {
              id: "I_kwDOAJy2Ks6iYX8y",
              number: 31692,
              title: "Bug: Regression with defaultProps on class components",
              state: "OPEN",
              createdAt: "2024-12-07T03:16:52Z",
              updatedAt: "2025-12-31T12:09:49Z",
              comments: { totalCount: 9 },
              author: { login: "henryqdineen" },
              labels: {
                nodes: [
                  { id: "MDU6TGFiZWwxNTU5ODQxNjA=", name: "Status: Unconfirmed", color: "d4c5f9" },
                  { id: "MDU6TGFiZWwxNzc1OTU3MTgy", name: "Resolution: Stale", color: "e6e6e6" },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

const errorMock = {
  request: {
    query: REPO_ISSUES_QUERY,
    variables: mockVariables,
  },
  error: new Error("An error occurred"),
};

describe("IssuesPage", () => {
  it("renders the skeleton loader while loading");
  it("renders issues list component correctly on successful data fetch");
  it("renders error message on data fetch error");

  describe("Issues list component", () => {
    it("renders the first page with 12 issues");
    it("renders issue details correctly");
    it("renders labels correctly");
    it("navigates to the issue detail view when clicking the title");
    it("handles no issues case gracefully");
  });

  describe("Issues Filtering", () => {
    it("Should change the button style based on the selected filter");
    it("Should render closed issues when state is closed");
    it("Should render open issues when state is open");
    it("Should render open issues when no state is selected");
  });
});
