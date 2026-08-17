import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./PanelCliente.css";

const PanelCliente = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [session, setSession] = useState(null);
  const [evento, setEvento] = useState(null);
  const [confirmaciones, setConfirmaciones] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [enviandoLogin, setEnviandoLogin] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     SESIÓN
  ========================= */

  useEffect(() => {
    obtenerSesionInicial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);

      if (!currentSession) {
        setEvento(null);
        setConfirmaciones([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      cargarDatosCliente();
    }
  }, [session]);

  const obtenerSesionInicial = async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);
    setCargando(false);
  };

  /* =========================
     LOGIN
  ========================= */

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError("");
    setEnviandoLogin(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      console.error(loginError);

      setError("Email o contraseña incorrectos.");
      setEnviandoLogin(false);

      return;
    }

    setEnviandoLogin(false);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  /* =========================
     DATOS DEL CLIENTE
  ========================= */

  const cargarDatosCliente = async () => {
    setCargando(true);
    setError("");

    const {
      data: eventosData,
      error: eventosError,
    } = await supabase
      .from("eventos")
      .select("id, slug, nombre")
      .single();

    if (eventosError) {
      console.error(eventosError);

      setError("No se pudo cargar el evento.");
      setCargando(false);

      return;
    }

    setEvento(eventosData);

    const {
      data: confirmacionesData,
      error: confirmacionesError,
    } = await supabase
      .from("confirmaciones")
      .select(
        `
        id,
        nombre_apellido,
        asiste,
        cantidad_invitados,
        restriccion_alimentaria,
        created_at
        `
      )
      .eq("evento", eventosData.slug)
      .order("created_at", {
        ascending: false,
      });

    if (confirmacionesError) {
      console.error(confirmacionesError);

      setError(
        "No se pudieron cargar las confirmaciones."
      );

      setCargando(false);

      return;
    }

    setConfirmaciones(
      confirmacionesData || []
    );

    setCargando(false);
  };

  /* =========================
     RESUMEN
  ========================= */

  const totalConfirmaciones =
    confirmaciones.length;

  const totalAsisten =
    confirmaciones.filter(
      (item) => item.asiste === true
    ).length;

  const totalNoAsisten =
    confirmaciones.filter(
      (item) => item.asiste === false
    ).length;

  const totalPersonas =
    confirmaciones.reduce(
      (total, item) => {
        if (item.asiste !== true) {
          return total;
        }

        return (
          total +
          Number(
            item.cantidad_invitados || 0
          )
        );
      },
      0
    );

  /* =========================
     DESCARGAR CSV
  ========================= */

  const descargarCSV = () => {
    if (confirmaciones.length === 0) {
      return;
    }

    const encabezados = [
      "Nombre y Apellido",
      "Asiste",
      "Cantidad de invitados",
      "Restricción alimentaria",
      "Fecha de confirmación",
    ];

    const filas = confirmaciones.map(
      (item) => [
        item.nombre_apellido,
        item.asiste === true
          ? "Sí"
          : item.asiste === false
          ? "No"
          : "Sin respuesta",
        item.cantidad_invitados,
        item.restriccion_alimentaria ||
          "Ninguna",
        new Date(
          item.created_at
        ).toLocaleString("es-AR"),
      ]
    );

    const escaparValor = (valor) => {
      const texto = String(
        valor ?? ""
      );

      return `"${texto.replace(
        /"/g,
        '""'
      )}"`;
    };

    const contenidoCSV = [
      encabezados
        .map(escaparValor)
        .join(";"),

      ...filas.map((fila) =>
        fila
          .map(escaparValor)
          .join(";")
      ),
    ].join("\n");

    const bom = "\uFEFF";

    const archivo = new Blob(
      [bom + contenidoCSV],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(archivo);

    const enlace =
      document.createElement("a");

    enlace.href = url;

    enlace.download =
      `confirmaciones-${
        evento?.slug || "evento"
      }.csv`;

    document.body.appendChild(
      enlace
    );

    enlace.click();

    enlace.remove();

    URL.revokeObjectURL(url);
  };

  /* =========================
     CARGANDO
  ========================= */

  if (cargando) {
    return (
      <section className="panel-cliente">
        <p className="panel-cliente__estado">
          CARGANDO...
        </p>
      </section>
    );
  }

  /* =========================
     LOGIN
  ========================= */

  if (!session) {
    return (
      <section className="panel-cliente panel-cliente--login">
        <div className="panel-cliente__login-box">
          <span className="panel-cliente__eyebrow">
            ACCESO PRIVADO
          </span>

          <h1 className="panel-cliente__titulo">
            PANEL
            <br />
            CLIENTE
          </h1>

          <form
            className="panel-cliente__form"
            onSubmit={iniciarSesion}
          >
            <div className="panel-cliente__campo">
              <label htmlFor="email">
                EMAIL
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="panel-cliente__campo">
              <label htmlFor="password">
                CONTRASEÑA
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="panel-cliente__error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="panel-cliente__boton"
              disabled={enviandoLogin}
            >
              {enviandoLogin
                ? "INGRESANDO..."
                : "INGRESAR →"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  /* =========================
     PANEL PRINCIPAL
  ========================= */

  return (
    <section className="panel-cliente">

      {/* CABECERA */}
      <div className="panel-cliente__topbar">
        <div>
          <span className="panel-cliente__eyebrow">
            PANEL DE CONFIRMACIONES
          </span>

          <h1 className="panel-cliente__evento">
            <span className="panel-cliente__evento-nombre">
              Berni
            </span>

            <span className="panel-cliente__evento-subtitulo">
              MIS 15
            </span>
          </h1>
        </div>

        <div className="panel-cliente__acciones">

          <button
            type="button"
            className="panel-cliente__descargar"
            onClick={descargarCSV}
            disabled={
              confirmaciones.length === 0
            }
          >
            DESCARGAR LISTA ↓
          </button>

          <button
            type="button"
            className="panel-cliente__logout"
            onClick={cerrarSesion}
          >
            SALIR
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="panel-cliente__error">
          {error}
        </p>
      )}

      {/* RESUMEN */}
      <div className="panel-cliente__resumen">

        <article className="panel-cliente__card">
          <span>
            CONFIRMACIONES
          </span>

          <strong>
            {totalConfirmaciones}
          </strong>
        </article>

        <article className="panel-cliente__card">
          <span>
            ASISTEN
          </span>

          <strong>
            {totalAsisten}
          </strong>
        </article>

        <article className="panel-cliente__card">
          <span>
            NO ASISTEN
          </span>

          <strong>
            {totalNoAsisten}
          </strong>
        </article>

        <article className="panel-cliente__card">
          <span>
            PERSONAS
          </span>

          <strong>
            {totalPersonas}
          </strong>
        </article>

      </div>

      {/* TABLA */}
      <div className="panel-cliente__tabla">

        <div className="panel-cliente__tabla-head">
          <span>NOMBRE</span>
          <span>ASISTE</span>
          <span>INV.</span>
          <span>RESTRICCIÓN</span>
        </div>

        {confirmaciones.length === 0 ? (
          <p className="panel-cliente__sin-datos">
            TODAVÍA NO HAY CONFIRMACIONES
          </p>
        ) : (
          confirmaciones.map(
            (item) => (
              <div
                className="panel-cliente__fila"
                key={item.id}
              >
                <span className="panel-cliente__nombre">
                  {
                    item.nombre_apellido
                  }
                </span>

                <span className="panel-cliente__asiste">
                  {item.asiste === true
                    ? "SÍ"
                    : item.asiste === false
                    ? "NO"
                    : "—"}
                </span>

                <span className="panel-cliente__cantidad">
                  {
                    item.cantidad_invitados
                  }
                </span>

                <span className="panel-cliente__restriccion">
                  {item.restriccion_alimentaria ||
                    "Ninguna"}
                </span>
              </div>
            )
          )
        )}
      </div>

    </section>
  );
};

export default PanelCliente;
