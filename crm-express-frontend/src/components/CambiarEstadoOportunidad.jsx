import React, { useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const CambiarEstadoOportunidad = ({ idOportunidad, idEmpresa, user }) => {
  const [estado, setEstado] = useState(""); // Este será el estado actual
  const [estados, setEstados] = useState([
    { value: "winner", label: "Winner" },
    { value: "lost", label: "Lost" },
    { value: "pending", label: "Pending" }
    // Puedes añadir aquí más estados si necesitas
  ]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Al montar, traemos el estado actual real de la oportunidad
    const obtenerEstadoActual = async () => {
      try {
        const res = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/estados-oportunidad'
        );
        // Filtra los estados solo de la oportunidad actual
        const estadosFiltrados = res.data.filter(
          (e) => e.id_oportunidad === idOportunidad
        );
        // Coge el último por id (el más reciente)
        const ultimoEstado = estadosFiltrados.sort((a, b) => b.id - a.id)[0];
        setEstado(ultimoEstado ? ultimoEstado.status : ""); // Si no hay, pon vacío
      } catch (error) {
        console.error("❌ Error al obtener estado actual:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEstadoActual();
  }, [idOportunidad]);

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
      label="Status the opportunity"
      size="small"
      fullWidth
      value={estado}
      onChange={handleChangeEstado}
      disabled={cargando}
      helperText={cargando ? "Cargando estado..." : ""}
    >
      {estados.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CambiarEstadoOportunidad;
