// src/components/CrearOportunidadModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Stack
} from '@mui/material';
import axios from 'axios';

const CrearOportunidadModal = ({ open, onClose, empresas, contactos, onCreated }) => {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    id_empresa: '',
    id_contacto: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async () => {
  console.log('👉 Enviando payload:', form);
  try {
    await axios.post('https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-oportunidad', form);
    if (onCreated) onCreated();
    onClose();
  } catch (error) {
    console.error('❌ Error al crear oportunidad:', error);
    alert('Error al crear oportunidad');
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Oportunidad</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Título"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            select
            label="Empresa"
            name="id_empresa"
            value={form.id_empresa}
            onChange={handleChange}
            fullWidth
          >
            {empresas.map(emp => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Contacto"
            name="id_contacto"
            value={form.id_contacto}
            onChange={handleChange}
            fullWidth
          >
            {contactos.map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearOportunidadModal;
