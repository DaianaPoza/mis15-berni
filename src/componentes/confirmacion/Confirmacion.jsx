import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./Confirmacion.css";

const Confirmacion = () => {
  const [nombreApellido, setNombreApellido] = useState("");

  const [asiste, setAsiste] = useState(null);

  const [cantidadInvitados, setCantidadInvitados] = useState(1);

  const [tieneRestriccion, setTieneRestriccion] = useState(false);
  const [restriccion, setRestriccion] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const aumentarCantidad = () => {
    setCantidadInvitados((prev) => prev + 1);
  };

  const disminuirCantidad = () => {
    setCantidadInvitados((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  const seleccionarAsistencia = (valor) => {
    setAsiste(valor);

    if (!valor) {
      setCantidadInvitados(1);
      setTieneRestriccion(false);
      setRestriccion("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!nombreApellido.trim()) {
      setError("Ingresá tu nombre y apellido.");
      return;
    }

    if (asiste === null) {
      setError("Indicá si vas a poder asistir.");
      return;
    }

    if (
      asiste &&
      tieneRestriccion &&
      !restriccion.trim()
    ) {
      setError(
        "Contanos cuál es tu restricción alimentaria."
      );
      return;
    }

    setEnviando(true);

    const { error: supabaseError } = await supabase
      .from("confirmaciones")
      .insert([
        {
          evento: "berni-fest",

          nombre_apellido:
            nombreApellido.trim(),

          asiste: asiste,

          cantidad_invitados:
            asiste
              ? cantidadInvitados
              : 0,

          restriccion_alimentaria:
            !asiste
              ? "No aplica"
              : tieneRestriccion
              ? restriccion.trim()
              : "Ninguna",
        },
      ]);

    if (supabaseError) {
      console.error(supabaseError);

      setError(
        "No pudimos guardar tu confirmación. Probá nuevamente."
      );

      setEnviando(false);
      return;
    }

    setEnviado(true);
    setEnviando(false);
  };

  if (enviado) {
    return (
      <section className="confirmacion">
        <div className="confirmacion__resultado">

          <span className="confirmacion__access">
            ALL ACCESS
          </span>

          <h2 className="confirmacion__resultado-titulo">
            {asiste ? (
              <>
                ASISTENCIA
                <br />
                CONFIRMADA
              </>
            ) : (
              <>
                RESPUESTA
                <br />
                REGISTRADA
              </>
            )}
          </h2>

          <p className="confirmacion__resultado-texto">
            {asiste
              ? "Nos vemos en Berni Fest"
              : "Gracias por avisarnos"}
          </p>

        </div>
      </section>
    );
  }

  return (
    <section className="confirmacion">

      <div className="confirmacion__encabezado">

        <span className="confirmacion__detalle"></span>

        <h2 className="confirmacion__titulo">
          CONFIRMAR ASISTENCIA
        </h2>

      </div>

      <p className="confirmacion__intro">
        Tu confirmación nos ayuda a preparar todo para esa noche.
      </p>

      <form
        className="confirmacion__form"
        onSubmit={handleSubmit}
      >

        {/* =========================
            NOMBRE
        ========================= */}

        <div className="confirmacion__campo">

          <label
            className="confirmacion__label"
            htmlFor="nombreApellido"
          >
            NOMBRE Y APELLIDO
          </label>

          <input
            id="nombreApellido"
            type="text"
            className="confirmacion__input"
            value={nombreApellido}
            onChange={(e) =>
              setNombreApellido(
                e.target.value
              )
            }
            placeholder="Tu nombre"
            autoComplete="name"
          />

        </div>

        {/* =========================
            ASISTENCIA
        ========================= */}

        <div className="confirmacion__campo">

          <span className="confirmacion__label">
            ¿VAS A PODER ASISTIR?
          </span>

          <div className="confirmacion__opciones">

            <button
              type="button"
              className={`confirmacion__opcion ${
                asiste === true
                  ? "confirmacion__opcion--activa"
                  : ""
              }`}
              onClick={() =>
                seleccionarAsistencia(true)
              }
            >
              SÍ, VOY
            </button>

            <button
              type="button"
              className={`confirmacion__opcion ${
                asiste === false
                  ? "confirmacion__opcion--activa"
                  : ""
              }`}
              onClick={() =>
                seleccionarAsistencia(false)
              }
            >
              NO PUEDO
            </button>

          </div>

        </div>

        {/* =========================
            SOLO SI ASISTE
        ========================= */}

        {asiste === true && (
          <>

            {/* CANTIDAD */}

            <div className="confirmacion__campo">

              <span className="confirmacion__label">
                CANTIDAD DE INVITADOS
              </span>

              <div className="confirmacion__cantidad">

                <button
                  type="button"
                  className="confirmacion__cantidad-boton"
                  onClick={disminuirCantidad}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span className="confirmacion__cantidad-numero">
                  {String(
                    cantidadInvitados
                  ).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  className="confirmacion__cantidad-boton"
                  onClick={aumentarCantidad}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>

              </div>

            </div>

            {/* RESTRICCIONES */}

            <div className="confirmacion__campo">

              <span className="confirmacion__label">
                ¿TENÉS ALGUNA RESTRICCIÓN ALIMENTARIA?
              </span>

              <div className="confirmacion__opciones">

                <button
                  type="button"
                  className={`confirmacion__opcion ${
                    !tieneRestriccion
                      ? "confirmacion__opcion--activa"
                      : ""
                  }`}
                  onClick={() => {
                    setTieneRestriccion(false);
                    setRestriccion("");
                  }}
                >
                  NO
                </button>

                <button
                  type="button"
                  className={`confirmacion__opcion ${
                    tieneRestriccion
                      ? "confirmacion__opcion--activa"
                      : ""
                  }`}
                  onClick={() =>
                    setTieneRestriccion(true)
                  }
                >
                  SÍ
                </button>

              </div>

              {tieneRestriccion && (
                <input
                  type="text"
                  className="confirmacion__input confirmacion__input--restriccion"
                  value={restriccion}
                  onChange={(e) =>
                    setRestriccion(
                      e.target.value
                    )
                  }
                  placeholder="Ej: celiaquía, vegetariano..."
                />
              )}

            </div>

          </>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <p className="confirmacion__error">
            {error}
          </p>
        )}

        {/* =========================
            ENVIAR
        ========================= */}

        <button
          type="submit"
          className="confirmacion__submit"
          disabled={enviando}
        >

          <span>
            {enviando
              ? "ENVIANDO..."
              : "CONFIRMAR RESPUESTA"}
          </span>

          <span className="confirmacion__submit-flecha">
            →
          </span>

        </button>

      </form>

    </section>
  );
};

export default Confirmacion;