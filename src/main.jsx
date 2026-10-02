import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './styles/globals.css';
import App from './App';
import { PrefsProvider } from './context/Prefs';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrefsProvider>
        <App />
      </PrefsProvider>
    </BrowserRouter>
    <Analytics />
  </StrictMode>
);
