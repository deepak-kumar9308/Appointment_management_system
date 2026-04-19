import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './App.css';
import axios from 'axios';

// In production, this will use your deployed backend. Locally, it stays empty so the Vite proxy handles it.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
