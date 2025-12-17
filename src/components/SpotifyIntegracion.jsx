// src/components/SpotifyIntegracion.jsx
import React, { useState, useEffect } from "react";
import { Music, ExternalLink, X, Users } from "lucide-react";
import { 
  estaConectadoSpotify, 
  generarUrlAutorizacion, 
  obtenerArtistasFavoritos,
  obtenerCancionesFavoritas,
  desconectarSpotify,
  obtenerDatosSimulados,
  calcularCompatibilidadMusical
} from "../services/spotifyService";
import toast from "react-hot-toast";

export default function SpotifyIntegracion({ 
  onDatosActualizados, 
  mostrarCompatibilidad = false, 
  artistasOtroUsuario = null 
}) {
  const [conectado, setConectado] = useState(false);
  const [artistas, setArtistas] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [compatibilidad, setCompatibilidad] = useState(0);

  useEffect(() => {
    setConectado(estaConectadoSpotify());
    if (estaConectadoSpotify()) {
      cargarDatosSpotify();
    }
  }, []);

  useEffect(() => {
    if (mostrarCompatibilidad && artistas.length > 0 && artistasOtroUsuario) {
      const comp = calcularCompatibilidadMusical(artistas, artistasOtroUsuario);
      setCompatibilidad(comp);
    }
  }, [artistas, artistasOtroUsuario, mostrarCompatibilidad]);

  const cargarDatosSpotify = async () => {
    setCargando(true);
    
    try {
      // Si no hay credenciales de Spotify, usar datos simulados
      if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
        const datosSimulados = obtenerDatosSimulados();
        setArtistas(datosSimulados.artistas.data);
        setCanciones(datosSimulados.canciones.data);
        onDatosActualizados?.({
          artistas: datosSimulados.artistas.data,
          canciones: datosSimulados.canciones.data
        });
        setCargando(false);
        return;
      }

      const [resultadoArtistas, resultadoCanciones] = await Promise.all([
        obtenerArtistasFavoritos(5),
        obtenerCancionesFavoritas(5)
      ]);

      if (resultadoArtistas.ok) {
        setArtistas(resultadoArtistas.data);
      }

      if (resultadoCanciones.ok) {
        setCanciones(resultadoCanciones.data);
      }

      onDatosActualizados?.({
        artistas: resultadoArtistas.data || [],
        canciones: resultadoCanciones.data || []
      });

    } catch (error) {
      console.error("Error cargando datos de Spotify:", error);
      toast.error("Error al cargar datos de Spotify");
    } finally {
      setCargando(false);
    }
  };

  const conectarSpotify = () => {
    if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
      // Simular conexión para desarrollo
      setConectado(true);
      cargarDatosSpotify();
      toast.success("Conectado a Spotify (modo demo)");
      return;
    }

    const url = generarUrlAutorizacion();
    window.location.href = url;
  };

  const desconectar = () => {
    desconectarSpotify();
    setConectado(false);
    setArtistas([]);
    setCanciones([]);
    setCompatibilidad(0);
    onDatosActualizados?.({ artistas: [], canciones: [] });
    toast.success("Desconectado de Spotify");
  };

  if (!conectado) {
    return (
      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Music size={32} />
          <div>
            <h3 className="text-xl font-bold">Conecta tu Spotify</h3>
            <p className="text-green-100">Muestra tu música favorita en tu perfil</p>
          </div>
        </div>
        
        <button
          onClick={conectarSpotify}
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
        >
          <Music size={20} />
          Conectar con Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Music className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Spotify Conectado</h3>
            <p className="text-sm text-gray-600">Tu música favorita</p>
          </div>
        </div>
        
        <button
          onClick={desconectar}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Compatibilidad Musical */}
      {mostrarCompatibilidad && compatibilidad > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-600" size={20} />
            <span className="font-semibold text-purple-800">Compatibilidad Musical</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${compatibilidad}%` }}
              />
            </div>
            <span className="font-bold text-purple-800">{compatibilidad}%</span>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando tu música...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Artistas Favoritos */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users size={16} />
              Artistas Favoritos
            </h4>
            <div className="space-y-2">
              {artistas.slice(0, 5).map((artista, index) => (
                <div key={artista.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-500 w-4">
                    {index + 1}
                  </span>
                  {artista.images?.[0] && (
                    <img 
                      src={artista.images[0].url} 
                      alt={artista.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-gray-800">{artista.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Canciones Favoritas */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Music size={16} />
              Canciones Favoritas
            </h4>
            <div className="space-y-2">
              {canciones.slice(0, 5).map((cancion, index) => (
                <div key={cancion.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-500 w-4">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{cancion.name}</p>
                    <p className="text-xs text-gray-600">
                      {cancion.artists?.map(a => a.name).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Link a Spotify */}
      <div className="text-center">
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
        >
          <ExternalLink size={16} />
          Abrir Spotify
        </a>
      </div>
    </div>
  );
}