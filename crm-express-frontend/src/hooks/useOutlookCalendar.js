// src/hooks/useOutlookCalendar.js
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/msalConfig';

const useOutlookCalendar = () => {
  const { instance } = useMsal();

 const getAccessToken = async () => {
  const accounts = instance.getAllAccounts();

  try {
    if (accounts.length === 0) {
      // Forzamos a que se seleccione cuenta
      const response = await instance.loginPopup({
        ...loginRequest,
        prompt: 'select_account',
      });
      return response.accessToken;
    }

    // Forzamos siempre selección de cuenta para que el usuario tenga control
    const response = await instance.loginPopup({
      ...loginRequest,
      prompt: 'select_account',
    });
    return response.accessToken;

  } catch (error) {
    console.error('❌ Error durante loginPopup:', error);
    throw new Error('No se pudo obtener el token de acceso de Outlook.');
  }
};

  const agregarEventoOutlook = async (evento) => {
    const token = await getAccessToken(); // ✅ siempre usa esto

    const startDateTime = new Date(
      `${evento.fecha_evento.split('T')[0]}T${new Date(evento.hora_evento)
        .toTimeString()
        .split(' ')[0]}`
    );
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      subject: evento.nombre_evento,
      body: {
        contentType: 'HTML',
        content: evento.descripcion_corta || '',
      },
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Madrid',
      },
    };

    const res = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('❌ Error creando evento:', evento, err);
      throw new Error('Error al crear el evento en Outlook');
    }

    console.log('✅ Evento añadido correctamente a Outlook');
  };

  return { agregarEventoOutlook };
};

export default useOutlookCalendar;
