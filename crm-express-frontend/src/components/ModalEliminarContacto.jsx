import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, IconButton, List, ListItem, ListItemText,
  Box, ListItemSecondaryAction, Tooltip, TextField, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

const ModalListaEliminarContactos = ({
  open,
  onClose,
  user,
  empresas
}) => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [contactoAEliminar, setContactoAEliminar] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Obtener contactos cuando se abre el modal
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    axios.get("https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/contactos", {
      headers: {
        "x-id-usuario-crm": user.id_usuario_crm,
        "x-created-by": user.created_by
      }
    })
    .then(res => setContactos(res.data || []))
    .catch(() => setContactos([]))
    .finally(() => setLoading(false));
  }, [open, user]);

  // Buscar empresa por id
  const getEmpresaNombre = (id) => {
    const emp = empresas.find(e => e.id === id);
    return emp ? emp.nombre : "-";
  };

  // Filtrado de contactos por búsqueda
  const contactosFiltrados = contactos.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.correo_electronico || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.cargo || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    getEmpresaNombre(c.id_empresa_crm).toLowerCase().includes(busqueda.toLowerCase())
  );

  // Eliminar contacto (confirmación)
  const eliminarContacto = async () => {
    if (!contactoAEliminar) return;
    try {
      await axios.delete(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/contacto/${contactoAEliminar.id}`,
        {
          headers: {
            "x-id-usuario-crm": user.id_usuario_crm,
            "x-created-by": user.created_by
          }
        }
      );
      setSnackbar({ open: true, message: "Contact deleted successfully.", severity: "success" });
      setContactos(contactos => contactos.filter(c => c.id !== contactoAEliminar.id));
      setConfirmOpen(false);
      setContactoAEliminar(null);
    } catch {
      setSnackbar({ open: true, message: "Error deleting the contact.", severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography color="error" fontWeight="bold" sx={{ mb: 2 }}>
            Warning: If you delete a contact, all events associated with it will be permanently deleted.
          </Typography>
          <TextField
            label="Search contact"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {loading ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : (
            <List>
              {contactosFiltrados.map(contacto => (
                <ListItem key={contacto.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <b>{contacto.nombre}</b> ({getEmpresaNombre(contacto.id_empresa_crm)})
                        <br />
                        <Typography variant="body2" component="span">{contacto.cargo}</Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Email: {contacto.correo_electronico || "-"}
                          {contacto.telefono_fijo && <> &nbsp; | &nbsp; Phone: {contacto.telefono_fijo}</>}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete contact">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => {
                          setContactoAEliminar(contacto);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {contactosFiltrados.length === 0 && (
                <Typography variant="body2" sx={{ mt: 2 }}>No contacts found.</Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <b>{contactoAEliminar?.nombre}</b>?
            <br />
            <span style={{ color: "red", fontWeight: 600 }}>
              This action will also delete all events associated with this contact.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={eliminarContacto} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ModalListaEliminarContactos;
