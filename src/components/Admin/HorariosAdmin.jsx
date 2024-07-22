import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addHorariosPrestador,
  deleteHorarioPrestador,
  fetchHorariosPrestador,
} from "../redux/slice";
import {
  Box,
  Button,
  Select,
  Input,
  VStack,
  HStack,
  Text,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";

const HorariosAdmin = () => {
  const dispatch = useDispatch();
  const prestadores = useSelector((state) => state.reservas.prestadores);
  const horariosPrestador = useSelector((state) => {
    console.log('Estado actual:', state.reservas);
    return state.reservas.horariosPrestador;
  });
  const [selectedPrestador, setSelectedPrestador] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
    fechaInicio: "",
    fechaFin: "",
    esRecurrente: true,
  });

  const diasDeSemana = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];

  useEffect(() => {
    if (selectedPrestador) {
      console.log('Fetching horarios para prestador:', selectedPrestador);
      setIsLoading(true);
      dispatch(fetchHorariosPrestador(selectedPrestador))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          console.log('Horarios fetched successfully');
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error al cargar horarios:", error);
        });
    }
  }, [selectedPrestador, dispatch]);

  const handlePrestadorChange = (e) => {
    setSelectedPrestador(e.target.value);
  };

  const formatTimeForBackend = (time) => {
    return time ? `${time}:00.000` : "";
  };

  const handleAddHorario = async () => {
    if (selectedPrestador) {
      const formattedHorario = {
        ...nuevoHorario,
        horaInicio: formatTimeForBackend(nuevoHorario.horaInicio),
        horaFin: formatTimeForBackend(nuevoHorario.horaFin)
      };
      try {
        await dispatch(addHorariosPrestador({
          prestadorId: selectedPrestador,
          horarios: [formattedHorario]
        })).unwrap();
        // Después de agregar el horario, volvemos a cargar los horarios del prestador
        dispatch(fetchHorariosPrestador(selectedPrestador));
        setNuevoHorario({
          diaSemana: '',
          horaInicio: '',
          horaFin: '',
          fechaInicio: '',
          fechaFin: '',
          esRecurrente: true
        });
      } catch (error) {
        console.error('Error al agregar horario:', error);
        // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
      }
    }
  };

  const handleDeleteHorario = (horarioId) => {
    if (selectedPrestador) {
      dispatch(
        deleteHorarioPrestador({ prestadorId: selectedPrestador, horarioId })
      )
        .unwrap()
        .then(() => {
          // Actualizar la lista de horarios después de eliminar
          dispatch(fetchHorariosPrestador(selectedPrestador));
        })
        .catch((error) => {
          console.error("Error al eliminar horario:", error);
          // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
        });
    }
  };

  const formatTimeForDisplay = (time) => {
    return time ? time.slice(0, 5) : "";
  };

  const formatDateRange = (fechaInicio, fechaFin) => {
    const start = new Date(fechaInicio).toLocaleDateString();
    const end = new Date(fechaFin).toLocaleDateString();
    return `${start} - ${end}`;
  };
console.log(horariosPrestador, " horariosPrestador");
const renderHorariosPrestador = () => {
  if (isLoading) {
    return <Spinner />;
  }

  const horarios = horariosPrestador[selectedPrestador] || [];
  console.log('Horarios del prestador seleccionado:', horarios);

  if (horarios.length === 0) {
    return <Text>No hay horarios disponibles</Text>;
  }

  return horarios.map((horario) => (
    <HStack key={horario.id} justifyContent="space-between" width="100%">
      <VStack align="start">
        <Text>{`${horario.attributes.diaSemana}: ${formatTimeForDisplay(
          horario.attributes.horaInicio
        )} - ${formatTimeForDisplay(horario.attributes.horaFin)}`}</Text>
        <Text fontSize="sm" color="gray.500">
          {formatDateRange(
            horario.attributes.fechaInicio,
            horario.attributes.fechaFin
          )}
        </Text>
      </VStack>
      <Button
        onClick={() => handleDeleteHorario(horario.id)}
        style={{ border: "solid red 2px" }}
      >
        Eliminar
      </Button>
    </HStack>
  ));
};


  return (
    <Box>
      <Select
        placeholder="Seleccionar prestador"
        value={selectedPrestador}
        onChange={handlePrestadorChange}
      >
        {prestadores.map((prestador) => (
          <option key={prestador.id} value={prestador.id}>
            {prestador.attributes.nombre}
          </option>
        ))}
      </Select>

      {selectedPrestador && (
        <VStack spacing={4} mt={4}>
          <Text fontWeight="bold">Horarios actuales</Text>
          {renderHorariosPrestador()}

          <Text fontWeight="bold" mt={4}>
            Agregar nuevo horario
          </Text>
          <Select
            placeholder="Día de la semana"
            value={nuevoHorario.diaSemana}
            onChange={(e) =>
              setNuevoHorario({ ...nuevoHorario, diaSemana: e.target.value })
            }
          >
            {diasDeSemana.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </Select>
          <Input
            type="time"
            value={nuevoHorario.horaInicio}
            onChange={(e) =>
              setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })
            }
          />
          <Input
            type="time"
            value={nuevoHorario.horaFin}
            onChange={(e) =>
              setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })
            }
          />
          <Input
            type="date"
            value={nuevoHorario.fechaInicio}
            onChange={(e) =>
              setNuevoHorario({ ...nuevoHorario, fechaInicio: e.target.value })
            }
          />
          <Input
            type="date"
            value={nuevoHorario.fechaFin}
            onChange={(e) =>
              setNuevoHorario({ ...nuevoHorario, fechaFin: e.target.value })
            }
          />
          <Checkbox
            isChecked={nuevoHorario.esRecurrente}
            onChange={(e) =>
              setNuevoHorario({
                ...nuevoHorario,
                esRecurrente: e.target.checked,
              })
            }
          >
            Es recurrente
          </Checkbox>
          <Button onClick={handleAddHorario}>Agregar Horario</Button>
        </VStack>
      )}
    </Box>
  );
};

export default HorariosAdmin;
