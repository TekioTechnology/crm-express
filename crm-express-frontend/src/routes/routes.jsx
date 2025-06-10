import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Panel from '../pages/panel';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/panel" element={<Panel />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
