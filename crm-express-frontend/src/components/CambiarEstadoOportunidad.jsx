import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const CambiarEstadoOportunidad = ({ idOportunidad, idEmpresa, user }) => {
  const [estado, setEstado] = useState('in_progress');

  const handleChangeEstado = async (e) => {
    const nuevoEstado = e.target.value;
    setEstado(nuevoEstado);

    try {
      await axios.post(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/actualizar-status-oportunidad',
        {
          status: nuevoEstado,
          id_oportunidad: idOportunidad,
          id_empresa: idEmpresa
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-id-usuario-crm': user.id_usuario_crm,
            'x-created-by': user.created_by
          }
        }
      );
      console.log('✅ Estado actualizado correctamente');
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
    }
  };

  return (
    <TextField
      select
      label="Estado de oportunidad"
      size="small"
      fullWidth
      value={estado}
      onChange={handleChangeEstado}
    >
      <MenuItem value="in_progress">En progreso</MenuItem>
      <MenuItem value="winner">Ganada</MenuItem>
      <MenuItem value="loss">Perdida</MenuItem>
    </TextField>
  );
};

export default CambiarEstadoOportunidad;
