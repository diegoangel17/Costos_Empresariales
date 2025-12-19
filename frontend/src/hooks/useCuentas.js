import { useState, useEffect } from 'react';
import { cuentasService, clasificacionesService } from '../services/serviceCuentas';

export function useCuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCuentas();
    cargarClasificaciones();
  }, []);

  const cargarClasificaciones = async () => {
    try {
      const data = await clasificacionesService.getAll();
      setClasificaciones(data);
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
    }
  };

  const agregarClasificacion = async (nuevaClasificacion) => {
    try {
      const nueva = await clasificacionesService.create(nuevaClasificacion);
      
      // Actualizamos la lista local agregando la nueva al final
      setClasificaciones(prev => [...prev, nueva]);
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const cargarCuentas = async () => {
    try {
      setCargando(true);
      const data = await cuentasService.getAll();
      setCuentas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const editarCuenta = async (id, nuevosDatos) => {
    try {
      // 1. Llamamos al backend
      await cuentasService.update(id, nuevosDatos);
      
      // 2. Actualizamos la lista localmente (Optimistic Update)
      // Esto evita tener que recargar toda la lista desde el servidor
      setCuentas(prevCuentas => 
        prevCuentas.map(cuenta => 
          cuenta.id === id 
            ? { ...cuenta, ...nuevosDatos } // Fusionamos los datos nuevos
            : cuenta
        )
      );
      cargarCuentas(); 
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const eliminarCuenta = async (id) => {
    // Confirmación nativa simple antes de llamar a la API
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) return;

    try {
      await cuentasService.delete(id);
      
      // Actualizamos la lista localmente quitando el elemento borrado
      setCuentas(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      alert(err.message); // Mostramos el mensaje del backend ("No se puede eliminar...")
      return false;
    }
  };

  const agregarCuenta = async (datos) => {
    try {
      const nueva = await cuentasService.create(datos);
      
      // Actualizamos la lista local agregando la nueva al final
      setCuentas(prev => [...prev, nueva]);
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  return { cuentas, clasificaciones, cargando, error, recargar: cargarCuentas, editarCuenta, eliminarCuenta, agregarCuenta, agregarClasificacion };
}