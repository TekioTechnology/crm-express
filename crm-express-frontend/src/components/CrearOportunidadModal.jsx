import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Checkbox, FormControlLabel, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const LEAD_OPTIONS = [
  { value: 'Pending data collection', label: 'Pending data collection' },
  { value: 'Initial proposal launched', label: 'Initial proposal launched' },
  { value: 'Pending budget preparation', label: 'Pending budget preparation' },
  { value: 'Pending HR profile', label: 'Pending HR profile' },
  { value: 'Pending preliminary project draft', label: 'Pending preliminary project draft' },
  { value: 'Pending budget submission', label: 'Pending budget submission' },
  { value: 'Pending client decision', label: 'Pending client decision' },
  { value: 'Pending Central Management decision', label: 'Pending Central Management decision' },
  { value: 'Negotiation/Review', label: 'Negotiation/Review' }
];

const CrearOportunidadModal = ({ open, onClose, oportunidad, empresas = [], onCreated }) => {
  const [user, setUser] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [nombreOportunidad, setNombreOportunidad] = useState('');
  const [leadChecked, setLeadChecked] = useState(false);
  const [leadEmpresa, setLeadEmpresa] = useState('');
  const [seguimiento, setSeguimiento] = useState('');
  const [listado, setListado] = useState('');
  const [valor, setValor] = useState('');
  const [businessArea, setBusinessArea] = useState('');
  const [zone, setZone] = useState('');



  const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success', // o 'error', 'info', etc.
});


const mostrarSnackbar = (message, severity = 'success') => {
  setSnackbar({ open: true, message, severity });
};

  // Cargar usuario
  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  // Rellenar datos al abrir el modal según modo (creación o edición)
  useEffect(() => {
    if (open && oportunidad) {
          let empresa = empresas.find(e => e.id === oportunidad.id_empresa_crm);

      // Modo edición
      setSelectedEmpresa({
        id: oportunidad.id_empresa_crm,
      nombre: empresa ? empresa.nombre : oportunidad.nombre_empresa || ''
      });
      setNombreOportunidad(oportunidad.nombre_oportunidad || '');
      setBusinessArea(oportunidad.business_area || '');
      setZone(oportunidad.zone || '');
      setLeadChecked(!!oportunidad.lead_empresa);
      setLeadEmpresa(oportunidad.lead_empresa || '');
      setSeguimiento(oportunidad.seguimiento || '');
      setListado(oportunidad.listado || '');
      setValor(oportunidad.valor_oportunidad || '');
    } else if (open) {
      // Modo creación
      setSelectedEmpresa(null);
      setNombreOportunidad('');
      setLeadChecked(false);
      setLeadEmpresa('');
      setSeguimiento('');
      setListado('');
      setValor('');
      setBusinessArea('');
      setZone('');
    }
  }, [open, oportunidad,empresas]);

 const handleSubmit = async () => {
  if (!selectedEmpresa || !user) {
    mostrarSnackbar('Faltan datos obligatorios.', 'error');
    return;
  }

  // Construye el payload base
 const payload = {
  nombre_empresa: selectedEmpresa.nombre,
  nombre_oportunidad: nombreOportunidad,
  lead_empresa: leadChecked ? leadEmpresa : '',
  id_empresa_crm: selectedEmpresa.id,
  valor_oportunidad: parseFloat(valor),
  created_by: user.created_by, // OJO: debe ir el correo del usuario actual
  bussiness_area: businessArea,
  zone: zone
};

  // Añade id_empresa_crm solo en creación
  if (!oportunidad) {
    payload.id_empresa_crm = selectedEmpresa.id;
  }

  try {
    if (oportunidad) {
      // PUT editar
      await axios.put(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/oportunidad/${oportunidad.id_oportunidad}`,
        payload,
        {
          headers: {
            'x-id-usuario-crm': user.id_usuario_crm,
            'x-created-by': user.created_by,
          },
        }
      );
      mostrarSnackbar('Oportunidad actualizada correctamente', 'success');
      if (onCreated) onCreated();
      onClose();
    } else {
      // POST crear
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
      mostrarSnackbar('Oportunidad creada correctamente', 'success');
      if (onCreated) onCreated();
      onClose();
    }
  } catch (err) {
    console.error('❌ Error al guardar oportunidad:', err);
    // Muestra siempre el mensaje de error y NO cierres el modal
    let msg = 'Error al guardar la oportunidad';
    if (err?.response?.data?.message) {
      msg += `: ${err.response.data.message}`;
    }
    mostrarSnackbar(msg, 'error');
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{oportunidad ? 'Edit Opportunity' : 'Create Opportunity'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Company"
          select
          fullWidth
          value={selectedEmpresa?.id || ''}
          onChange={e => {
            const emp = empresas.find(x => x.id === parseInt(e.target.value));
            setSelectedEmpresa(emp || null);
          }}
          sx={{ mb: 2 }}
          disabled={!!oportunidad}
        >
          {empresas.map(emp => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Opportunity Name"
          fullWidth
          value={nombreOportunidad}
          onChange={e => setNombreOportunidad(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Business area"
          fullWidth
          value={businessArea}
          onChange={e => setBusinessArea(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Zone"
          fullWidth
          value={zone}
          onChange={e => setZone(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={leadChecked}
              onChange={e => {
                setLeadChecked(e.target.checked);
                if (!e.target.checked) setLeadEmpresa('');
              }}
            />
          }
          label="Lead"
          sx={{ mb: 1 }}
        />

        {leadChecked && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Lead status</InputLabel>
            <Select
              value={leadEmpresa}
              label="Lead status"
              onChange={e => setLeadEmpresa(e.target.value)}
            >
              {LEAD_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Opportunity value (€)"
          type="number"
          fullWidth
          value={valor}
          onChange={e => setValor(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {oportunidad ? 'Edit' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearOportunidadModal;
