import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { makeServer } from "./server";
import { ToastProvider, useToastAndLoader } from './context/ToastAndLoaderContext/ToastAndLoaderContext';
import { AuthProvider, useAuth } from './context/AuthContext/AuthContext';

export { useToastAndLoader, useAuth };

// Call make Server
makeServer();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
    <App />
      </AuthProvider>
    </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
