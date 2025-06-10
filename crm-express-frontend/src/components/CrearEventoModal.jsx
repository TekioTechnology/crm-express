import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

const CrearEventoModal = ({ open, onClose, empresa, contacto }) => {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const nuevoEvento = {
      nombre_evento: titulo,
      descripcion_corta: descripcion || '',
      descripcion_larga: descripcion || '',
      fecha_evento: fecha,
      hora_evento: hora,
      contacto_id: contacto?.id || null
    };

    setLoading(true);

    try {
      const response = await fetch('https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-id-usuario-crm': '144',
          'x-created-by': 'crm@grupoub.com'
        },
        body: JSON.stringify(nuevoEvento)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear el evento');
      }

      console.log('✅ Evento creado:', result);
      onClose(); // cerrar modal tras éxito
    } catch (error) {
      console.error('❌ Error al crear evento:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Crear evento
        {empresa && (
          <Typography variant="subtitle2">Empresa: {empresa.nombre}</Typography>
        )}
        {contacto && (
          <Typography variant="subtitle2">Contacto: {contacto.nombre}</Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box display="grid" gridTemplateColumns="1fr" gap={2}>
          <TextField
            label="Título del evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Hora"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!titulo || !fecha || !hora || !contacto?.id || loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearEventoModal;
