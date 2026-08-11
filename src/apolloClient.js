import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getToken } from './pages/tokenStore.js';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

const httpLink = new HttpLink({ uri: GATEWAY_URL, credentials: "include" });

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
