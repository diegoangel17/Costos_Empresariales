import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import { ListaCuentas } from './components/MostrarCuentas';
import { BalanceSaldos } from './components/BalanceSaldos';

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
        <Route path="/balancesaldos" element={<BalanceSaldos />} />
        <Route path="/inventario" element={<h1>Inventario</h1>} />
        <Route path="/registroscontables" element={<h1>Registros Contables</h1>} />
        <Route path="/mayoresauxiliares" element={<h1>Mayores Auxiliares</h1>} />
        <Route path="/costosdeventa" element={<h1>Costos de Venta</h1>} />
        <Route path="/hojadetrabajo" element={<h1>Hoja de Trabajo</h1>} />
        <Route path="/estadoderesultados" element={<h1>Estado de Resultados</h1>} />
        <Route path="/balancegeneral" element={<h1>Balance General</h1>} />

        {/* Ruta para error 404 */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;