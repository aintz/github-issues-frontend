import { gql } from "@apollo/client";

export const REPO_ISSUES_QUERY = gql`
  query Issues(
    $owner: String!
    $name: String!
    $states: [IssueState!]
    $first: Int!
    $after: String
    $orderBy: IssueOrder = { field: UPDATED_AT, direction: DESC }
  ) {
    repository(owner: $owner, name: $name) {
      openIssues: issues(states: [OPEN]) {
        totalCount
      }
      closedIssues: issues(states: [CLOSED]) {
        totalCount
      }
      issues(first: $first, after: $after, states: $states, orderBy: $orderBy) {
        totalCount
        nodes {
          id
          number
          title
          state
          updatedAt
          createdAt
          comments {
            totalCount
          }
          author {
            login
          }
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
