import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

const CrearEventoModal = ({ open, onClose, evento, modoEdicion,contacto}) => {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [idContacto, setIdContacto] = useState('');
 
const [user, setUser] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem('user_crm');
  if (stored) {
    setUser(JSON.parse(stored));
  }
}, []);

  // Rellenar los campos al abrir el modal
  useEffect(() => {
    if (open && modoEdicion && evento) {
      setTitulo(evento.nombre_evento || '');
      setFecha(evento.fecha_evento?.slice(0, 10) || ''); // YYYY-MM-DD
      setHora(evento.hora_evento?.slice(11, 16) || ''); // HH:mm (corrige esto si hora viene en formato completo)
      setDescripcion(evento.descripcion_corta || '');
      // Coger el id del contacto
      const id = Array.isArray(evento.contacto_id)
        ? evento.contacto_id[0]
        : evento.contacto_id;
      setIdContacto(id || '');
    } else if (!open) {
      setTitulo('');
      setFecha('');
      setHora('');
      setDescripcion('');
      setIdContacto('');
    }
  }, [open, modoEdicion, evento]);




  // Guardar edición
  const handleGuardar = async () => {
  if (!user) {
    alert("Usuario no identificado");
    return;
  }
  const payload = {
  nombre_evento: titulo,
  descripcion_corta: descripcion,
  descripcion_larga: "",
  fecha_evento: fecha,
  hora_evento: hora,
  contacto_id: contacto?.id ? Number(contacto.id) : Number(idContacto)
};
  try {
    if (modoEdicion && evento) {
      // EDITAR
      await axios.put(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/evento/${evento.evento_id}`,
        payload,
        {
          headers: {
            'x-id-usuario-crm': user.id_usuario_crm,
            'x-created-by': user.created_by,
          }
        }
      );
      alert("Evento actualizado correctamente");
    } else {
      // CREAR
      await axios.post(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-evento`,
        payload,
        {
          headers: {
            'x-id-usuario-crm': user.id_usuario_crm,
            'x-created-by': user.created_by,
          }
        }
      );
      alert("Evento creado correctamente");
    }
    onClose(true);
  } catch (e) {
    console.error("Error al guardar el evento:", e?.response?.data || e);
    alert("Error al guardar el evento: " + (e?.response?.data?.message || e.message || e));
  }
};





  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>{modoEdicion ? 'Editar evento' : 'Crear evento'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Fecha"
          type="date"
          fullWidth
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hora"
          type="time"
          fullWidth
          value={hora}
          onChange={e => setHora(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={loading}>
          {modoEdicion ? 'Guardar cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearEventoModal;
