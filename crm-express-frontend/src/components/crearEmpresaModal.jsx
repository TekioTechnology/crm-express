// src/components/crearEmpresaModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const CrearEmpresaModal = ({ open, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    oportunidades: '',
    codigo_postal: '',
    comunidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userCrm = JSON.parse(localStorage.getItem('user_crm'));

      if (!userCrm?.id_usuario_crm || !userCrm?.created_by) {
        setError('No se encontró el usuario autenticado.');
        return;
      }

      await axios.post(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-empresa',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-id-usuario-crm': userCrm.id_usuario_crm,
            'x-created-by': userCrm.created_by,
          },
        }
      );

      setSuccess('Empresa creada correctamente.');
      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        oportunidades: '',
        codigo_postal: '',
        comunidad: '',
      });
      onCreated(); // para cerrar modal o refrescar lista
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nueva Empresa</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
          <TextField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth />
          <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth />
          <TextField label="Oportunidades" name="oportunidades" value={formData.oportunidades} onChange={handleChange} fullWidth />
          <TextField label="Código Postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} fullWidth />
          <TextField label="Comunidad" name="comunidad" value={formData.comunidad} onChange={handleChange} fullWidth />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearEmpresaModal;
