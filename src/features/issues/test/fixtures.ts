export const REPO_ISSUES_SUCCESS_FIXTURE = {
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

    pageInfo: {
      __typename: "PageInfo",
      endCursor: "CURSOR_PAGE_1",
      hasNextPage: true,
    },

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
} as const;

export const ISSUE_DETAIL_SUCCESS_FIXTURE = {
  __typename: "Repository",
  issue: {
    __typename: "Issue",
    id: "I_kwDOAJy2Ks7QXe2x",
    number: 34775,
    title: "Bug: eslint-react-hooks false positives on refs rule",
    state: "OPEN",
    createdAt: "2025-10-08T14:59:23Z",
    bodyHTML: "<p>Issue body</p>",

    author: {
      __typename: "User",
      login: "marcospgp",
      avatarUrl: null,
      url: null,
    },

    reactions: {
      __typename: "ReactionConnection",
      totalCount: 0,
    },

    comments: {
      __typename: "IssueCommentConnection",
      totalCount: 0,
      nodes: [],
    },

    labels: {
      __typename: "LabelConnection",
      nodes: [],
    },
  },
} as const;

export const REPO_CLOSED_SUCCESS_FIXTURE = {
  ...REPO_ISSUES_SUCCESS_FIXTURE,
  issues: {
    ...REPO_ISSUES_SUCCESS_FIXTURE.issues,
    totalCount: 1200,
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "CURSOR_CLOSED_PAGE_1",
      hasNextPage: true,
    },
    nodes: [
      {
        ...REPO_ISSUES_SUCCESS_FIXTURE.issues.nodes[0],
        id: "I_kwDOAJy2Ks7QXe2x",
        number: 34775,
        title: "Closed issue title",
        state: "CLOSED",
      },
    ],
  },
} as const;
