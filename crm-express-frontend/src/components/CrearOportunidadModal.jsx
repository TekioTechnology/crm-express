import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Checkbox, FormControlLabel, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

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


const CrearOportunidadModal = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [nombreOportunidad, setNombreOportunidad] = useState('');
  const [leadChecked, setLeadChecked] = useState(false);
  const [leadEmpresa, setLeadEmpresa] = useState('');
  const [seguimiento, setSeguimiento] = useState('');
  const [listado, setListado] = useState('');
  const [valor, setValor] = useState('');
  const [businessArea, setBusinessArea] = useState('');
  const [zone, setZone] = useState('');

  // Cargar usuario
  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  // Cargar empresas
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

  // Reset campos al abrir/cerrar
  useEffect(() => {
    if (!open) {
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
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedEmpresa || !user) {
      console.warn('Faltan datos obligatorios.');
      return;
    }

    const payload = {
      id_empresa_crm: selectedEmpresa.id,
      nombre_empresa: selectedEmpresa.nombre,
      nombre_oportunidad: nombreOportunidad,
      business_area: businessArea,
      zone: zone,
      lead_empresa: leadChecked ? leadEmpresa : '',
      seguimiento,
      listado,
      valor_oportunidad: parseFloat(valor),
      created_by: user.created_by
    };

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
      <DialogTitle>Create Opportunity</DialogTitle>
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

        {/* Nuevo campo Business area */}
        <TextField
          label="Business area"
          fullWidth
          value={businessArea}
          onChange={e => setBusinessArea(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Nuevo campo Zone */}
        <TextField
          label="Zone"
          fullWidth
          value={zone}
          onChange={e => setZone(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Campo Lead con checkbox y select */}
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
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearOportunidadModal;
