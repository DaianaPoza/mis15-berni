import { useState } from "react";
import "./Regalo.css";

const Regalo = () => {
  const [mostrarDatos, setMostrarDatos] = useState(false);
  const [copiado, setCopiado] = useState("");

  const alias = "Bernardita.moggia";
  const cbu = "0000003100096230522885";

  const copiarDato = async (texto, tipo) => {
    try {
      await navigator.clipboard.writeText(texto);

      setCopiado(tipo);

      setTimeout(() => {
        setCopiado("");
      }, 1800);
    } catch (error) {
      console.error("No se pudo copiar el dato:", error);
    }
  };

  return (
    <section className="regalo">
      <div className="regalo__encabezado">
        <span className="regalo__detalle"></span>

        <h2 className="regalo__titulo">
          BONUS TRACK
        </h2>
      </div>

      <p className="regalo__texto">
        El mejor regalo es tenerte esa noche, pero si además querés
        hacerme un presente, te dejo una opción por acá.
      </p>

      <button
        type="button"
        className={`regalo__toggle ${
          mostrarDatos ? "regalo__toggle--activo" : ""
        }`}
        onClick={() => setMostrarDatos(!mostrarDatos)}
        aria-expanded={mostrarDatos}
      >
        <span>
          {mostrarDatos ? "OCULTAR DATOS" : "VER DATOS"}
        </span>

        <span className="regalo__toggle-icono">
          {mostrarDatos ? "−" : "+"}
        </span>
      </button>

      <div
        className={`regalo__datos ${
          mostrarDatos ? "regalo__datos--visible" : ""
        }`}
      >
        <div className="regalo__datos-contenido">

          {/* ALIAS */}
          <div className="regalo__dato">
            <div className="regalo__dato-info">
              <span className="regalo__label">
                ALIAS
              </span>

              <span className="regalo__valor">
                {alias}
              </span>
            </div>

            <button
              type="button"
              className="regalo__copiar"
              onClick={() => copiarDato(alias, "alias")}
            >
              {copiado === "alias" ? "COPIADO" : "COPIAR"}
            </button>
          </div>

          {/* CBU */}
          <div className="regalo__dato">
            <div className="regalo__dato-info">
              <span className="regalo__label">
                CBU
              </span>

              <span className="regalo__valor regalo__valor--cbu">
                {cbu}
              </span>
            </div>

            <button
              type="button"
              className="regalo__copiar"
              onClick={() => copiarDato(cbu, "cbu")}
            >
              {copiado === "cbu" ? "COPIADO" : "COPIAR"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Regalo;