import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import DesabonnementPage from '../../src/pages/DesabonnementPage';

// UNSUBSCRIBE_FROM_EMAILS_MUTATION n'est pas exportée (mutation publique,
// délibérément non liée au reste du service utilisateur), on inline ici la
// même query que celle définie dans userService.js.
import { gql } from '@apollo/client';

const UNSUBSCRIBE_FROM_EMAILS_MUTATION = gql`
  mutation UnsubscribeFromEmails($googleId: String!) {
    unsubscribeFromEmails(googleId: $googleId)
  }
`;

function unsubscribeMock(googleId, ok) {
  return {
    request: { query: UNSUBSCRIBE_FROM_EMAILS_MUTATION, variables: { googleId } },
    result: { data: { unsubscribeFromEmails: ok } },
  };
}

function renderPage(path, mocks = []) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MockedProvider mocks={mocks}>
        <Routes>
          <Route path="/desabonnement" element={<DesabonnementPage />} />
        </Routes>
      </MockedProvider>
    </MemoryRouter>,
  );
}

describe('DesabonnementPage', () => {
  it('shouldShowSuccessMessageWhenUnsubscriptionSucceeds', async () => {
    renderPage('/desabonnement?userId=google-123', [
      unsubscribeMock('google-123', true),
    ]);

    expect(await screen.findByText('Vous êtes désabonné')).toBeInTheDocument();
  });

  it('shouldShowErrorMessageWhenUnsubscriptionFails', async () => {
    renderPage('/desabonnement?userId=google-123', [
      unsubscribeMock('google-123', false),
    ]);

    expect(await screen.findByText('Une erreur est survenue')).toBeInTheDocument();
  });

  it('shouldShowInvalidLinkMessageWhenUserIdIsMissing', async () => {
    renderPage('/desabonnement');

    await waitFor(() => {
      expect(screen.getByText('Lien invalide')).toBeInTheDocument();
    });
  });
});
