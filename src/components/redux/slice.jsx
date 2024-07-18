import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const COMERCIO_ID = process.env.REACT_APP_COMERCIO_ID;

const initialState = {
  user: null,
  token: null,
  role: null,
  prestadores: [],
  reservas: [],
  comercio: null,
  horariosPrestador: [],
  status: 'idle',
  error: null,
};
export const fetchPrestadores = createAsyncThunk('reservas/fetchPrestadores', async () => {
  try {
    const response = await axios.get(`${API_URL}/api/prestadores?populate=avatar&populate=fondoPerfil&populate=valors&populate=horarios`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prestadores:', error);
    throw error;
  }
});
const removeToken = () => {
  localStorage.removeItem('token');
};

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    removeToken();
    return null;  // Puedes devolver cualquier dato que desees al completar el logout
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
});



export const fetchComercio = createAsyncThunk('reservas/fetchComercio', async () => {
  try {
    const response = await axios.get(`${API_URL}/api/comercios/${COMERCIO_ID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comercio:', error);
    throw error;
  }
});

export const fetchReservas = createAsyncThunk('reservas/fetchReservas', async () => {
  try {
    const response = await axios.get(`${API_URL}/api/reservas?filters[comercio][id][$eq]=${COMERCIO_ID}&populate[prestador][fields][0]=nombre&populate[comercio][fields][0]=id`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservas:', error);
    throw error;
  }
});

export const createReserva = createAsyncThunk('reservas/createReserva', async ({ nombreCliente, email, fecha, hora, prestador, servicio }, { dispatch }) => {
  try {
    const response = await axios.post(`${API_URL}/api/reservas`, {
      data: { 
        nombreCliente, 
        email, 
        fecha, 
        hora, 
        prestador: { id: prestador }, 
        servicio: { id: servicio }, 
        comercio: { id: COMERCIO_ID }
      }
    });
    await dispatch(fetchReservas());
    return response.data;
  } catch (error) {
    console.error('Error creating reserva:', error);
    throw error;
  }
});

export const deleteReserva = createAsyncThunk('reservas/deleteReserva', async (id, { dispatch }) => {
  try {
    await axios.delete(`${API_URL}/api/reservas/${id}`);
    await dispatch(fetchReservas());
    return id;
  } catch (error) {
    console.error('Error deleting reserva:', error);
    throw error;
  }
});

export const registerUser = createAsyncThunk('user/register', async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
});




export const fetchHorariosPrestador = createAsyncThunk(
  'reservas/fetchHorariosPrestador',
  async (prestadorId) => {
    try {
      const response = await axios.get(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}&populate=*`);
      return response.data;
    } catch (error) {
      console.error('Error fetching horarios del prestador:', error);
      throw error;
    }
  }
);

export const updateHorariosPrestador = createAsyncThunk(
  'reservas/updateHorariosPrestador',
  async ({ prestadorId, horarios }) => {
    try {
      // Primero, eliminamos los horarios existentes
      await axios.delete(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}`);
      
      // Luego, creamos los nuevos horarios
      const promises = horarios.map(horario => 
        axios.post(`${API_URL}/api/horarios`, { data: { ...horario, prestador: prestadorId } })
      );
      
      await Promise.all(promises);
      
      // Finalmente, obtenemos los horarios actualizados
      const response = await axios.get(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}&populate=*`);
      return response.data;
    } catch (error) {
      console.error('Error updating horarios del prestador:', error);
      throw error;
    }
  }
);


export const loginUser = createAsyncThunk('user/login', async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local`, {
      identifier: credentials.email,
      password: credentials.password,
    });

    const token = response.data.jwt;
    localStorage.setItem('token', token);

    // Obtener información adicional del usuario, incluyendo su rol
    const userResponse = await axios.get(`${API_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = userResponse.data;
console.log(user, "info antes de cargarla");
    // Asegurarnos que el role venga en la respuesta
    const role = user.role; 

    return { ...user, role, token };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
});
export const setHorariosPrestador = createAsyncThunk(
  'reservas/setHorariosPrestador',
  async ({ prestadorId, horarios }) => {
    try {
      // Obtener los horarios actuales
      const existingHorariosResponse = await axios.get(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}&populate=*`);
      const existingHorarios = existingHorariosResponse.data;

      // Mapear los horarios actuales por su ID para facilitar la comparación
      const existingHorariosMap = new Map(existingHorarios.map(horario => [horario.id, horario]));

      // Identificar horarios a crear, actualizar y eliminar
      const horariosToCreate = [];
      const horariosToUpdate = [];
      const horariosToDelete = new Set(existingHorariosMap.keys());

      horarios.forEach(horario => {
        const existingHorario = Array.from(existingHorariosMap.values()).find(h => 
          h.attributes.diaSemana === horario.diaSemana &&
          h.attributes.horaInicio === horario.horaInicio &&
          h.attributes.horaFin === horario.horaFin &&
          h.attributes.fechaInicio === horario.fechaInicio &&
          h.attributes.fechaFin === horario.fechaFin &&
          h.attributes.esRecurrente === horario.esRecurrente
        );

        if (existingHorario) {
          // Si el horario ya existe, se actualiza
          horariosToUpdate.push({
            id: existingHorario.id,
            data: horario
          });
          horariosToDelete.delete(existingHorario.id);
        } else {
          // Si el horario no existe, se crea
          horariosToCreate.push(horario);
        }
      });

      // Eliminar los horarios que no están en la lista de nuevos horarios
      const deletePromises = Array.from(horariosToDelete).map(horarioId => 
        axios.delete(`${API_URL}/api/horarios/${horarioId}`)
      );

      // Crear nuevos horarios
      const createPromises = horariosToCreate.map(horario => 
        axios.post(`${API_URL}/api/horarios`, { 
          data: { 
            prestador: prestadorId,
            ...horario
          } 
        })
      );

      // Actualizar horarios existentes
      const updatePromises = horariosToUpdate.map(({ id, data }) => 
        axios.put(`${API_URL}/api/horarios/${id}`, { 
          data: { 
            prestador: prestadorId,
            ...data
          } 
        })
      );

      await Promise.all([...deletePromises, ...createPromises, ...updatePromises]);

      // Finalmente, obtener los horarios actualizados
      const response = await axios.get(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}&populate=*`);
      return response.data;
    } catch (error) {
      console.error('Error setting horarios del prestador:', error);
      throw error;
    }
  }
);


