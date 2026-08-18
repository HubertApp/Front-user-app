import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

export const GET_ALL_NOTIFICATIONS_QUERY = gql`
  query GetAllNotifications {
    getAllNotifications {
      id
      content
      type
      source
      triggeredBy
      isRead
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`;

export function useNotifications() {
  const { data, loading, error } = useQuery(GET_ALL_NOTIFICATIONS_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
  });

  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION, {
    update(cache, { data: mutationData }) {
      const readId = mutationData?.markNotificationAsRead?.id;
      if (!readId) return;

      cache.modify({
        fields: {
          getAllNotifications(existingRefs = [], { readField }) {
            return existingRefs.filter((ref) => readField('id', ref) !== readId);
          },
        },
      });

      cache.evict({ id: cache.identify({ __typename: 'Notification', id: readId }) });
      cache.gc();
    },
  });

  async function markAsRead(id) {
    await markAsReadMutation({ variables: { id } });
  }

  return {
    notifications: data?.getAllNotifications ?? [],
    loading,
    error,
    markAsRead,
  };
}
