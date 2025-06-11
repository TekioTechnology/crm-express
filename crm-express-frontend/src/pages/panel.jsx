import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, Button, useTheme, useMediaQuery, Stack,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
  Container, Alert, Tooltip, Chip,TextField, MenuItem, IconButton as MuiIconButton, InputAdornment
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';

import CrearEmpresaModal from '../components/crearEmpresaModal';
import CrearContactoModal from '../components/CrearContactoModal';
import CrearEventoModal from '../components/CrearEventoModal';
import ModalCalendario from '../components/ModalCalendario';
import CrearOportunidadModal from '../components/CrearOportunidadModal';
import CambiarEstadoOportunidad from '../components/CambiarEstadoOportunidad';


const Panel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCrearEmpresa, setOpenCrearEmpresa] = useState(false);
  const [user, setUser] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [loadingContactos, setLoadingContactos] = useState(true);
  const [loadingOportunidades, setLoadingOportunidades] = useState(true);
  const [error, setError] = useState(null);

  const [openCrearContacto, setOpenCrearContacto] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const [openCrearEvento, setOpenCrearEvento] = useState(false);
  const [empresaEventoSeleccionada, setEmpresaEventoSeleccionada] = useState(null);
  const [contactoEventoSeleccionado, setContactoEventoSeleccionado] = useState(null);
  const [openCalendario, setOpenCalendario] = useState(false);
  const [openCrearOportunidad, setOpenCrearOportunidad] = useState(false);


