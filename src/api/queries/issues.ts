import { gql } from "@apollo/client";
import { ISSUE_FIELDS_FRAGMENT } from "../fragments/issue";

export const REPO_ISSUES_QUERY = gql`
  ${ISSUE_FIELDS_FRAGMENT}
  query Issues(
    $owner: String!
    $name: String!
    $states: [IssueState!]
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: IssueOrder = { field: UPDATED_AT, direction: DESC }
  ) {
    repository(owner: $owner, name: $name) {
      id
      openIssues: issues(states: [OPEN]) {
        totalCount
      }
      closedIssues: issues(states: [CLOSED]) {
        totalCount
      }
      issues(
        first: $first
        last: $last
        after: $after
        before: $before
        states: $states
        orderBy: $orderBy
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        nodes {
          ...IssueFields
          labels(first: 5) {
            nodes {
              id
              name
              color
            }
          }
        }
      }
    }
  }
`;
