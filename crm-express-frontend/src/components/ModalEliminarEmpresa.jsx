import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ModalEliminarEmpresa = ({ open, onClose, onDeleted, user }) => {
  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && user) {
      axios.get('https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas', {
        headers: {
          'x-id-usuario-crm': user.id_usuario_crm,
          'x-created-by': user.created_by,
        }
      })
        .then(res => setEmpresas(res.data))
        .catch(err => console.error('Error al cargar empresas', err));
    }
  }, [open, user]);

  const handleClickEliminar = (empresa) => {
    setEmpresaAEliminar(empresa);
    setConfirmOpen(true);
  };

  const handleConfirmEliminar = async () => {
    if (!empresaAEliminar) return;
    try {
      await axios.delete(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresa/${empresaAEliminar.id}`
      );
      setEmpresas(prev => prev.filter(e => e.id !== empresaAEliminar.id));
      setConfirmOpen(false);
      setEmpresaAEliminar(null);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error('Error al eliminar empresa', err);
      alert('Error al eliminar la empresa');
      setConfirmOpen(false);
    }
  };

  const empresasFiltradas = empresas.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Delete company</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Buscar empresa"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <List dense>
            {empresasFiltradas.length > 0 ? (
              empresasFiltradas.map(empresa => (
                <ListItem
                  key={empresa.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleClickEliminar(empresa)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={empresa.nombre}
                    secondary={empresa.comunidad || 'Sin comunidad'}
                  />
                </ListItem>
              ))
            ) : (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron empresas.
                </Typography>
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            Are you sure you want to delete the company? <b>{empresaAEliminar?.nombre}</b>?
          </Typography>
          <Typography variant="body2" color="error">
            All associated <b>contacts and opportunities will also be deleted</b>. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
           Cancel
          </Button>
          <Button onClick={handleConfirmEliminar} color="error" variant="contained">
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEliminarEmpresa;
