import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getToken } from './pages/tokenStore.js';
import { GATEWAY_URL } from './config/gatewayUrl.js';

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
