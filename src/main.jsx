import React from 'react'
import ReactDOM from 'react-dom/client'
import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from '@apollo/client/link/context';
import App from './App.jsx'
import './index.css'
import { getToken } from './pages/tokenStore.js';
const httpLink = new HttpLink({ uri: "http://localhost:4000", credentials: "include" });

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
)
