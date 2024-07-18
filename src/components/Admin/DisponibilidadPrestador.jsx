import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Checkbox, Button, VStack, HStack, Text, Box, Input } from '@chakra-ui/react';
import { fetchPrestadores, setHorariosPrestador } from '../redux/slice';

const DisponibilidadPrestador = () => {
  const dispatch = useDispatch();
  const prestadores = useSelector((state) => state.reservas.prestadores);
  const [selectedPrestador, setSelectedPrestador] = useState('');
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    dispatch(fetchPrestadores());
  }, [dispatch]);

  const handlePrestadorChange = (e) => {
    const prestadorId = e.target.value;
    setSelectedPrestador(prestadorId);
    setHorarios([]);
  };

  const handleAddHorario = () => {
    setHorarios([...horarios, {
      diaSemana: 'lunes',
      horaInicio: '',
      horaFin: '',
      fechaInicio: '',
      fechaFin: '',
      esRecurrente: true
    }]);
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const handleSubmit = () => {
    if (selectedPrestador) {
      dispatch(setHorariosPrestador({ prestadorId: selectedPrestador, horarios }));
    }
  };

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  return (
    <Box p={5}>
      <VStack spacing={4} align="stretch">
        <Select placeholder="Seleccionar prestador" onChange={handlePrestadorChange}>
          {prestadores.map((prestador) => (
            <option key={prestador.id} value={prestador.id}>
              {prestador.attributes.nombre}
            </option>
          ))}
        </Select>

        {selectedPrestador && (
          <>
            <Text fontSize="xl" fontWeight="bold">Configurar disponibilidad</Text>
            <Button onClick={handleAddHorario}>Agregar horario</Button>
            {horarios.map((horario, index) => (
              <Box key={index} borderWidth={1} p={3} borderRadius="md">
                <Select 
                  value={horario.diaSemana} 
                  onChange={(e) => handleHorarioChange(index, 'diaSemana', e.target.value)}
                >
                  {diasSemana.map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </Select>
                <Input 
                  type="time" 
                  value={horario.horaInicio} 
                  onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                />
                <Input 
                  type="time" 
                  value={horario.horaFin} 
                  onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                />
                <Input 
                  type="date" 
                  value={horario.fechaInicio} 
                  onChange={(e) => handleHorarioChange(index, 'fechaInicio', e.target.value)}
                />
                <Input 
                  type="date" 
                  value={horario.fechaFin} 
                  onChange={(e) => handleHorarioChange(index, 'fechaFin', e.target.value)}
                />
                <Checkbox 
                  isChecked={horario.esRecurrente}
                  onChange={(e) => handleHorarioChange(index, 'esRecurrente', e.target.checked)}
                >
                  Es recurrente
                </Checkbox>
              </Box>
            ))}
            <Button colorScheme="blue" onClick={handleSubmit}>Guardar disponibilidad</Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default DisponibilidadPrestador;