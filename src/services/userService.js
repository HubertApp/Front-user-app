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
      notificationChannelsDisabled
      created_at
      updated_at
    }
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCES_MUTATION = gql`
  mutation UpdateNotificationPreferences($disabledChannels: [String!]!) {
    updateNotificationPreferences(disabledChannels: $disabledChannels) {
      googleId
      notificationChannelsDisabled
    }
  }
`;

const UNSUBSCRIBE_FROM_EMAILS_MUTATION = gql`
  mutation UnsubscribeFromEmails($googleId: String!) {
    unsubscribeFromEmails(googleId: $googleId)
  }
`;

export function useUnsubscribeFromEmails() {
  const [mutate, { loading, data, error }] = useMutation(
    UNSUBSCRIBE_FROM_EMAILS_MUTATION,
  );

  async function unsubscribeFromEmails(googleId) {
    const result = await mutate({ variables: { googleId } });
    return Boolean(result?.data?.unsubscribeFromEmails);
  }

  return { unsubscribeFromEmails, loading, data, error };
}

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

// GetUserResponse n'a pas de champ `id`, donc l'InMemoryCache d'Apollo ne
// normalise pas cet objet : le résultat de la mutation ne fusionne pas tout
// seul avec le cache de GET_ME_QUERY. On force un refetch pour rester simple
// et cohérent (même logique que useDeleteAccount qui vide tout le store).
export function useUpdateNotificationPreferences() {
  const [mutate, { loading }] = useMutation(
    UPDATE_NOTIFICATION_PREFERENCES_MUTATION,
    {
      refetchQueries: [{ query: GET_ME_QUERY }],
      awaitRefetchQueries: true,
    },
  );

  async function updateNotificationPreferences(disabledChannels) {
    await mutate({ variables: { disabledChannels } });
  }

  return { updateNotificationPreferences, loading };
}
