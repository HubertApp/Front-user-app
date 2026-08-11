import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from "@apollo/client/react";
import { client } from './apolloClient.js';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
)
