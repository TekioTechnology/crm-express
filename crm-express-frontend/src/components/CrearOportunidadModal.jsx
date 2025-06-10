import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material';
import axios from 'axios';

const CrearOportunidadModal = ({ open, onClose }) => {
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [nombreOportunidad, setNombreOportunidad] = useState('');
  const [leadEmpresa, setLeadEmpresa] = useState('');
  const [seguimiento, setSeguimiento] = useState('');
  const [listado, setListado] = useState('');
  const [valor, setValor] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      const stored = localStorage.getItem('user_crm');
      if (stored) setUser(JSON.parse(stored));
    };

    const fetchEmpresas = async () => {
      try {
        const res = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas'
        );
        setEmpresas(res.data);
      } catch (error) {
        console.error('Error al cargar empresas', error);
      }
    };

    fetchUser();
    fetchEmpresas();
  }, []);

  const handleSubmit = async () => {
    if (!selectedEmpresa || !user) {
      console.warn('Faltan datos obligatorios.');
      return;
    }

    const payload = {
      nombre_empresa: selectedEmpresa.nombre,
      nombre_oportunidad: nombreOportunidad,
      lead_empresa: leadEmpresa,
      id_empresa_crm: selectedEmpresa.id,
      seguimiento,
      listado,
      valor_oportunidad: parseFloat(valor),
      created_by: user.created_by
    };

    try {
      const res = await axios.post(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-oportunidad',
        payload
      );
      console.log('✅ Oportunidad creada:', res.data);
      onClose();
    } catch (err) {
      console.error('❌ Error al crear oportunidad:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Oportunidad</DialogTitle>
      <DialogContent>
        <TextField
          label="Empresa"
          select
          fullWidth
          value={selectedEmpresa?.id || ''}
          onChange={e => {
            const empresa = empresas.find(emp => emp.id === parseInt(e.target.value));
            setSelectedEmpresa(empresa);
          }}
          sx={{ mb: 2 }}
        >
          {empresas.map(emp => (
            <MenuItem key={emp.id} value={emp.id}>{emp.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Nombre de la oportunidad"
          fullWidth
          value={nombreOportunidad}
          onChange={e => setNombreOportunidad(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Persona de contacto (lead)"
          fullWidth
          value={leadEmpresa}
          onChange={e => setLeadEmpresa(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Seguimiento"
          fullWidth
          value={seguimiento}
          onChange={e => setSeguimiento(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Listado"
          fullWidth
          value={listado}
          onChange={e => setListado(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Valor oportunidad (€)"
          type="number"
          fullWidth
          value={valor}
          onChange={e => setValor(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearOportunidadModal;
