export const msalConfig = {
  auth: {
    clientId: '2d236cce-82a6-4a40-91b0-9f9265ce43ca',
    authority: 'https://login.microsoftonline.com/4c226bae-3aff-4e84-85e9-5fa9e10d3e6f', // ID del inquilino (tenant)
    redirectUri: 'http://localhost:5173/',
  },
};

export const loginRequest = {
  scopes: ['Calendars.ReadWrite'],
};
