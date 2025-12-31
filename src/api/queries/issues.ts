import { gql } from "@apollo/client";

export const REPO_ISSUES_QUERY = gql`
  query Issues(
    $owner: String!
    $name: String!
    $states: [IssueState!]
    $first: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, after: $after, states: $states) {
        totalCount
        nodes {
          id
          number
          title
          state
          updatedAt
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
