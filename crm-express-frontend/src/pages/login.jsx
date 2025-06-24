import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Stack,
  InputAdornment, IconButton, Alert, CircularProgress, Box
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(
        'https://api-crm-express-c6fuadbucpbkexcp.canadacentral-01.azurewebsites.net/login',
        formData
      );

      if (data.status === 'ok') {
        localStorage.setItem('user_crm', JSON.stringify({
          id_usuario_crm: data.id_usuario_crm,
          created_by: data.created_by
        }));
        navigate('/panel');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('Error de servidor al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
    sx={{ 
    position: 'relative', 
    height: '70vh',
    
    overflow: 'hidden' ,

    
    
    }}>
      {/* 🎬 Fondo de vídeo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      >
        <source src="/videos/login.mp4" type="video/mp4" />
        Tu navegador no soporta vídeos en HTML5.
      </video>

      {/* 📦 Contenedor del formulario */}
      <Container
        maxWidth="xs"
        sx={{
          height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      overflow: 'hidden'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(154, 149, 149, 0.85)',
            borderRadius: 3
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login - CRM
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
  type="submit"
  fullWidth
  disabled={loading}
  sx={{
    backgroundColor: '#5E6464', // azul MUI
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 2,
    paddingY: 1.2,
    fontSize: '1rem',
    boxShadow: '0 4px 10px rgba(18, 17, 17, 0.15)',
    transition: '0.3s ease',
    '&:hover': {
      backgroundColor: '#C7C8CA',
      transform: 'scale(1.02)',
    },
    '&:disabled': {
      backgroundColor: '#C7C8CA',
      color: '#fff'
    }
  }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
</Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
