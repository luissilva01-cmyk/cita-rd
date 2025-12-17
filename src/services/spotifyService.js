// src/services/spotifyService.js

/**
 * Configuración de Spotify Web API
 * Para usar en producción, necesitas registrar tu app en Spotify Developer Dashboard
 */

const SPOTIFY_CONFIG = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/spotify-callback`,
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private'
  ]
};

/**
 * Generar URL de autorización de Spotify
 */
export function generarUrlAutorizacion() {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes.join(' '),
    state: generateRandomString(16)
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Intercambiar código por token de acceso
 */
export async function intercambiarCodigo(code) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        client_id: SPOTIFY_CONFIG.clientId,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
      return { ok: true, token: data.access_token };
    }

    return { ok: false, msg: 'Error al obtener token' };
  } catch (error) {
    console.error('Error intercambiando código:', error);
    return { ok: false, msg: 'Error de conexión' };
  }
}

/**
 * Obtener perfil del usuario de Spotify
 */
export async function obtenerPerfilSpotify() {
  const token = localStorage.getItem('spotify_access_token');
  
  if (!token) {
    return { ok: false, msg: 'No hay token de acceso' };
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, data };
    }

    return { ok: false, msg: 'Error al obtener perfil' };
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return { ok: false, msg: 'Error de conexión' };
  }
}

/**
 * Obtener artistas favoritos del usuario
 */
export async function obtenerArtistasFavoritos(limite = 10) {
  const token = localStorage.getItem('spotify_access_token');
  
  if (!token) {
    return { ok: false, msg: 'No hay token de acceso' };
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limite}&time_range=medium_term`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, data: data.items };
    }

    return { ok: false, msg: 'Error al obtener artistas' };
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    return { ok: false, msg: 'Error de conexión' };
  }
}

/**
 * Obtener canciones favoritas del usuario
 */
export async function obtenerCancionesFavoritas(limite = 10) {
  const token = localStorage.getItem('spotify_access_token');
  
  if (!token) {
    return { ok: false, msg: 'No hay token de acceso' };
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limite}&time_range=medium_term`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, data: data.items };
    }

    return { ok: false, msg: 'Error al obtener canciones' };
  } catch (error) {
    console.error('Error obteniendo canciones:', error);
    return { ok: false, msg: 'Error de conexión' };
  }
}

/**
 * Calcular compatibilidad musical entre dos usuarios
 */
export function calcularCompatibilidadMusical(artistasUsuario1, artistasUsuario2) {
  if (!artistasUsuario1 || !artistasUsuario2) return 0;

  const artistas1 = artistasUsuario1.map(a => a.id);
  const artistas2 = artistasUsuario2.map(a => a.id);
  
  const artistasComunes = artistas1.filter(id => artistas2.includes(id));
  const totalArtistas = new Set([...artistas1, ...artistas2]).size;
  
  if (totalArtistas === 0) return 0;
  
  return Math.round((artistasComunes.length / Math.min(artistas1.length, artistas2.length)) * 100);
}

/**
 * Verificar si el usuario está conectado a Spotify
 */
export function estaConectadoSpotify() {
  return !!localStorage.getItem('spotify_access_token');
}

/**
 * Desconectar de Spotify
 */
export function desconectarSpotify() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
}

/**
 * Generar string aleatorio para state
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

// Datos simulados para desarrollo (cuando no hay credenciales de Spotify)
export const DATOS_SIMULADOS = {
  artistas: [
    { id: '1', name: 'Bad Bunny', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cccbf6' }] },
    { id: '2', name: 'Taylor Swift', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4' }] },
    { id: '3', name: 'Drake', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9' }] },
    { id: '4', name: 'Billie Eilish', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb6ce6e7119b2a7e8b3f7b7c6f' }] },
    { id: '5', name: 'The Weeknd', images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' }] }
  ],
  canciones: [
    { id: '1', name: 'Tití Me Preguntó', artists: [{ name: 'Bad Bunny' }] },
    { id: '2', name: 'Anti-Hero', artists: [{ name: 'Taylor Swift' }] },
    { id: '3', name: 'God\'s Plan', artists: [{ name: 'Drake' }] },
    { id: '4', name: 'bad guy', artists: [{ name: 'Billie Eilish' }] },
    { id: '5', name: 'Blinding Lights', artists: [{ name: 'The Weeknd' }] }
  ]
};

/**
 * Obtener datos simulados para desarrollo
 */
export function obtenerDatosSimulados() {
  return {
    artistas: { ok: true, data: DATOS_SIMULADOS.artistas },
    canciones: { ok: true, data: DATOS_SIMULADOS.canciones }
  };
}