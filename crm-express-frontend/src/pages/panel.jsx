import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, Button, useTheme, useMediaQuery, Stack,
  Accordion, AccordionSummary, AccordionDetails, Grid, CircularProgress,
  Container, Alert,Tooltip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';


import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CrearEmpresaModal from '../components/crearEmpresaModal';
import CrearContactoModal from '../components/CrearContactoModal';
import CrearEventoModal from '../components/CrearEventoModal';
import VerEventos from '../components/VerEventos';


const Panel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCrearEmpresa, setOpenCrearEmpresa] = useState(false);
  const [user, setUser] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [loadingContactos, setLoadingContactos] = useState(true);
  const [error, setError] = useState(null);

  const [openCrearContacto, setOpenCrearContacto] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

const [openCrearEvento, setOpenCrearEvento] = useState(false);
const [empresaEventoSeleccionada, setEmpresaEventoSeleccionada] = useState(null);
const [contactoEventoSeleccionado, setContactoEventoSeleccionado] = useState(null);


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

  // Función para obtener los contactos de una empresa específica
  const getContactosPorEmpresa = (empresaId) => {
    return contactos.filter(contacto => contacto.id_empresa_crm === empresaId);
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
          <ListItemButton onClick={() => { setViewMode('calendar'); isMobile && setDrawerOpen(false); }}>
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
       
      </List>
    </Box>
  );

  const renderEmpresas = () => {
    if (loadingEmpresas || loadingContactos) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
}

if (error) {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
}

if (empresas.length === 0) {
  return (
    <Box textAlign="center" py={4}>
      <Typography 
        variant="h6" 
        color="text.secondary" 
        gutterBottom
        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
      >
        No hay empresas registradas
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
      >
        Crea tu primera empresa para comenzar
      </Typography>
    </Box>
  );
}

return (
  <Stack spacing={2}>
    {empresas.map((empresa) => {
      const contactosEmpresa = getContactosPorEmpresa(empresa.id);
      
      return (
        <Accordion
          key={empresa.id}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: '#f9f9f9',
            width: '100%',
            '&:before': { display: 'none' },
            '& .MuiAccordionSummary-root': {
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 }
            },
            '& .MuiAccordionDetails-root': {
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 }
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              }
            }}
          >
            <Typography 
              fontWeight="bold" 
              color="primary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                wordBreak: 'break-word'
              }}
            >
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
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                📍 <strong>Address</strong><br />
                {empresa.direccion || 'No especificada'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                📞 <strong>Phone</strong><br />
                {empresa.telefono || 'Sin número'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                🔢 <strong>Zip Code</strong><br />
                {empresa.codigo_postal || '-'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                🌍 <strong>Community or City</strong><br />
                {empresa.comunidad || '-'}
              </Typography>
            </Box>

            <Box mt={2}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600 
                }}
              >
                Associated contacts
              </Typography>
              
              {contactosEmpresa.length > 0 ? (
                <Box 
                  component="ul" 
                  sx={{ 
                    paddingLeft: '1.2rem', 
                    margin: 0,
                    '& li': {
                      marginBottom: '0.8rem',
                      fontSize: { xs: '0.875rem', sm: '0.9rem' }
                    }
                  }}
                >
                  {contactosEmpresa.map((contacto) => (
                    <Box
                      key={contacto.id}
                      component="li"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: '0.8rem',
                        fontSize: { xs: '0.875rem', sm: '0.9rem' }
                      }}
                    >
                      <Box>
                        <Box sx={{ mb: 0.5 }}>
                          <strong>{contacto.nombre}</strong> 
                          {contacto.cargo && ` – ${contacto.cargo}`}
                        </Box>
                        <Box>
                          {contacto.correo_electronico && (
                            <Box
                              component="span"
                              sx={{ fontSize: '0.8rem', color: 'text.secondary' }}
                            >
                              📧 {contacto.correo_electronico}
                            </Box>
                          )}
                          {(contacto.telefono || contacto.telefono_fijo) && (
                            <Box
                              component="span"
                              sx={{ fontSize: '0.8rem', color: 'text.secondary', ml: 2 }}
                            >
                              📱 {contacto.telefono || contacto.telefono_fijo}
                              {contacto.extension && ` ext. ${contacto.extension}`}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Tooltip title="Crear evento">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEmpresaEventoSeleccionada(empresa);
                            setContactoEventoSeleccionado(contacto); // 👈 importante
                            setOpenCrearEvento(true);
                          }}
                          sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#115293',
                            },
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            fontSize: '1rem',
                            ml: 2,
                          }}
                        >
                          +
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontStyle: 'italic',
                    fontSize: { xs: '0.875rem', sm: '0.9rem' }
                  }}
                >
                  There are no contacts registered for this company
                </Typography>
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CRM Tekio Europa
          </Typography>
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              <Button
                color="inherit"
                startIcon={<BusinessIcon />}
                onClick={() => setOpenCrearEmpresa(true)}
              >
                Created Company
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
                startIcon={<EmojiEventsIcon/>}
                onClick={() => setOpenCrearContacto(true)}
              >
                Create Oportunity
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
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Companys Registered
          </Typography>
          
          {renderEmpresas()}
        </Container>
      </Box>

      

      <CrearEmpresaModal
        open={openCrearEmpresa}
        onClose={() => setOpenCrearEmpresa(false)}
        onCreated={handleEmpresaCreated}
      />

      <CrearContactoModal
        open={openCrearContacto}
        onClose={() => setOpenCrearContacto(false)}
        onCreate
        d={handleContactoCreated}
      />

      <CrearEventoModal
  open={openCrearEvento}
  onClose={() => setOpenCrearEvento(false)}
  empresa={empresaEventoSeleccionada}
  contacto={contactoEventoSeleccionado}
/>
    </Box>
  );
};

export default Panel;