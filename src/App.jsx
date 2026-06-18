import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';


const HomePage      = lazy(() => import('./pages/HomePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TrafficPage   = lazy(() => import('./pages/TrafficPage'));
const TravelsPage   = lazy(() => import('./pages/TravelsPage'));
const AccountPage   = lazy(() => import('./pages/AccountPage'));
const SearchPage    = lazy(() => import('./pages/SearchPage'));
const AuthPages    = lazy(() => import('./pages/AuthPages'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/favoris"   element={<FavoritesPage />} />
            <Route path="/trafic"    element={<TrafficPage />} />
            <Route path="/voyages"   element={<TravelsPage />} />
            <Route path="/login"    element={<AuthPages />} />
            <Route path="/compte"    element={<AccountPage />} />
            <Route path="/recherche" element={<SearchPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
