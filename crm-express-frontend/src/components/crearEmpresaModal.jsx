// src/components/crearEmpresaModal.jsx
import React, { useState ,useEffect} from 'react';
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

const CrearEmpresaModal = ({ open, onClose, onCreated,empresa }) => {
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

    if (empresa && empresa.id) {
      // EDITAR empresa
      await axios.put(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresa/${empresa.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-id-usuario-crm': userCrm.id_usuario_crm,
            'x-created-by': userCrm.created_by,
          },
        }
      );
      setSuccess('Empresa modificada correctamente.');
    } else {
      // CREAR empresa
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
    }

    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      oportunidades: '',
      codigo_postal: '',
      comunidad: '',
    });
    onCreated();
  } catch (err) {
    console.error(err);
    setError(empresa ? 'No se pudo modificar la empresa' : 'No se pudo crear la empresa');
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
  if (empresa) {
    setFormData({
      nombre: empresa.nombre || '',
      direccion: empresa.direccion || '',
      telefono: empresa.telefono || '',
      oportunidades: empresa.oportunidades || '',
      codigo_postal: empresa.codigo_postal || '',
      comunidad: empresa.comunidad || '',
    });
  } else {
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      oportunidades: '',
      codigo_postal: '',
      comunidad: '',
    });
  }
}, [empresa]);



  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
     <DialogTitle>
  {empresa ? 'Modify a Company' : 'Create new Company'}
</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField label="Name" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
          <TextField label="Direction" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth />
          <TextField label="Zip code" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} fullWidth />
          <TextField label="Community" name="comunidad" value={formData.comunidad} onChange={handleChange} fullWidth />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
       <Button onClick={handleSubmit} variant="contained" disabled={loading}>
  {loading ? <CircularProgress size={20} /> : empresa ? 'Modify' : 'Create'}
</Button>

      </DialogActions>
    </Dialog>
  );
};

export default CrearEmpresaModal;
