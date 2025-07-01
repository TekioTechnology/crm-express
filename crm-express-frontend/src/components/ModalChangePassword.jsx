import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Snackbar, Alert
} from '@mui/material';

const ModalChangePassword = ({ open, onClose, user }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return mostrarSnackbar('Por favor, rellena todos los campos.', 'error');
    }

    if (newPassword !== confirmNewPassword) {
      return mostrarSnackbar('Las contraseñas no coinciden.', 'error');
    }
    // 🐛 LOG: inspeccionamos los datos antes de enviar
  console.log('📦 Enviando al backend:');
  console.log('Headers:', {
    'x-id-usuario-crm': user?.id_usuario_crm,
    'x-created-by': user?.created_by
  });
  console.log('Body:', {
    oldPassword,
    newPassword
  });

    try {
      const res = await fetch('https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-id-usuario-crm': user?.id_usuario_crm,
          'x-created-by': user?.created_by
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      mostrarSnackbar('Contraseña actualizada correctamente.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onClose(); // cerrar modal tras éxito
    } catch (error) {
      mostrarSnackbar(error.message, 'error');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Cambiar contraseña</DialogTitle>
        <DialogContent>
          <TextField
            label="Current password"
            type="password"
            fullWidth
            variant="outlined"         // 👈 AÑADIR ESTO
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"         // 👈 AÑADIR ESTO

            fullWidth
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm new password"
            type="password"
            variant="outlined"         // 👈 AÑADIR ESTO

            fullWidth
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalChangePassword;