export const addHorariosPrestador = createAsyncThunk(
  'reservas/addHorariosPrestador',
  async ({ prestadorId, horarios }, { getState }) => {
    try {
      const state = getState();
      const token = state.reservas.token;
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Primero, creamos los nuevos horarios
      const createdHorarios = await Promise.all(horarios.map(async horario => {
        const response = await axios.post(
          `${API_URL}/api/horarios`,
          { 
            data: { 
              diaSemana: horario.diaSemana,
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              fechaInicio: horario.fechaInicio,
              fechaFin: horario.fechaFin,
              esRecurrente: horario.esRecurrente
            } 
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.data;
      }));

      // Luego, actualizamos el prestador para incluir los nuevos horarios
      const prestadorResponse = await axios.get(
        `${API_URL}/api/prestadores/${prestadorId}?populate=horarios`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const prestador = prestadorResponse.data.data;
      const existingHorariosIds = prestador.attributes.horarios.data.map(h => h.id);
      const newHorariosIds = createdHorarios.map(h => h.id);
      const updatedHorariosIds = [...existingHorariosIds, ...newHorariosIds];

      await axios.put(
        `${API_URL}/api/prestadores/${prestadorId}`,
        {
          data: {
            horarios: updatedHorariosIds
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Finalmente, obtenemos los horarios actualizados del prestador
      const updatedHorariosResponse = await axios.get(
        `${API_URL}/api/prestadores/${prestadorId}?populate=horarios`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return updatedHorariosResponse.data.data.attributes.horarios.data;
    } catch (error) {
      console.error('Error adding horarios del prestador:', error);
      throw error;
    }
  }
);

export const deleteHorarioPrestador = createAsyncThunk(
  'reservas/deleteHorarioPrestador',
  async ({ prestadorId, horarioId }) => {
    try {
      // Eliminamos el horario específico
      await axios.delete(`${API_URL}/api/horarios/${horarioId}`);
      
      // Obtenemos los horarios actualizados del prestador
      const response = await axios.get(`${API_URL}/api/horarios?filters[prestador][id][$eq]=${prestadorId}&populate=*`);
      return response.data;
    } catch (error) {
      console.error('Error deleting horario del prestador:', error);
      throw error;
    }
  }
);



const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(setHorariosPrestador.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(setHorariosPrestador.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.horariosPrestador = action.payload.data;
    })
    .addCase(setHorariosPrestador.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
      .addCase(fetchPrestadores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrestadores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prestadores = action.payload.data;
      })
      .addCase(fetchPrestadores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchReservas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservas = action.payload;
      })
      .addCase(fetchReservas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReserva.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createReserva.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createReserva.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteReserva.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteReserva.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteReserva.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        // You might want to store the user data in your state here
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role; // Asegúrate de que la respuesta contenga esta información
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchComercio.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComercio.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comercio = action.payload; // Almacena la respuesta en el estado del comercio
      })
      .addCase(fetchComercio.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchHorariosPrestador.fulfilled, (state, action) => {
        state.horariosPrestador = action.payload.data;
      })
      .addCase(addHorariosPrestador.fulfilled, (state, action) => {
        const { prestadorId } = action.meta.arg;
        state.horariosPrestador[prestadorId] = action.payload;
      })
      .addCase(addHorariosPrestador.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteHorarioPrestador.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteHorarioPrestador.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Actualizamos los horarios del prestador en el estado
        const prestadorId = action.meta.arg.prestadorId;
        state.horariosPrestador[prestadorId] = action.payload.data;
      })
      .addCase(deleteHorarioPrestador.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = reservasSlice.actions;

export default reservasSlice.reducer;