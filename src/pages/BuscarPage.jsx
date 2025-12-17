import React, { useState } from 'react';
import { Search, Filter, MapPin, Heart, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/comunes/BottomNavigation';

export default function BuscarPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    edadMin: 18,
    edadMax: 35,
    distancia: 50,
    intereses: []
  });

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para buscar
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas una cuenta para buscar y filtrar perfiles
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, intereses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>

          {/* Age Range */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-gray-500" size={18} />
              <label className="font-medium text-gray-700">Edad</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="18"
                max="60"
                value={filters.edadMin}
                onChange={(e) => setFilters({...filters, edadMin: parseInt(e.target.value)})}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-0">
                {filters.edadMin} - {filters.edadMax} años
              </span>
            </div>
          </div>

          {/* Distance */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-gray-500" size={18} />
              <label className="font-medium text-gray-700">Distancia</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="100"
                value={filters.distancia}
                onChange={(e) => setFilters({...filters, distancia: parseInt(e.target.value)})}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-0">
                {filters.distancia} km
              </span>
            </div>
          </div>

          {/* Apply Filters Button */}
          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-2xl font-semibold">
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Filtros rápidos</h3>
        <div className="flex flex-wrap gap-2">
          {['Cerca de mí', 'Nuevos usuarios', 'En línea ahora', 'Verificados'].map((filter) => (
            <button
              key={filter}
              className="bg-white px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="px-4">
        <div className="text-center py-12">
          <Search className="text-gray-300 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Busca tu match perfecto
          </h3>
          <p className="text-gray-600">
            Usa los filtros para encontrar personas compatibles contigo
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}