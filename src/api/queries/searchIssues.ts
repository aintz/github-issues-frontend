import { gql } from "@apollo/client";
import { ISSUE_FIELDS_FRAGMENT } from "../fragments/issue";

export const SEARCH_ISSUES_QUERY = gql`
  ${ISSUE_FIELDS_FRAGMENT}
  query SearchIssues($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: ISSUE, first: $first, after: $after) {
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
