import { useEffect, useState } from "react";
import "./Cuentaregresiva.css";

const Cuentaregresiva = () => {
  const fechaEvento = new Date("2026-10-10T21:00:00");

  const calcularTiempoRestante = () => {
    const ahora = new Date();
    const diferencia = fechaEvento - ahora;

    if (diferencia <= 0) {
      return {
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
      };
    }

    return {
      dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),

      horas: Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
      ),

      minutos: Math.floor(
        (diferencia / (1000 * 60)) % 60
      ),

      segundos: Math.floor(
        (diferencia / 1000) % 60
      ),
    };
  };

  const [tiempo, setTiempo] = useState(
    calcularTiempoRestante()
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempoRestante());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const formatearNumero = (numero) =>
    String(numero).padStart(2, "0");

  return (
    <section className="cuenta-regresiva">
      <div className="cuenta-regresiva__contenedor">

        <div className="cuenta-regresiva__item">
          <span className="cuenta-regresiva__numero">
            {formatearNumero(tiempo.dias)}
          </span>

          <span className="cuenta-regresiva__unidad">
            DÍAS
          </span>
        </div>

        <div className="cuenta-regresiva__separador"></div>

        <div className="cuenta-regresiva__item">
          <span className="cuenta-regresiva__numero">
            {formatearNumero(tiempo.horas)}
          </span>

          <span className="cuenta-regresiva__unidad">
            HORAS
          </span>
        </div>

        <div className="cuenta-regresiva__separador"></div>

        <div className="cuenta-regresiva__item">
          <span className="cuenta-regresiva__numero">
            {formatearNumero(tiempo.minutos)}
          </span>

          <span className="cuenta-regresiva__unidad">
            MINUTOS
          </span>
        </div>

        <div className="cuenta-regresiva__separador"></div>

        <div className="cuenta-regresiva__item">
          <span className="cuenta-regresiva__numero">
            {formatearNumero(tiempo.segundos)}
          </span>

          <span className="cuenta-regresiva__unidad">
            SEGUNDOS
          </span>
        </div>

      </div>

      <p className="cuenta-regresiva__texto">
        FALTA CADA VEZ MENOS
      </p>
    </section>
  );
};

export default Cuentaregresiva;