// ... dentro del componente Panel
const [filtro, setFiltro] = useState('');


  // Cargar usuario desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user_crm');
    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.created_by) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('❌ Error parsing user_crm:', e);
      localStorage.removeItem('user_crm');
      setError('Error al cargar datos del usuario');
    }
  }, []);

  // Obtener empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      if (!user) return;
      
      setLoadingEmpresas(true);
      setError(null);
      
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );

        setEmpresas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al obtener empresas:', error);
        setError('Error al cargar las empresas. Por favor, intenta de nuevo.');
        setEmpresas([]);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    fetchEmpresas();
  }, [user]);

  // Obtener contactos
  useEffect(() => {
    const fetchContactos = async () => {
      if (!user) return;
      
      setLoadingContactos(true);
      
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/contactos',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );

        setContactos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al obtener contactos:', error);
        setContactos([]);
      } finally {
        setLoadingContactos(false);
      }
    };

    fetchContactos();
  }, [user]);

  // Obtener oportunidades
  useEffect(() => {
    const fetchOportunidades = async () => {
      if (!user) return;
      
      setLoadingOportunidades(true);
      
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/oportunidades',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );

        setOportunidades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al obtener oportunidades:', error);
        setOportunidades([]);
      } finally {
        setLoadingOportunidades(false);
      }
    };

    fetchOportunidades();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user_crm');
    window.location.href = '/';
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleEmpresaCreated = () => {
    setOpenCrearEmpresa(false);
    // Recargar empresas
    const fetchEmpresas = async () => {
      if (!user) return;
      
      setLoadingEmpresas(true);
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/empresas',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );
        setEmpresas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al recargar empresas:', error);
        setError('Error al recargar las empresas');
      } finally {
        setLoadingEmpresas(false);
      }
    };
    fetchEmpresas();
  };

  const handleContactoCreated = () => {
    setOpenCrearContacto(false);
    // Recargar contactos
    const fetchContactos = async () => {
      if (!user) return;
      
      setLoadingContactos(true);
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/contactos',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );
        setContactos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al recargar contactos:', error);
      } finally {
        setLoadingContactos(false);
      }
    };
    fetchContactos();
  };

  const handleOportunidadCreated = () => {
    setOpenCrearOportunidad(false);
    // Recargar oportunidades
    const fetchOportunidades = async () => {
      if (!user) return;
      
      setLoadingOportunidades(true);
      try {
        const { data } = await axios.get(
          'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/oportunidades',
          {
            headers: {
              'x-id-usuario-crm': user.id_usuario_crm,
              'x-created-by': user.created_by,
            },
          }
        );
        setOportunidades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al recargar oportunidades:', error);
      } finally {
        setLoadingOportunidades(false);
      }
    };
    fetchOportunidades();
  };

  // Función para obtener los contactos de una empresa específica
  const getContactosPorEmpresa = (empresaId) => {
    return contactos.filter(contacto => contacto.id_empresa_crm === empresaId);
  };

  // Función para obtener las oportunidades de una empresa específica
  const getOportunidadesPorEmpresa = (empresaId) => {
    return oportunidades.filter(oportunidad => oportunidad.id_empresa_crm === empresaId);
  };

  // Función para formatear valor monetario
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const drawerContent = (
    <Box sx={{ width: 240, pt: isMobile ? 2 : 8 }}>
      <List>
        <ListItem>
          <ListItemText
            primary={`Hola, ${user?.created_by || 'Usuario'}`}
            primaryTypographyProps={{ fontWeight: 'bold' }}
          />
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenCalendario(true)}>
            <ListItemIcon><EventIcon /></ListItemIcon>
            <ListItemText primary="View Events" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Total contacts" secondary={contactos.length} />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><BusinessIcon /></ListItemIcon>
            <ListItemText primary="Total companies" secondary={empresas.length} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><TrendingUpIcon /></ListItemIcon>
            <ListItemText primary="Total opportunities" secondary={oportunidades.length} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const renderEmpresas = () => {
  const empresasFiltradas = empresas.filter((empresa) => {
    const texto = filtro.toLowerCase();
    const nombreEmpresa = empresa.nombre?.toLowerCase() || '';
    const comunidad = empresa.comunidad?.toLowerCase() || '';
    const contactosEmpresa = getContactosPorEmpresa(empresa.id);
    const nombresContactos = contactosEmpresa.map(c => c.nombre?.toLowerCase() || '').join(' ');

    return (
      nombreEmpresa.includes(texto) ||
      comunidad.includes(texto) ||
      nombresContactos.includes(texto)
    );
  });

  if (loadingEmpresas || loadingContactos || loadingOportunidades) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  }

  if (empresasFiltradas.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h2" color="text.secondary" gutterBottom>
          No hay resultados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajusta tu búsqueda o crea una nueva empresa
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {empresasFiltradas.map((empresa) => {
        const contactosEmpresa = getContactosPorEmpresa(empresa.id);
        const oportunidadesEmpresa = getOportunidadesPorEmpresa(empresa.id);

        return (
          <Accordion
            key={empresa.id}
            defaultExpanded={empresasFiltradas.length === 1 || filtro.length > 0}
            sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: '#f9f9f9' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
              <Typography fontWeight="bold" color="primary">
                {empresa.nombre}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                  gap: { xs: 1.5, sm: 2 },
                  mb: 2
                }}
              >
                <Typography variant="body2">📍 <strong>Address</strong><br />{empresa.direccion || 'No especificada'}</Typography>
                <Typography variant="body2">📞 <strong>Phone</strong><br />{empresa.telefono || 'Sin número'}</Typography>
                <Typography variant="body2">🔢 <strong>Zip Code</strong><br />{empresa.codigo_postal || '-'}</Typography>
                <Typography variant="body2">🌍 <strong>Community or City</strong><br />{empresa.comunidad || '-'}</Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Associated contacts</Typography>
                {contactosEmpresa.length > 0 ? (
                  <Box component="ul" sx={{ paddingLeft: '1.2rem', m: 0 }}>
                    {contactosEmpresa.map((contacto) => (
                      <Box key={contacto.id} component="li" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Box sx={{ mb: 0.5 }}><strong>{contacto.nombre}</strong>{contacto.cargo && ` – ${contacto.cargo}`}</Box>
                          <Box>
                            {contacto.correo_electronico && <span>📧 {contacto.correo_electronico}</span>}
                            {(contacto.telefono || contacto.telefono_fijo) && (
                              <span style={{ marginLeft: 10 }}>📱 {contacto.telefono || contacto.telefono_fijo}{contacto.extension && ` ext. ${contacto.extension}`}</span>
                            )}
                          </Box>
                        </Box>
                        <Tooltip title="Crear evento">
                          <IconButton size="small" onClick={() => {
                            setEmpresaEventoSeleccionada(empresa);
                            setContactoEventoSeleccionado(contacto);
                            setOpenCrearEvento(true);
                          }}>
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" fontStyle="italic">There are no contacts registered for this company</Typography>
                )}
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Business Opportunities</Typography>
                {oportunidadesEmpresa.length > 0 ? (
                  <Stack spacing={1.5}>
                    {oportunidadesEmpresa.map((oportunidad) => (
                      <Box key={oportunidad.id_oportunidad} sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, p: 2, border: '1px solid #bbdefb' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>🎯 {oportunidad.nombre_oportunidad}</Typography>
                          <Chip label={formatCurrency(oportunidad.valor_oportunidad)} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                        </Box>
                        <Typography variant="body2">👤 <strong>Lead:</strong> {oportunidad.lead_empresa}</Typography>
                        {oportunidad.seguimiento && <Typography variant="body2">📋 <strong>Follow-up:</strong> {oportunidad.seguimiento}</Typography>}
                        {oportunidad.listado && <Typography variant="body2">📝 <strong>Catalog:</strong> {oportunidad.listado}</Typography>}
                        <Box sx={{ mt: 1 }}>
                          <CambiarEstadoOportunidad
  idOportunidad={oportunidad.id_oportunidad}
  idEmpresa={oportunidad.id_empresa_crm}
  user={user}
/>

                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" fontStyle="italic">There are no business opportunities registered for this company</Typography>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
    );
  };

  return (
      <Box sx={{ display: 'flex' }}>
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          CRM Tekio Europa
        </Typography>
        {!isMobile && (
          <Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              startIcon={<BusinessIcon />}
              onClick={() => setOpenCrearEmpresa(true)}
            >
              Create Company
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenCrearContacto(true)}
            >
              Add Contact
            </Button>
            <Button 
              color="inherit" 
              startIcon={<EmojiEventsIcon />} 
              onClick={() => setOpenCrearOportunidad(true)}
            >
              Create Opportunity
            </Button>

            
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>

    {isMobile ? (
      <Drawer 
        variant="temporary" 
        open={drawerOpen} 
        onClose={toggleDrawer} 
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    ) : (
      <Drawer 
        variant="permanent" 
        sx={{ 
          width: 240, 
          [`& .MuiDrawer-paper`]: { 
            width: 240,
            boxSizing: 'border-box'
          } 
        }}
      >
        {drawerContent}
      </Drawer>
    )}

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 3 },
        mt: 8,
        ml: isMobile ? 0 : 0,
        minHeight: '100vh',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f4f6f8',
        width: { xs: '100%', sm: `calc(100% - ${isMobile ? 0 : 240}px)` }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h5">Companies Registered</Typography>
          <TextField
            variant="outlined"
            placeholder="Search by Company, Contact or Community"
            size="small"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {renderEmpresas()}
      </Container>
    </Box>

    <ModalCalendario
      open={openCalendario}
      onClose={() => setOpenCalendario(false)}
    />

    <CrearEmpresaModal
      open={openCrearEmpresa}
      onClose={() => setOpenCrearEmpresa(false)}
      onCreated={handleEmpresaCreated}
    />

    <CrearContactoModal
      open={openCrearContacto}
      onClose={() => setOpenCrearContacto(false)}
      onCreated={handleContactoCreated}
    />

    <CrearEventoModal
      open={openCrearEvento}
      onClose={() => setOpenCrearEvento(false)}
      empresa={empresaEventoSeleccionada}
      contacto={contactoEventoSeleccionado}
    />

    <CrearOportunidadModal
      open={openCrearOportunidad}
      onClose={() => setOpenCrearOportunidad(false)}
      onCreated={handleOportunidadCreated}
      empresas={empresas}
    />
  </Box>
  );
};

export default Panel;