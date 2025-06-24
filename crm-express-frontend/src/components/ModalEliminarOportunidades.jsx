import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, IconButton, List, ListItem, ListItemText,
  Box, ListItemSecondaryAction, Tooltip, TextField, CircularProgress,
  Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const ModalListaEliminarOportunidades = ({
  open,
  onClose,
  user,
  empresas
}) => {
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [oportunidadAEliminar, setOportunidadAEliminar] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Obtener oportunidades cuando se abre el modal
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    axios.get("https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/oportunidades", {
      headers: {
        "x-id-usuario-crm": user.id_usuario_crm,
        "x-created-by": user.created_by
      }
    })
    .then(res => setOportunidades(res.data || []))
    .catch(() => setOportunidades([]))
    .finally(() => setLoading(false));
  }, [open, user]);

  // Buscar empresa por id
  const getEmpresaNombre = (id) => {
    const emp = empresas.find(e => e.id === id);
    return emp ? emp.nombre : "-";
  };

  // Filtrado de oportunidades por búsqueda
  const oportunidadesFiltradas = oportunidades.filter(o =>
    (o.nombre_oportunidad || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (o.lead_empresa || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (o.zone || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (o.business_area || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    getEmpresaNombre(o.id_empresa_crm).toLowerCase().includes(busqueda.toLowerCase())
  );

  // Eliminar oportunidad (confirmación)
  const eliminarOportunidad = async () => {
    if (!oportunidadAEliminar) return;
    try {
      await axios.delete(
        `https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/oportunidad/${oportunidadAEliminar.id_oportunidad}`,
        {
          headers: {
            "x-id-usuario-crm": user.id_usuario_crm,
            "x-created-by": user.created_by
          }
        }
      );
      setSnackbar({ open: true, message: "Opportunity deleted successfully.", severity: "success" });
      setOportunidades(oportunidades => oportunidades.filter(o => o.id_oportunidad !== oportunidadAEliminar.id_oportunidad));
      setConfirmOpen(false);
      setOportunidadAEliminar(null);
    } catch {
      setSnackbar({ open: true, message: "Error deleting the opportunity.", severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Delete Opportunity</DialogTitle>
        <DialogContent>
          <Typography color="error" fontWeight="bold" sx={{ mb: 2 }}>
            Warning: If you delete an opportunity, this action cannot be undone.
          </Typography>
          <TextField
            label="Search opportunity"
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
              {oportunidadesFiltradas.map(oportunidad => (
                <ListItem key={oportunidad.id_oportunidad} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <b>{oportunidad.nombre_oportunidad}</b> ({getEmpresaNombre(oportunidad.id_empresa_crm)})
                        <br />
                        <Typography variant="body2" component="span">
                          {oportunidad.business_area && <span>Area: {oportunidad.business_area}</span>}
                          {oportunidad.zone && <span> &nbsp; | &nbsp; Zone: {oportunidad.zone}</span>}
                        </Typography>
                      </>
                    }
                    secondary={
                      <Typography variant="body2">
                        Lead: {oportunidad.lead_empresa || "-"}
                        {oportunidad.valor_oportunidad && (
                          <> &nbsp; | &nbsp; Value: {Number(oportunidad.valor_oportunidad).toLocaleString("en-US", { style: "currency", currency: "EUR" })}</>
                        )}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete opportunity">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => {
                          setOportunidadAEliminar(oportunidad);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {oportunidadesFiltradas.length === 0 && (
                <Typography variant="body2" sx={{ mt: 2 }}>No opportunities found.</Typography>
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
            Are you sure you want to delete opportunity <b>{oportunidadAEliminar?.nombre_oportunidad}</b>?
            <br />
            <span style={{ color: "red", fontWeight: 600 }}>
              This action is irreversible.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={eliminarOportunidad} color="error" variant="contained">
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

export default ModalListaEliminarOportunidades;
