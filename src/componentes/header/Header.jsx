import "./Header.css";
import escenario from "../../assets/disco-balls-header.jpeg";

const Header = () => {
  return (
    <header className="hero">
      {/* IMAGEN DEL ESCENARIO */}
      <div className="hero__image-wrapper">
        <img
          src={escenario}
          alt="Esferas espejadas"
          className="hero__image"
        />

        <div className="hero__image-overlay"></div>
      </div>

      {/* CONTENIDO */}
      <div className="hero__content">
        {/* CABECERA VIP */}
        <div className="vip-code">
          <div className="barcode" aria-hidden="true">
            <span className="barcode__text">
              INVITACION VIP
            </span>
          </div>
        </div>

        {/* TITULO PRINCIPAL */}
        <div className="hero__title-wrapper">
          <h1 className="hero__title">
            <span className="hero__title-berni">
              BERNI
            </span>

          
          </h1>

          <p className="hero__subtitle">
            MIS 15
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
