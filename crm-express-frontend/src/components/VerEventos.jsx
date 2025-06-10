import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Alert
} from '@mui/material';

const VerEventos = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    let user = null;
    try {
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
    if (!user) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    // Reemplaza la URL por tu endpoint real
    axios.get(`/api/eventos?userId=${user.id_usuario_crm}`, {
      headers: {
        'x-id-usuario-crm': user.id_usuario_crm,
        'x-created-by': user.created_by,
      },
    })
      .then(({ data }) => {
        // data debe ser un array de eventos: [{ id, title, start, end }, ...]
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error cargando eventos:', err);
        setError('No se pudieron cargar los eventos');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Calendario de eventos
      </Typography>
      <Box sx={{ '& .fc': { backgroundColor: 'white' } }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          height="auto"
        />
      </Box>
    </Container>
  );
};

export default VerEventos;
