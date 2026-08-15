import "./Inforelevante.css";

const Inforelevante = () => {
  const direccion = "14 de Julio 3250, Bahia Blanca";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccion
  )}`;

  return (
    <section className="info-relevante">

      {/* FECHA + HORA */}
      <div className="info-relevante__fecha-hora">
        <div className="info-relevante__dato">
          <span className="info-relevante__valor">
            10·10·26
          </span>
        </div>

        <div className="info-relevante__dato info-relevante__dato--hora">
          <span className="info-relevante__valor">
            21 HS
          </span>
        </div>
      </div>

      {/* LUGAR */}
      <div className="info-relevante__lugar">
        <p className="info-relevante__nombre">
          LA QUINTA EVENTOS
        </p>

        <a
          className="info-relevante__direccion"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir ubicación de La Quinta Eventos en Google Maps"
        >
          <div className="info-relevante__direccion-texto">
            <span className="info-relevante__pin">
              ◉
            </span>

            <span>
              14 DE JULIO 3250
            </span>
          </div>

          <span className="info-relevante__mapa">
            VER MAPA
            <span className="info-relevante__flecha">
              ↗
            </span>
          </span>
        </a>
      </div>

    </section>
  );
};

export default Inforelevante;