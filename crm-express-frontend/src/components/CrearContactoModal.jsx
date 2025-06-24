import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

const CrearContactoModal = ({ open, onClose, onCreated,contacto }) => {
  const [empresas, setEmpresas] = useState([]);
  const [formData, setFormData] = useState({
    id_empresa_crm: '',
    nombre: '',
    correo_electronico: '',
    telefono_fijo: '',
    telefono: '',
    extension: '',
    cargo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar empresas al abrir el modal
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const userCrm = JSON.parse(localStorage.getItem('user_crm'));
        const res = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas',
          {
            headers: {
              'x-id-usuario-crm': userCrm.id_usuario_crm,
              'x-created-by': userCrm.created_by,
            },
          }
        );
        if (Array.isArray(res.data)) setEmpresas(res.data);
      } catch (err) {
        console.error('Error cargando empresas:', err);
      }
    };

    if (open) fetchEmpresas();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  try {
    const userCrm = JSON.parse(localStorage.getItem('user_crm'));
    if (!userCrm?.id_usuario_crm) {
      setError('No se encontró el usuario autenticado.');
      return;
    }

    if (contacto && contacto.id) {
      // EDITAR contacto
      await axios.put(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/contacto/${contacto.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-id-usuario-crm': userCrm.id_usuario_crm,
            'x-created-by': userCrm.created_by,
          },
        }
      );
      setSuccess('Contacto modificado correctamente.');
    } else {
      // CREAR contacto
      await axios.post(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-contacto',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-id-usuario-crm': userCrm.id_usuario_crm,
            'x-created-by': userCrm.created_by,
          },
        }
      );
      setSuccess('Contacto creado correctamente.');
    }

    setFormData({
      id_empresa_crm: '',
      nombre: '',
      correo_electronico: '',
      telefono_fijo: '',
      telefono: '',
      extension: '',
      cargo: '',
    });
    onCreated && onCreated();
  } catch (err) {
    console.error(err);
    setError(contacto ? 'No se pudo modificar el contacto' : 'No se pudo crear el contacto');
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (contacto) {
    setFormData({
      id_empresa_crm: contacto.id_empresa_crm || '',
      nombre: contacto.nombre || '',
      correo_electronico: contacto.correo_electronico || '',
      telefono_fijo: contacto.telefono_fijo || '',
      telefono: contacto.telefono || '',
      extension: contacto.extension || '',
      cargo: contacto.cargo || '',
    });
  } else {
    setFormData({
      id_empresa_crm: '',
      nombre: '',
      correo_electronico: '',
      telefono_fijo: '',
      telefono: '',
      extension: '',
      cargo: '',
    });
  }
}, [contacto]);





  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
  {contacto ? 'Modify a Contact' : 'Create new Contact'}
</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
         <FormControl fullWidth required>
  <InputLabel>Company</InputLabel>
  <Select
    value={formData.id_empresa_crm}
    name="id_empresa_crm"
    label="Empresa"
    onChange={handleChange}
  >
    {empresas.map((e) => (
      <MenuItem key={e.id} value={e.id}>
        {e.nombre}
      </MenuItem>
    ))}
  </Select>
</FormControl>


          <TextField label="Name" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
          <TextField label="Email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="telefono_fijo" value={formData.telefono_fijo} onChange={handleChange} fullWidth />
          <TextField label="Landline phone" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth />
          <TextField label="Extension" name="extension" value={formData.extension} onChange={handleChange} fullWidth />
          <TextField label="Job Title" name="cargo" value={formData.cargo} onChange={handleChange} fullWidth />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
  {loading ? <CircularProgress size={20} /> : contacto ? 'Modify' : 'Create'}
</Button>

      </DialogActions>
    </Dialog>
  );
};

export default CrearContactoModal;
