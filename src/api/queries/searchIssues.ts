import { gql } from "@apollo/client";
import { ISSUE_FIELDS_FRAGMENT } from "../fragments/issue";

export const SEARCH_ISSUES_QUERY = gql`
  ${ISSUE_FIELDS_FRAGMENT}
  query SearchIssues(
    $query: String!
    $first: Int!
    $after: String
    $last: Int
    $before: String
    $openQuery: String!
    $closedQuery: String!
  ) {
    open: search(query: $openQuery, type: ISSUE, first: 1) {
      issueCount
    }
    closed: search(query: $closedQuery, type: ISSUE, first: 1) {
      issueCount
    }

    results: search(
      query: $query
      type: ISSUE
      first: $first
      last: $last
      after: $after
      before: $before
    ) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      nodes {
        ... on Issue {
          ...IssueFields
          labels(first: 5) {
            nodes {
              name
              color
            }
          }
        }
      }
    }
  }
`;
