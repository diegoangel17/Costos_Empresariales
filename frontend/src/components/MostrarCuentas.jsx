import { useCuentas } from '../hooks/useCuentas';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

const TEMAS_DISPONIBLES = [
    { nombre: 'Azul', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    { nombre: 'Verde', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    { nombre: 'Rojo', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
    { nombre: 'Ámbar', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    { nombre: 'Violeta', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800' },
    { nombre: 'Cian', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800' },
];

// --- COMPONENTE PRINCIPAL ---
export function ListaCuentas() {
    const { cuentas, clasificaciones, cargando, error, editarCuenta, eliminarCuenta, agregarCuenta, agregarClasificacion, editarClasificacion } = useCuentas();
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mx-6 mb-6">Catalogo de Clasificaciones</h2>
                    <FormularioC
                        agregarClasificacion={agregarClasificacion}
                    />
                    <ul>
                        {clasificaciones.map((clasificacion)=>(
                            <FilaCuenta
                            key={clasificacion.id}
                            cueCla={clasificacion}
                            onChangeClasificacion={editarClasificacion}
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

/*
function FilaCuenta({ cuenta, clasificaciones,clasificacionId, onGuardar, onEliminar }) {
    const [editando, setEditando] = useState(false);
    const [clasifIdTemp, setClasifIdTemp] = useState(clasificacionId);
    const [nombreTemp, setNombreTemp] = useState(cuenta.nombre);

    const handleGuardar = async () => {
        if (nombreTemp.trim()==="") {
            alert("Elija una clasificación por favor");
            return;
        }

        const datos = {
            nombre: nombreTemp,
            id_clasificacion: parseInt(clasifIdTemp)
        };
        
        await onGuardar(cuenta.id, datos);
        setEditando(false);
    };

    const handleCancelar = () => {
        setNombreTemp(cuenta.nombre);
        setClasifIdTemp(clasificacionId)
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
                        <option value="" disabled>Seleccionar...</option>
                        
                        {clasificaciones.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

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
                            onClick={() => onEliminar(cuenta.id)} 
                            className="text-gray-400 hover:text-red-600 p-2"
                            title="Eliminar cuenta"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:gap-4 md:items-center w-full">
                        
                        <span className="font-semibold text-gray-800">
                            {cuenta.nombre}
                        </span>
                    </div>

                    <button 
                        onClick={() => setEditando(true)} 
                        className="text-gray-400 hover:text-blue-600 p-2"
                        title="Editar cuenta"
                    >
                        <Edit2 size={16} />
                    </button>
                </>
            )}
        </li>
    );
}
*/
function FilaCuenta({ cueCla, clasificaciones,clasificacionId="", onEditarCuenta, onEliminarCuenta,onChangeClasificacion}) {
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