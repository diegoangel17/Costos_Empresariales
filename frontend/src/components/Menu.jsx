import { useState } from 'react';
import { Bolt, FileText} from 'lucide-react';
import { SUBPROGRAMAS } from '../hooks/menu';
import { Link } from 'react-router-dom';

export default function Menu() {
  
return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className='flex justify-between'>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Crear Nuevo Reporte
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Selecciona el tipo de reporte que deseas crear
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-3 mb-6 flex flex-row gap-1 justify-center'>
            <Link to="/cuentas"
            className="">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-30 md:h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Bolt className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white m-1" />
              <p className='text-white font-semibold'>Cuentas</p>
              </div>
            </Link>
            <Link to="/cuentas"
            className="">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-30 md:h-16 bg-linear-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white m-1" />
              <p className='text-white font-semibold'>Historial</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Reporte
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Reporte
              </label>
              <input
                type="text"
                //value={reportData.name}
                //onChange={(e) => setReportData({...reportData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Reporte Mensual Enero 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                //value={reportData.date}
                //onChange={(e) => setReportData({...reportData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBPROGRAMAS.map((programa) => {
            const Icon = programa.icon;
            return (
              <Link to={`/${programa.name}`} key={programa.id} className="group bg-white rounded-lg p-5 shadow-sm border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all text-left">
                  <div className={`${programa.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-green-600">
                  {programa.name}
                </h3>
                <p className="text-xs text-gray-500">Programa {programa.id}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}