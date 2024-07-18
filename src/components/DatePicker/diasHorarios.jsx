import React from 'react';
import {
  Box,
  Flex,
  Text,
  Select,
  FormControl,
  FormLabel
} from '@chakra-ui/react';

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const diasHorarios = ({ prestador, setSelectedDia, setSelectedHora }) => {
  return (
    <Box>
      <FormControl id="dias">
        <FormLabel>Día de la semana</FormLabel>
        <Select placeholder="Seleccione el día" onChange={(e) => setSelectedDia(e.target.value)}>
          {dias.map((dia) => (
            <option key={dia} value={dia}>
              {dia}
            </option>
          ))}
        </Select>
      </FormControl>
      {prestador.attributes.horarios?.data.length > 0 && (
        <FormControl id="horarios" mt={4}>
          <FormLabel>Horario</FormLabel>
          <Select placeholder="Seleccione el horario" onChange={(e) => setSelectedHora(e.target.value)}>
            {prestador.attributes.horarios.data.map((horario) => (
              <option key={horario.id} value={`${horario.attributes.horaInicio} - ${horario.attributes.horaFin}`}>
                {horario.attributes.diaSemana} - {horario.attributes.horaInicio} a {horario.attributes.horaFin}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default diasHorarios;
