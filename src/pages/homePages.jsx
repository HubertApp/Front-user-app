import Menu from "../components/commons/menu";

import heart from "../img/heart.png";
import settings from "../img/settings.png";
import luggages from "../img/lugages.png";
import pin from "../img/pin.png";
import bell from "../img/bell.png";
import house from "../img/house.png";
import target from "../img/target.png";
import Footer from "../components/commons/footer";
import SearchInput from "../components/commons/searchInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      <header className="flex items-center md:justify-center px-4 sm:px-26 py-6">
        <h1 className="text-4xl lg:text-5xl text-info font-bold">Hubert</h1>
      </header>

      <div className="flex flex-col items-center flex-grow px-4 md:px-26 pb-24">
        <h2 className="text-2xl lg:text-4xl mb-6 w-full max-w-md">
          C'est pas la destination qui compte, c'est le trajet !
        </h2>

        <SearchInput icon="fa-solid fa-map-location"/>

        <section className="w-full max-w-md mb-8">
          <h3 className="text-lg mb-4">En route</h3>
          <div className="flex flex-wrap justify-evenly gap-4">
            <div className="w-[40%] max-w-[130px]">
              <Menu title="Trajet Favoris" link="/favoris" image={heart} />
            </div>
            <div className="w-[40%] max-w-[130px]">
              <Menu title="Infos Trafic" link="/infoTrafic" image={bell} />
            </div>
            <div className="w-[40%] max-w-[130px]">
              <Menu title="Mes voyages" link="/myTravel" image={luggages} />
            </div>
            <div className="w-[40%] max-w-[130px]">
              <Menu title="Paramètres" image={settings} />
            </div>
            <div className="w-[40%] max-w-[130px]">
              <Menu title="Localisation" image={target} />
            </div>

          </div>
        </section>


        <section className="w-full max-w-md">
          <h3 className="text-lg mb-4">Les plus utilisés</h3>
          <div className="grid grid-cols-2 gap-4">
            <Menu title="Maison à Travail" image={house} most_use={true} />
            <Menu title="Organiser un Voyage" image={pin} most_use={true} />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
