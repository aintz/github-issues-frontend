import {
  IssuesDocument,
  SearchIssuesDocument,
  IssueState,
  IssueOrderField,
  OrderDirection,
  IssueDetailDocument,
} from "../../../generated/graphql";

import type { IssuesQueryVariables } from "../../../generated/graphql";

const ITEMS_PER_PAGE = 12;

export const DEFAULT_OWNER = "facebook";
export const DEFAULT_REPO_NAME = "react";

export const DEFAULT_LIST_VARIABLES = {
  owner: "facebook",
  name: "react",
  states: [IssueState.Open],
  first: ITEMS_PER_PAGE,
  after: null,
  orderBy: { field: IssueOrderField.CreatedAt, direction: OrderDirection.Desc },
} satisfies IssuesQueryVariables;

export function makeIssuesErrorMock(overrides?: {
  variables?: Partial<typeof DEFAULT_LIST_VARIABLES>;
  message?: string;
}) {
  return {
    request: {
      query: IssuesDocument,
      variables: { ...DEFAULT_LIST_VARIABLES, ...(overrides?.variables ?? {}) },
    },
    error: new Error(overrides?.message ?? "Connection failed"),
  };
}

export function makeIssuesEmptySuccessMock(overrides?: {
  variables?: Partial<typeof DEFAULT_LIST_VARIABLES>;
  openCount?: number;
  closedCount?: number;
  totalCount?: number;
}) {
  return {
    request: {
      query: IssuesDocument,
      variables: { ...DEFAULT_LIST_VARIABLES, ...(overrides?.variables ?? {}) },
    },
    result: {
      data: {
        repository: {
          __typename: "Repository",
          openIssues: {
            __typename: "IssueConnection",
            totalCount: overrides?.openCount ?? 0,
          },
          closedIssues: {
            __typename: "IssueConnection",
            totalCount: overrides?.closedCount ?? 0,
          },
          issues: {
            __typename: "IssueConnection",
            totalCount: overrides?.totalCount ?? 0,
            pageInfo: {
              __typename: "PageInfo",
              hasNextPage: false,
              endCursor: null,
              hasPreviousPage: false,
              startCursor: null,
            },
            nodes: [],
          },
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  };
}

export const defaultOrderby = { field: "CREATED_AT", direction: "DESC" } as const;

export function makeListVariables(overrides?: Partial<Record<string, any>>) {
  return {
    owner: DEFAULT_OWNER,
    name: DEFAULT_REPO_NAME,
    states: [IssueState.Open],
    first: ITEMS_PER_PAGE,
    after: null,
    orderBy: defaultOrderby,
    ...overrides,
  };
}

export function makeSearchVariables(overrides?: Partial<Record<string, any>>) {
  return {
    query: "FULL_QUERY",
    openQuery: "COUNT_QUERY is:open",
    closedQuery: "COUNT_QUERY is:closed",
    first: ITEMS_PER_PAGE,
    after: null,
    ...overrides,
  };
}

export function makeRepositoryCountsMock({
  openCount = 0,
  closedCount = 0,
}: {
  openCount: number;
  closedCount: number;
}) {
  return {
    openIssues: {
      __typename: "IssueConnection",
      totalCount: openCount,
    },
    closedIssues: {
      __typename: "IssueConnection",
      totalCount: closedCount,
    },
  };
}

export function makeListConnection({
  totalCount = 0,
  nodes = [],
  endCursor = null,
  hasNextPage = false,
}: {
  totalCount?: number;
  nodes?: any[];
  endCursor?: string | null;
  hasNextPage?: boolean;
}) {
  return {
    __typename: "IssueConnection",
    totalCount,
    pageInfo: {
      __typename: "PageInfo",
      endCursor,
      hasNextPage,
    },
    nodes,
  };
}

export function makeSearchConnection({
  issueCount = 0,
  nodes = [],
  endCursor = null,
  hasNextPage = false,
  startCursor = null,
  hasPreviousPage = false,
}: {
  issueCount?: number;
  nodes?: any[];
  endCursor?: string | null;
  hasNextPage?: boolean;
  startCursor?: string | null;
  hasPreviousPage?: boolean;
}) {
  return {
    __typename: "SearchResultItemConnection",
    issueCount,
    pageInfo: {
      __typename: "PageInfo",
      endCursor,
      hasNextPage,
      startCursor,
      hasPreviousPage,
    },
    nodes,
  };
}

export function makeIssue(overrides?: Partial<any>) {
  return {
    __typename: "Issue",
    id: "I_kwDOAJy2Ks7QXe2x",
    number: 34775,
    title: "Bug: eslint-react-hooks false positives on refs rule",
    state: "OPEN",
    updatedAt: "2026-01-02T14:39:28Z",
    createdAt: "2025-10-08T14:59:23Z",
    comments: { __typename: "IssueCommentConnection", totalCount: 0 },
    author: { __typename: "User", login: "user" },
    labels: { __typename: "LabelConnection", nodes: [] },
    ...overrides,
  };
}

export function makeIssuesMock({ variables, repository }: { variables?: any; repository: any }) {
  return {
    request: {
      query: IssuesDocument,
      variables: makeListVariables(variables),
    },
    result: { data: { repository } },
  };
}

export function makeSearchMock({ variables, data }: { variables?: any; data: any }) {
  return {
    request: {
      query: SearchIssuesDocument,
      variables: makeSearchVariables(variables),
    },
    result: { data },
  };
}

export function makeIssuesSuccessMock(overrides?: {
  variables?: Partial<IssuesQueryVariables>;
  repository?: any;
}) {
  return {
    request: {
      query: IssuesDocument,
      variables: { ...DEFAULT_LIST_VARIABLES, ...(overrides?.variables ?? {}) },
    },
    result: {
      data: {
        repository: overrides?.repository,
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  };
}

export function makeIssueDetailSuccessMock(overrides?: {
  variables?: { owner?: string; name?: string; number: number };
  repository?: any;
}) {
  const owner = overrides?.variables?.owner ?? "facebook";
  const name = overrides?.variables?.name ?? "react";
  const number = overrides?.variables?.number;

  return {
    request: {
      query: IssueDetailDocument,
      variables: {
        owner,
        name,
        number,
      },
    },
    result: {
      data: {
        repository: overrides?.repository,
      },
    },
  };
}
