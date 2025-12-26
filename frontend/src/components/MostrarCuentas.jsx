import { useCuentas } from '../hooks/useCuentas';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X, Trash2, House } from 'lucide-react';
import { useState, useEffect } from 'react';

const TEMAS_DISPONIBLES = [
    { nombre: 'Azul', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    { nombre: 'Verde', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    { nombre: 'Rojo', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
    { nombre: 'Ámbar', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    { nombre: 'Violeta', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800' },
    { nombre: 'Cian', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800' },
];

export function ListaCuentas() {
    const { cuentas, clasificaciones, cargando, error, editarCuenta, eliminarCuenta, agregarCuenta, agregarClasificacion, editarClasificacion, eliminarClasificacion } = useCuentas();

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div  className='flex flex-row pb-5'>
                <Link to="/menu" className="flex items-center gap-2 text-gray-600 mb-4">
                    <House className="w-10 h-10 text-gray-950" />
                </Link>
                <div className='w-full flex justify-center items-center'>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mx-6 my-6">Catalogo de Cuentas y Clasificaciones</h2>
                </div>
            </div>
            
            <div className="mx-4 flex flex-row space-x-10 overflow-x-auto pb-4">
                
                {/* COLUMNA 1: GESTIÓN DE CLASIFICACIONES */}
                <div className='bg-amber-100 p-4 rounded-xl border border-amber-200 mx-auto w-full h-fit min-w-75'>
                    <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">Editar Categorías</h2>
                    
                    {/* Usamos el formulario específico */}
                    <FormularioClasificacion onAgregar={agregarClasificacion} />
                    
                    <ul>
                        {clasificaciones.map((clasificacion) => (
                            // Usamos la fila específica
                            <FilaClasificacion
                                key={clasificacion.id}
                                clasificacion={clasificacion} // Pasamos el objeto con nombre claro
                                onEditar={editarClasificacion}
                                onEliminar={eliminarClasificacion}
                            />
                        ))}
                    </ul>
                </div>
                
                {/* COLUMNAS DINÁMICAS: CUENTAS POR CLASIFICACIÓN */}
                {clasificaciones.map((clasificacion, index) => {
                    const temaIndex = index % TEMAS_DISPONIBLES.length;
                    const estilo = TEMAS_DISPONIBLES[temaIndex];
                    
                    // Filtramos las cuentas de esta columna
                    const cuentasDeEstaColumna = cuentas.filter(c => c.clasificacion === clasificacion.nombre);

                    return (
                        <div 
                            key={clasificacion.id}
                            className={`${estilo.bg} ${estilo.border} p-4 rounded-xl border mx-5 w-full h-fit min-w-80 transition-colors duration-300`}
                        >
                            <h3 className={`text-2xl font-bold ${estilo.text} mb-3 text-center`}>
                                {clasificacion.nombre}
                            </h3>
                            
                            {/* Usamos el formulario específico de Cuentas */}
                            <FormularioCuenta
                                idClasificacion={clasificacion.id}
                                onAgregar={agregarCuenta}
                            />
                            
                            <ul className="space-y-2 flex flex-col gap-1 justify-center mt-4">
                                {cuentasDeEstaColumna.map((cuenta) => (
                                    // Usamos la fila específica de Cuentas
                                    <FilaCuenta 
                                        key={cuenta.id} 
                                        cuenta={cuenta} // Nombre claro
                                        clasificacion={clasificacion}
                                        clasificaciones={clasificaciones} // Necesario para el dropdown
                                        onEditar={editarCuenta}
                                        onEliminar={eliminarCuenta}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FilaClasificacion({ clasificacion, onEditar, onEliminar }) {
    const [editando, setEditando] = useState(false);
    const [nombreTemp, setNombreTemp] = useState(clasificacion.nombre);

    const handleGuardar = async () => {
        if (!nombreTemp.trim()) return alert("El nombre es obligatorio");
        await onEditar(clasificacion.id, nombreTemp);
        setEditando(false);
    };

    return (
        <li className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-3 mb-6 flex flex-row gap-1 justify-center items-center">
            {editando ? (
                <>
                    <input 
                        className="border p-1 rounded w-full"
                        value={nombreTemp}
                        onChange={(e) => setNombreTemp(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-1">
                        <button onClick={handleGuardar} className="text-green-600 p-1"><Save size={18} /></button>
                        <button onClick={() => setEditando(false)} className="text-red-500 p-1"><X size={18} /></button>
                    </div>
                </>
            ) : (
                <>
                    <span className="font-semibold text-gray-800 w-full">{clasificacion.nombre}</span>
                    <button onClick={() => setEditando(true)} className="text-gray-400 hover:text-blue-600 p-2"><Edit2 size={16} /></button>
                    <BotonEliminarSeguro onConfirmar={() => onEliminar(clasificacion.id)} />
                </>
            )}
        </li>
    );
}

function FilaCuenta({ cuenta, clasificacion, clasificaciones, onEditar, onEliminar }) {
    const [editando, setEditando] = useState(false);
    const [nombreTemp, setNombreTemp] = useState(cuenta.nombre);
    const [clasifIdTemp, setClasifIdTemp] = useState(clasificacion.id); 

    const handleGuardar = async () => {
        if (!nombreTemp.trim()) return alert("El nombre es obligatorio");
        
        await onEditar(cuenta.id, {
            nombre: nombreTemp,
            id_clasificacion: parseInt(clasifIdTemp)
        });
        setEditando(false);
    };

    return (
        <li className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-3 mb-6 flex flex-row gap-1 justify-center items-center">
            {editando ? (
                <>
                    <select 
                        className="border p-1 rounded text-sm w-1/3"
                        value={clasifIdTemp}
                        onChange={(e) => setClasifIdTemp(e.target.value)}
                    >
                        {clasificaciones.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                    <input 
                        className="border p-1 rounded w-full"
                        value={nombreTemp}
                        onChange={(e) => setNombreTemp(e.target.value)}
                    />
                    <div className="flex gap-1">
                        <button onClick={handleGuardar} className="text-green-600 p-1"><Save size={18} /></button>
                        <button onClick={() => setEditando(false)} className="text-red-500 p-1"><X size={18} /></button>
                        
                    </div>
                </>
            ) : (
                <>
                    <span className="font-semibold text-gray-800 w-full">{cuenta.nombre}</span>
                    <button onClick={() => setEditando(true)} className="text-gray-400 hover:text-blue-600 p-2"><Edit2 size={16} /></button>
                    <BotonEliminarSeguro onConfirmar={() => onEliminar(cuenta.id)} />
                </>
            )}
        </li>
    );
}

// Formulario SOLO para Clasificaciones
function FormularioClasificacion({ onAgregar }) {
    const [nombre, setNombre] = useState('');

    const handleSubmit = async () => {
        if (!nombre.trim()) return;
        const exito = await onAgregar({ nombre });
        if (exito) setNombre('');
    };

    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex gap-2'>
            <input
                className="w-full px-2 py-1 border rounded"
                placeholder="Nueva Clasificación"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                +
            </button>
        </div>
    );
}

// Formulario SOLO para Cuentas (Recibe el ID de la columna donde está)
function FormularioCuenta({ idClasificacion, onAgregar }) {
    const [nombre, setNombre] = useState('');

    const handleSubmit = async () => {
        if (!nombre.trim()) return;
        const exito = await onAgregar({ 
            nombre, 
            id_clasificacion: parseInt(idClasificacion) 
        });
        if (exito) setNombre('');
    };

    return (
        <div className='bg-white/50 rounded-lg p-2 mb-4 flex gap-2'>
            <input
                className="w-full px-2 py-1 border rounded"
                placeholder="Nueva Cuenta"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <button onClick={handleSubmit} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                +
            </button>
        </div>
    );
}

// Sustituye tu botón de eliminar actual por este bloque lógico
function BotonEliminarSeguro({ onConfirmar }) {
    const [confirmando, setConfirmando] = useState(false);

    // Si el usuario se arrepiente y no hace clic, reseteamos a los 3 segundos
    useEffect(() => {
        if (confirmando) {
            const timer = setTimeout(() => setConfirmando(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [confirmando]);

    if (confirmando) {
        return (
            <div className="flex gap-1 animate-in fade-in duration-200">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que se propague el clic
                        onConfirmar(); // Ejecuta la eliminación real
                    }} 
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-700"
                >
                    ¿Confirmar?
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setConfirmando(false);
                    }} 
                    className="text-gray-500 hover:text-gray-700 p-1"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={() => setConfirmando(true)} 
            className="text-gray-400 hover:text-red-600 p-2 transition-colors"
            title="Eliminar"
        >
            <Trash2 size={16} />
        </button>
    );
}

/*
// --- COMPONENTE PRINCIPAL ---
export function ListaCuentas() {
    const { cuentas, clasificaciones, cargando, error, editarCuenta, eliminarCuenta, agregarCuenta, agregarClasificacion, editarClasificacion, eliminarClasificacion } = useCuentas();
    if (cargando) return <p>Cargando...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    return (
        <div>
            <div >
                <Link to="/menu" className="flex items-center gap-2 text-gray-600 mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver al menú</span>
                </Link>
            </div>
            <div className='flex justify-center items-center'>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mx-6 mb-6">Catalogo de Cuentas</h2>
            </div>
            <div className="mx-4 flex flex-row space-y-10 overflow-x-auto pb-4">
                <div className='bg-amber-200 p-4 rounded-xl border min-w-max h-min mx-auto w-fit transition-colors duration-300'>
                    <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mx-6">Catalogo de Clasificaciones</h2>
                    <FormularioC
                        agregarClasificacion={agregarClasificacion}
                    />
                    <ul>
                        {clasificaciones.map((clasificacion)=>(
                            <FilaCuenta
                            key={clasificacion.id}
                            cueCla={clasificacion}
                            onChangeClasificacion={editarClasificacion}
                            onEliminarClasificacion={eliminarClasificacion}
                            />
                        ))}
                    </ul>
                </div>
                
                {clasificaciones.map((clasificacion, index) => {
                    const temaIndex = index % TEMAS_DISPONIBLES.length;
                    const estilo = TEMAS_DISPONIBLES[temaIndex];
                    return (
                        <div 
                            key={clasificacion.id}
                            className={`${estilo.bg} ${estilo.border} p-4 rounded-xl border min-w-max mx-auto w-fit transition-colors duration-300`}
                        >
                            <h3 className={`text-3xl font-bold ${estilo.text} mb-3 text-center`}>
                                {clasificacion.nombre}
                            </h3>
                            
                            <FormularioC
                                clasificacionId={clasificacion.id}
                                agregarCuenta={agregarCuenta} 
                            />
                            
                            <ul className="space-y-2 flex flex-col gap-1 justify-center mt-4">
                                {(cuentas.filter(c => c.clasificacion === clasificacion.nombre)).map((cuenta) => (
                                    <FilaCuenta 
                                        key={cuenta.id} 
                                        cueCla={cuenta} 
                                        clasificaciones={clasificaciones}
                                        clasificacionId={clasificacion.id}
                                        onEditarCuenta={editarCuenta}
                                        onEliminarCuenta={eliminarCuenta}
                                        colorTema={estilo.text} 
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FormularioC({agregarClasificacion = async () => true,agregarCuenta = async () => true,clasificacionId=""} ){
    const [nombre, setNombre] = useState('');

    const handleNew = async () => {
        // Validación simple
        if (!nombre) {
            alert("Por favor, Ingrese el nombre de la clasificacion.");
            return;
        }
        if (clasificacionId !== "") {
            const exito = await agregarCuenta({
            nombre: nombre, id_clasificacion: parseInt(clasificacionId)
            })
        }else{
            const exito = await agregarClasificacion({
            nombre: nombre
        })
        }
        
        if (exito) {
            setNombre('');;
        }
        else {
            alert("Error al agregar la clasificacion. Intente nuevamente.");
        }
    };
    return(
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-3  inline-flex flex-row gap-5 justify-center my-5'>
            <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Clasificacion Nueva"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <button 
                onClick={handleNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Agregar
            </button>
        </div>
    );
}

function FilaCuenta({ cueCla, clasificaciones,clasificacionId="", onEditarCuenta, onEliminarCuenta,onChangeClasificacion, onEliminarClasificacion}) {
    const [editando, setEditando] = useState(false);
    const [clasifIdTemp, setClasifIdTemp] = useState(clasificacionId);
    const [nombreTemp, setNombreTemp] = useState(cueCla.nombre);

    const handleGuardar = async () => {
        if (nombreTemp.trim()==="") {
            alert("Agregue un nombre por favor");
            return;
        }

        if(clasifIdTemp===""){
            console.log("clasificacion")
            await onChangeClasificacion(cueCla.id, nombreTemp);
            setEditando(false);
        }
        else{
            const datos = {
            nombre: nombreTemp,
            id_clasificacion: parseInt(clasifIdTemp)
            };
            await onEditarCuenta(cueCla.id, datos);
            setEditando(false);
        }
    };

    const handleCancelar = () => {
        setNombreTemp(cueCla.nombre);
        setClasifIdTemp(clasificacionId)
        setEditando(false);
    };

    const handleEliminar= async(id) =>{
    if(clasifIdTemp===""){
        console.log("cla")
        onEliminarClasificacion(id)
    }
    else{
        console.log("cuenta")
        onEliminarCuenta(id)
    }
    };

    return (
        <li className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-3 mb-6 flex flex-row gap-1 justify-center items-center">
            {editando ? (
                <>
                    {clasificacionId!==""&&(<select 
                        className="border p-1 rounded text-sm w-1/3"
                        value={clasifIdTemp}
                        onChange={(e) => setClasifIdTemp(e.target.value)}
                    >
                        <option value="" disabled>Seleccionar...</option>
                        
                        {clasificaciones.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>)
                    }

                    <input 
                        className="border p-1 rounded w-full"
                        value={nombreTemp}
                        onChange={(e) => setNombreTemp(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button onClick={handleGuardar} 
                        className="text-green-600 hover:bg-green-50 p-1 rounded"
                        title='Guardar cambios'>
                            <Save size={18} />
                        </button>
                        <button onClick={handleCancelar} 
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                        title='Cancelar'>
                            <X size={18} />
                        </button>
                        <button 
                            onClick={() => handleEliminar(cueCla.id)} 
                            className="text-gray-400 hover:text-red-600 p-2"
                            title="Eliminar"
                        >
                        
                            <Trash2 size={16} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:gap-4 md:items-center w-full">
                        
                        <span className="font-semibold text-gray-800">
                            {cueCla.nombre}
                        </span>
                    </div>

                    <button 
                        onClick={() => setEditando(true)} 
                        className="text-gray-400 hover:text-blue-600 p-2"
                        title="Editar"
                    >
                        <Edit2 size={16} />
                    </button>
                </>
            )}
        </li>
    );
}
*/