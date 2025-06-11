import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import axios from 'axios';

const CrearOportunidadModal = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [nombreOportunidad, setNombreOportunidad] = useState('');
  const [leadEmpresa, setLeadEmpresa] = useState('');
  const [seguimiento, setSeguimiento] = useState('');
  const [listado, setListado] = useState('');
  const [valor, setValor] = useState('');




  // 1) Cargar usuario
  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  // 2) Cuando user esté listo, cargar empresas con encabezados
  useEffect(() => {
    if (!user) return;
    const fetchEmpresas = async () => {
      try {
        const res = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );
        setEmpresas(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error al cargar empresas', error);
      }
    };
    fetchEmpresas();
  }, [user]);

  const handleSubmit = async () => {
  if (!selectedEmpresa || !user) {
    console.warn('Faltan datos obligatorios.');
    return;
  }

  const payload = {
    id_empresa_crm: selectedEmpresa.id,
    nombre_empresa: selectedEmpresa.nombre, // ✅ Este campo es necesario
    nombre_oportunidad: nombreOportunidad,
    lead_empresa: leadEmpresa,
    seguimiento,
    listado,
    valor_oportunidad: parseFloat(valor),
    created_by: user.created_by
  };

  console.log('📦 Payload que se enviará:', payload);

  try {
    await axios.post(
      'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/crear-oportunidad',
      payload,
      {
        headers: {
          'x-id-usuario-crm': user.id_usuario_crm,
          'x-created-by': user.created_by,
        },
      }
    );
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
            const emp = empresas.find(x => x.id === parseInt(e.target.value));
            setSelectedEmpresa(emp || null);
          }}
          sx={{ mb: 2 }}
        >
          {empresas.map(emp => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Resto de campos igual */}
        <TextField
          label="Nombre de la oportunidad"
          fullWidth value={nombreOportunidad}
          onChange={e => setNombreOportunidad(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Persona de contacto (lead)"
          fullWidth value={leadEmpresa}
          onChange={e => setLeadEmpresa(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Seguimiento"
          fullWidth value={seguimiento}
          onChange={e => setSeguimiento(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Listado"
          fullWidth value={listado}
          onChange={e => setListado(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Valor oportunidad (€)"
          type="number" fullWidth value={valor}
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
