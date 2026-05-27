import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ROUTES } from './constants/routes';

const HomePage      = lazy(() => import('./pages/HomePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TrafficPage   = lazy(() => import('./pages/TrafficPage'));
const TravelsPage   = lazy(() => import('./pages/TravelsPage'));
const AccountPage   = lazy(() => import('./pages/AccountPage'));
const SearchPage    = lazy(() => import('./pages/SearchPage'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path={ROUTES.home}      element={<HomePage />} />
            <Route path={ROUTES.favorites} element={<FavoritesPage />} />
            <Route path={ROUTES.traffic}   element={<TrafficPage />} />
            <Route path={ROUTES.travels}   element={<TravelsPage />} />
            <Route path={ROUTES.account}   element={<AccountPage />} />
            <Route path={ROUTES.search}    element={<SearchPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
