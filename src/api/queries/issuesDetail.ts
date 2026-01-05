import { gql } from "@apollo/client";

export const ISSUE_DETAIL_QUERY = gql`
  query IssueDetail($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        number
        title
        body
        bodyHTML
        state
        createdAt
        updatedAt
        url
        author {
          login
          avatarUrl
          url
        }
        labels(first: 10) {
          nodes {
            id
            name
            color
          }
        }
        reactions(content: THUMBS_UP) {
          totalCount
        }
        comments(first: 20) {
          totalCount
          pageInfo {
            hasNextPage
          }
          nodes {
            id
            body
            bodyHTML
            createdAt
            updatedAt
            lastEditedAt
            author {
              login
              avatarUrl
              url
            }
            reactions(content: THUMBS_UP) {
              totalCount
            }
          }
        }
      }
    }
  }
`;
