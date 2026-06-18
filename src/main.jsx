import React from 'react'
import ReactDOM from 'react-dom/client'
import { HttpLink, gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import App from './App.jsx'
import './index.css'


const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000", credentials : "include" }),
  
  cache: new InMemoryCache(),
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,

)