import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CuentasProvider } from './context/CuentasContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CuentasProvider>
        <App />
      </CuentasProvider>
    </BrowserRouter>
  </StrictMode>,
)
