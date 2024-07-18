import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHorariosPrestador, deleteHorarioPrestador, fetchHorariosPrestador } from '../redux/slice';
import { Box, Button, Select, Input, VStack, HStack, Text, Checkbox } from '@chakra-ui/react';

const HorariosAdmin = () => {
  const dispatch = useDispatch();
  const prestadores = useSelector((state) => state.reservas.prestadores);
  const horariosPrestador = useSelector((state) => state.reservas.horariosPrestador);
  const [selectedPrestador, setSelectedPrestador] = useState('');
  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
    fechaInicio: '',
    fechaFin: '',
    esRecurrente: true
  });

  useEffect(() => {
    if (selectedPrestador) {
      dispatch(fetchHorariosPrestador(selectedPrestador));
    }
  }, [selectedPrestador, dispatch]);

  const formatTimeForBackend = (time) => {
    return time ? `${time}:00.000` : '';
  };

  const handleAddHorario = () => {
    if (selectedPrestador) {
      const formattedHorario = {
        ...nuevoHorario,
        horaInicio: formatTimeForBackend(nuevoHorario.horaInicio),
        horaFin: formatTimeForBackend(nuevoHorario.horaFin)
      };
      dispatch(addHorariosPrestador({
        prestadorId: selectedPrestador,
        horarios: [formattedHorario]
      }));
      setNuevoHorario({
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        fechaInicio: '',
        fechaFin: '',
        esRecurrente: true
      });
    }
  };

  const handleDeleteHorario = (horarioId) => {
    if (selectedPrestador) {
      dispatch(deleteHorarioPrestador({
        prestadorId: selectedPrestador,
        horarioId: horarioId
      }));
    }
  };

  const formatTimeForDisplay = (time) => {
    return time ? time.slice(0, 5) : '';
  };

  return (
    <Box>
      <Select 
        placeholder="Seleccionar prestador" 
        value={selectedPrestador} 
        onChange={(e) => setSelectedPrestador(e.target.value)}
      >
        {prestadores.map((prestador) => (
          <option key={prestador.id} value={prestador.id}>
            {prestador.attributes.nombre}
          </option>
        ))}
      </Select>

      {selectedPrestador && (
        <VStack spacing={4} mt={4}>
          <Text fontWeight="bold">Agregar nuevo horario</Text>
          <Select 
            placeholder="Día de la semana"
            value={nuevoHorario.diaSemana}
            onChange={(e) => setNuevoHorario({...nuevoHorario, diaSemana: e.target.value})}
          >
            {['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'].map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </Select>
          <Input 
            type="time" 
            value={nuevoHorario.horaInicio}
            onChange={(e) => setNuevoHorario({...nuevoHorario, horaInicio: e.target.value})}
          />
          <Input 
            type="time" 
            value={nuevoHorario.horaFin}
            onChange={(e) => setNuevoHorario({...nuevoHorario, horaFin: e.target.value})}
          />
          <Input 
            type="date" 
            value={nuevoHorario.fechaInicio}
            onChange={(e) => setNuevoHorario({...nuevoHorario, fechaInicio: e.target.value})}
          />
          <Input 
            type="date" 
            value={nuevoHorario.fechaFin}
            onChange={(e) => setNuevoHorario({...nuevoHorario, fechaFin: e.target.value})}
          />
          <Checkbox 
            isChecked={nuevoHorario.esRecurrente}
            onChange={(e) => setNuevoHorario({...nuevoHorario, esRecurrente: e.target.checked})}
          >
            Es recurrente
          </Checkbox>
          <Button onClick={handleAddHorario}>Agregar Horario</Button>

          <Text fontWeight="bold">Horarios actuales</Text>
          {horariosPrestador[selectedPrestador]?.map((horario) => (
            <HStack key={horario.id} justifyContent="space-between" width="100%">
              <Text>{`${horario.attributes.diaSemana}: ${formatTimeForDisplay(horario.attributes.horaInicio)} - ${formatTimeForDisplay(horario.attributes.horaFin)}`}</Text>
              <Button onClick={() => handleDeleteHorario(horario.id)}>Eliminar</Button>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default HorariosAdmin;