import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homePages";
import InfoTrafic from "./pages/infoTraficPages";
import MyTravel from "./pages/myTravelPages";
import FavoriteTravelPages from "./pages/favoriteTravelPages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favoris" element={<FavoriteTravelPages />} />
        <Route path="/infoTrafic" element={<InfoTrafic />} />
        <Route path="/myTravel" element={<MyTravel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
