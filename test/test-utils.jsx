import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../src/context/ThemeContext';

// Wrapper commun : Router (composants utilisent useNavigate/NavLink),
// ThemeProvider (useTheme, lu par BottomNav/PageHeader/Account/HomePage),
// MockedProvider (Apollo) pour simuler les réponses GraphQL sans réseau réel.
export function renderWithProviders(
  ui,
  { mocks = [], route = '/', ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          {/* addTypename par défaut (true), comme en prod : nécessaire pour
              que cache.modify()/cache.evict() dans notificationService.js
              fonctionnent identiquement en test. */}
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
