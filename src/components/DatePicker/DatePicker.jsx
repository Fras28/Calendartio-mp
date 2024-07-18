import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Select,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';

const DateTimePicker = ({ prestador }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableDates, setAvailableDates] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);

  useEffect(() => {
    if (prestador && prestador.attributes?.horarios?.data) {
      const dates = [];
      prestador.attributes.horarios.data.forEach(horario => {
        const { diaSemana, horaInicio, horaFin, fechaInicio, fechaFin, esRecurrente } = horario.attributes;
        const start = moment(fechaInicio);
        const end = moment(fechaFin);

        while (start.isSameOrBefore(end)) {
          if (start.format('dddd') === diaSemana || !esRecurrente) {
            dates.push({
              date: start.format('YYYY-MM-DD'),
              start: horaInicio,
              end: horaFin,
            });
          }
          start.add(1, 'days');
        }
      });
      setAvailableDates(dates);
    }
  }, [prestador]);

  const handleDateSelect = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    const hours = availableDates.filter(date => date.date === selected);
    setAvailableHours(hours);
    setSelectedTime('');
  };

  const handleTimeSelect = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Select placeholder="Seleccione una fecha" onChange={handleDateSelect} value={selectedDate}>
          {availableDates.map((date, index) => (
            <option key={index} value={date.date}>
              {date.date}
            </option>
          ))}
        </Select>
        {selectedDate && (
          <Select placeholder="Seleccione una hora" onChange={handleTimeSelect} value={selectedTime}>
            {availableHours.map((hour, index) => (
              <option key={index} value={hour.start}>
                {`${hour.start} - ${hour.end}`}
              </option>
            ))}
          </Select>
        )}
        <Button onClick={onOpen} isDisabled={!selectedDate || !selectedTime}>
          Ver fecha y hora seleccionadas
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fecha y hora seleccionadas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fecha: {selectedDate || 'No seleccionada'}</Text>
            <Text>Hora: {selectedTime || 'No seleccionada'}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DateTimePicker;
