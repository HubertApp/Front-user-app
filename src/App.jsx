import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import TrafficPage from './pages/TrafficPage';
import TravelsPage from './pages/TravelsPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favoris" element={<FavoritesPage />} />
        <Route path="/trafic" element={<TrafficPage />} />
        <Route path="/voyages" element={<TravelsPage />} />
        <Route path="/compte" element={<AccountPage />} />
        <Route path="/recherche" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
