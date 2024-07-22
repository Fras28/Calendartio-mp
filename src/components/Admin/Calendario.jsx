import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservas, deleteReserva } from "../redux/slice";
import { Button, Checkbox, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import "../../App.css";

const Calendario = () => {
  const dispatch = useDispatch();
  const reservas = useSelector((state) => state.reservas?.reservas?.data);
  const status = useSelector((state) => state.reservas?.status);

  const [tipoCalendario, setTipoCalendario] = useState("todas");
  const [reservasFiltradas, setReservasFiltradas] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReservas());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && reservas) { // Ensure reservas is defined
      filtrarReservas(tipoCalendario);
    }
  }, [tipoCalendario, reservas, status]);

  const filtrarReservas = (tipo) => {
    const ahora = new Date();
    switch (tipo) {
      case 'todas':
        agruparReservasPorFecha(reservas);
        break;
      case 'semana':
        // Filter logic for semana
        break;
      case 'mes':
        // Filter logic for mes
        break;
      case 'ano':
        // Filter logic for ano
        break;
      default:
        setReservasFiltradas({});
        break;
    }
  };

  const agruparReservasPorFecha = (reservas) => {
    const reservasAgrupadas = {};
    reservas?.forEach((reserva) => {
      const fechaReserva = reserva?.attributes.fecha;
      if (!reservasAgrupadas[fechaReserva]) {
        reservasAgrupadas[fechaReserva] = [];
      }
      reservasAgrupadas[fechaReserva].push(reserva);
    });
    Object.keys(reservasAgrupadas)?.forEach((fecha) => {
      reservasAgrupadas[fecha].sort((a, b) => {
        const horaA = a.attributes.hora.split(":").slice(0, 2).join(":");
        const horaB = b.attributes.hora.split(":").slice(0, 2).join(":");
        return horaA.localeCompare(horaB);
      });
    });
    setReservasFiltradas(reservasAgrupadas);
  };

  const getColorClass = (reserva) => {
    const ahora = new Date();
    const horaReserva = convertirA24Horas(
      reserva.attributes.fecha,
      reserva.attributes.hora
    );

    const diferenciaMilisegundos = horaReserva - ahora;
    const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));

    if (horaReserva < ahora && isSameDay(horaReserva, ahora)) {
      return "deshabilitado";
    } else if (diferenciaMinutos < 0) {
      return "verde";
    } else if (diferenciaMinutos < 60) {
      return "rojo";
    } else if (diferenciaMinutos < 180) {
      return "naranja-claro";
    } else {
      return "verde";
    }
  };

  const convertirA24Horas = (fecha, hora12) => {
    const [time, modifier] = hora12.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return new Date(`${fecha}T${hours}:${minutes}:${seconds}`);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const fechasOrdenadas = Object.keys(reservasFiltradas)?.sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const handleEliminar = (id) => {
    dispatch(deleteReserva(id));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendario-container">
      <h1>Calendario de Reservas</h1>
      <div className="calendario-buttons">
        <button onClick={() => setTipoCalendario("todas")}>Todas</button>
        <button onClick={() => setTipoCalendario("semana")}>Semana</button>
        <button onClick={() => setTipoCalendario("mes")}>Mes</button>
        <button onClick={() => setTipoCalendario("ano")}>Año</button>
      </div>
      <div className="calendario-filtrado">
        {fechasOrdenadas.map((fecha) => (
          <div key={fecha}>
            <h2 style={{ textAlign: "center" }}>{fecha}</h2>
            <ul>
              {reservasFiltradas[fecha]?.map((reserva) => {
                const colorClass = getColorClass(reserva);
                return (
                  <li key={reserva.id} className={`reserva ${colorClass}`}>
                    {reserva.attributes.hora.slice(0, 5)}hs <br />{" "}
                    <b>Cliente:</b>{" "}
                    {reserva.attributes.nombreCliente || "No especificado"}
                    <IconButton
                      aria-label="Eliminar reserva"
                      icon={<DeleteIcon />}
                      onClick={() => handleEliminar(reserva.id)}
                      variant="outline"
                      colorScheme="red"
                      ml={4}
                    />
                    <Checkbox border={"black"} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;
