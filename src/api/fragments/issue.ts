import { gql } from "@apollo/client";

export const ISSUE_FIELDS_FRAGMENT = gql`
  fragment IssueFields on Issue {
    id
    number
    title
    state
    createdAt
    updatedAt
    comments {
      totalCount
    }
    author {
      login
    }
  }
`;
