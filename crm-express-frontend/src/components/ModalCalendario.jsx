import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';

const ModalCalendario = ({ open, onClose }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.created_by) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('❌ Error parsing user_crm:', e);
    }
  }, []);

  useEffect(() => {
    if (open && user) {
      fetchEventos();
    }
  }, [open, user]);

  const fetchEventos = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/eventos',
        {
          headers: {
            'x-id-usuario-crm': user.id_usuario_crm,
            'x-created-by': user.created_by,
          },
        }
      );
      setEventos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error al obtener eventos:', error);
      setError('Error al cargar los eventos. Por favor, intenta de nuevo.');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventosForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fecha_evento).toISOString().split('T')[0];
      return eventoDate === dateStr;
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderEventDetail = () => {
    if (!selectedEvent) return null;
    return (
      <Card sx={{ mt: 2, backgroundColor: '#f8f9fa' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h3">
              {selectedEvent.nombre_evento}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Date:</strong> {formatDate(selectedEvent.fecha_evento)}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Hour:</strong> {formatTime(selectedEvent.hora_evento)}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Description:</strong> {selectedEvent.descripcion_corta}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BusinessIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              <strong>Company:</strong> {selectedEvent.empresa_nombre}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              <strong>Contact:</strong> {selectedEvent.contacto_nombre}
              {selectedEvent.cargo && ` - ${selectedEvent.cargo}`}
            </Typography>
          </Box>

          <Box sx={{ ml: 4 }}>
            {selectedEvent.correo_electronico && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.correo_electronico}
                </Typography>
              </Box>
            )}

            {selectedEvent.telefono && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.telefono}
                  {selectedEvent.extension && ` ext. ${selectedEvent.extension}`}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderCalendar = () => {
    const days = generateCalendarDays();
    const monthHeader = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
    const dayNames = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(1970, 0, 4 + i); // Sunday start
      dayNames.push(new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d));
    }

    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => changeMonth(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">{monthHeader}</Typography>
          <IconButton onClick={() => changeMonth(1)}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
          {dayNames.map(day => (
            <Box key={day} sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, minHeight: '300px' }}>
          {days.map((day, idx) => {
            const eventosDelDia = getEventosForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <Paper
                key={idx}
                elevation={eventosDelDia.length > 0 ? 2 : 0}
                sx={{
                  minHeight: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: eventosDelDia.length > 0 ? 'pointer' : 'default',
                  backgroundColor: eventosDelDia.length > 0
                    ? '#4caf50'
                    : isToday
                      ? '#e3f2fd'
                      : 'transparent',
                  color: eventosDelDia.length > 0
                    ? 'white'
                    : isCurrentMonth
                      ? 'text.primary'
                      : 'text.disabled',
                  opacity: isCurrentMonth ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': eventosDelDia.length > 0
                    ? { backgroundColor: '#388e3c', transform: 'scale(1.05)' }
                    : {},
                  border: isToday ? '2px solid #2196f3' : 'none'
                }}
                onClick={() => eventosDelDia.length > 0 && setSelectedEvent(eventosDelDia[0])}
              >
                <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
                  {day.getDate()}
                </Typography>
                {eventosDelDia.length > 0 && (
                  <Tooltip title={`${eventosDelDia.length} event(s)`}>
                    <Chip
                      size="small"
                      label={eventosDelDia.length}
                      sx={{ height: 16, fontSize: '0.6rem', backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', mt: 0.5 }}
                    />
                  </Tooltip>
                )}
              </Paper>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Calendar of Events
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            {eventos.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events registered
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Events will appear here once created
                </Typography>
              </Box>
            ) : (
              <>
                {renderCalendar()}
                {selectedEvent && renderEventDetail()}
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalCalendario;
