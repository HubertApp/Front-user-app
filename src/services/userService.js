import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import { clearToken } from '../pages/tokenStore';

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser {
    removeUser
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    getMe {
      googleId
      email
      age
      pseudo
      role
      photo
      created_at
      updated_at
    }
  }
`;

export function useCurrentUser(options = {}) {
  const { loading, data, error, refetch } = useQuery(GET_ME_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    ...options,
  });

  return {
    user: data?.getMe ?? null,
    loading,
    error,
    refetch,
  };
}

export function useLogout() {
  const client = useApolloClient();

  return async function logout() {
    await clearToken();
    await client.clearStore();
  };
}

export function useDeleteAccount() {
  const client = useApolloClient();
  const [removeUserMutation, { loading }] = useMutation(REMOVE_USER_MUTATION);

  async function deleteAccount() {
    await removeUserMutation();
    await clearToken();
    await client.clearStore();
  }

  return { deleteAccount, loading };
}
