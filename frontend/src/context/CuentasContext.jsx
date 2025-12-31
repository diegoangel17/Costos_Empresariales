import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cuentasService, clasificacionesService } from '../services/serviceCuentas';

// 1. Creamos el "espacio" para los datos
const CuentasContext = createContext();

// 2. El Proveedor (El componente que envuelve tu app y tiene la lógica)
export function CuentasProvider({ children }) {
  const [cuentas, setCuentas] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [reportData, setReportData] = useState({
    name: '',
    type: '',
    date: new Date().toISOString().split('T')[0]
  });

  // --- FUNCIONES DE CARGA (Memorizadas con useCallback) ---
  
  const cargarCuentas = useCallback(async () => {
    try {
      // Nota: Si ya estamos cargando (o cargamos recientemente), podríamos evitar esta llamada
      // pero por seguridad la dejamos igual que tu hook original.
      const data = await cuentasService.getAll();
      setCuentas(data);
    } catch (err) {
      setError(err.message);
    }
  }, []); // [] significa que esta función no cambia nunca

  const cargarClasificaciones = useCallback(async () => {
    try {
      const data = await clasificacionesService.getAll();
      setClasificaciones(data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
    }
  }, []);

  // --- EFECTO INICIAL ---
  useEffect(() => {
    const cargarTodo = async () => {
        setCargando(true);
        await Promise.all([cargarCuentas(), cargarClasificaciones()]);
        setCargando(false);
    };
    cargarTodo();
  }, [cargarCuentas, cargarClasificaciones]);


  // --- CRUD CLASIFICACIONES ---

  const agregarClasificacion = useCallback(async (nuevaClasificacion) => {
    try {
      const nueva = await clasificacionesService.create(nuevaClasificacion);
      setClasificaciones(prev => [...prev, nueva]);
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  }, []);

  const editarClasificacion = useCallback(async (id, nombre) => {
    try {
      await clasificacionesService.update(id, { nombre });
      
      setClasificaciones(prev => 
        prev.map(c => c.id === id ? { ...c, nombre } : c)
      );
      // Opcional: cargarClasificaciones(); // Ya actualizamos localmente, no es estrictamente necesario recargar todo
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const eliminarClasificacion = useCallback(async (id) => {
    try {
      await clasificacionesService.delete(id);
      setClasificaciones(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  }, []);

  // --- CRUD CUENTAS ---

  const agregarCuenta = useCallback(async (datos) => {
    try {
      const nueva = await cuentasService.create(datos);
      setCuentas(prev => [...prev, nueva]);
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  }, []);

  const editarCuenta = useCallback(async (id, nuevosDatos) => {
    try {
      await cuentasService.update(id, nuevosDatos);
      
      setCuentas(prev => 
        prev.map(c => c.id === id ? { ...c, ...nuevosDatos } : c)
      );
      // Opcional: cargarCuentas(); 
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const eliminarCuenta = useCallback(async (id) => {
    try {
      await cuentasService.delete(id);
      setCuentas(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  }, []);


  // --- EMPAQUETADO DE DATOS (useMemo para rendimiento) ---
  const value = useMemo(() => ({
    cuentas,
    clasificaciones,
    cargando,
    error,
    reportData,
    setReportData,
    recargar: cargarCuentas, // Mantenemos tu nombre "recargar"
    agregarCuenta,
    editarCuenta,
    eliminarCuenta,
    agregarClasificacion,
    editarClasificacion,
    eliminarClasificacion
  }), [
    cuentas, 
    clasificaciones, 
    cargando, 
    error,
    reportData,
    setReportData, 
    cargarCuentas, 
    agregarCuenta, 
    editarCuenta, 
    eliminarCuenta, 
    agregarClasificacion, 
    editarClasificacion, 
    eliminarClasificacion
  ]);

  return (
    <CuentasContext.Provider value={value}>
      {children}
    </CuentasContext.Provider>
  );
}

// 3. El Hook Personalizado (Consumidor)
// Esto reemplaza a tu antiguo archivo hooks/useCuentas.js
export function useCuentas() {
  const context = useContext(CuentasContext);
  if (!context) {
    throw new Error('useCuentas debe ser usado dentro de un CuentasProvider');
  }
  return context;
}