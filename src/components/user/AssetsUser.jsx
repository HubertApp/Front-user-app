import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React from "react";

export default function AssetUser() {
  const TEST_QUERY = gql`
    query GetMe {
      getMe {
        googleId
        email
        age
        pseudo
        role
      }
    }
  `;

  const { loading, error, data } = useQuery(TEST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data?.getMe?.email}</p>
      <p>{data?.getMe?.role}</p>
    </div>
  );
}