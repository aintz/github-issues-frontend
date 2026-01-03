import { gql } from "@apollo/client";
import { ISSUE_FIELDS_FRAGMENT } from "../fragments/issue";

export const SEARCH_ISSUES_QUERY = gql`
  ${ISSUE_FIELDS_FRAGMENT}
  query SearchIssues(
    $query: String!
    $first: Int!
    $after: String
    $openQuery: String!
    $closedQuery: String!
  ) {
    open: search(query: $openQuery, type: ISSUE, first: 1) {
      issueCount
    }
    closed: search(query: $closedQuery, type: ISSUE, first: 1) {
      issueCount
    }

    results: search(query: $query, type: ISSUE, first: $first, after: $after) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
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
