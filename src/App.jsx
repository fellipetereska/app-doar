import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/auth';
import AppRoutes from './AppRoutes';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer autoClose={3000} position="top-right" />

    </AuthProvider>
  );
}

export default App;