import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import { ListaCuentas } from './components/MostrarCuentas';

function App() {
  return (
    <div className="app-container">
      {/* Definimos las "páginas" de tu sistema */}
      <Routes>
        {/* Ruta por defecto (Redirige al menú) */}
        <Route path="/" element={<Navigate to="/menu" />} />
        
        {/* Tus pantallas */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/cuentas" element={<ListaCuentas />} />
        
        {/* Ruta para error 404 */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;