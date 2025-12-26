const API_URL = import.meta.env.VITE_API_URL;
export const cuentasService = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/cuentas`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las cuentas');
    }
    
    return await response.json();
  },

  async update(id, datosActualizados) {
    const response = await fetch(`${API_URL}/api/cuentas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados),
    });

    if (!response.ok) throw new Error('Error al actualizar la cuenta');
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/cuentas/${id}`, {
      method: 'DELETE',
    });

    // Si el backend devuelve error (ej. 409 Conflict), lanzamos el mensaje
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la cuenta');
    }
    
    return true;
  },

  async create(nuevaCuenta) {
    const response = await fetch(`${API_URL}/api/cuentas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCuenta),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la cuenta');
    }
    
    return await response.json();
  }
};

export const clasificacionesService = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/clasificaciones`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las clasificaciones');
    }
    
    return await response.json();
  },
  async create(nuevaClasificacion) {
    const response = await fetch(`${API_URL}/api/clasificaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaClasificacion),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la clasificacion');
    }
    
    return await response.json();
  },
  
  async update(id, clasificacionActualizada) {
    const response = await fetch(`${API_URL}/api/clasificaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clasificacionActualizada),
    });

    if (!response.ok) throw new Error('Error al actualizar la clasificación');
    return await response.json();
  },
};
