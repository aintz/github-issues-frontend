import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const token = import.meta.env.VITE_GH_TOKEN as string;

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }),
  cache: new InMemoryCache(),
});
