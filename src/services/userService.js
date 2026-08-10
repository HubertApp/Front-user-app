import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const GET_ME = gql`
  query GetMe {
    getMe {
      googleId
      email
      age
      pseudo
      photo
      role
      created_at
      updated_at
    }
  }
`;

// Hook partagé par toute page/composant ayant besoin de l'utilisateur
// connecté (AccountPage, AuthPages...), pour éviter de dupliquer la query.
export function useCurrentUser() {
  const { loading, error, data } = useQuery(GET_ME);
  return { loading, error, user: data?.getMe ?? null };
}
