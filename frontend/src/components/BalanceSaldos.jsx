import { ArrowLeft, Save, Download } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCuentas } from '../context/CuentasContext';
export function BalanceSaldos() {
    const { reportData } = useCuentas();
    return(
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-10/12 mx-auto">
                <div className="mb-6">
                    <Link
                        to='/menu'
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Cambiar tipo de reporte</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Balance de Saldos</h1>
                            <p className="text-sm text-gray-600">{reportData.name} - {reportData.date}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                //onClick={saveReport}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                            <button
                                //onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}