// src/utils/filtrarPerfilesAvanzado.js

/**
 * Calcular distancia entre dos coordenadas usando fórmula de Haversine
 * @param {object} coord1 - {lat, lng}
 * @param {object} coord2 - {lat, lng}
 * @returns {number} Distancia en kilómetros
 */
export function calcularDistancia(coord1, coord2) {
  if (!coord1 || !coord2 || !coord1.lat || !coord2.lat) return 0;

  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  
  return Math.round(distancia);
}

function toRad(grados) {
  return grados * (Math.PI / 180);
}

/**
 * Filtrar perfiles según preferencias del usuario
 * @param {array} perfiles - Lista de perfiles
 * @param {object} preferencias - Preferencias del usuario
 * @param {object} miUbicacion - Ubicación del usuario {lat, lng}
 * @param {array} bloqueados - Lista de UIDs bloqueados
 * @param {string} miUid - UID del usuario actual
 */
export function filtrarPerfilesAvanzado(perfiles, preferencias, miUbicacion, bloqueados = [], miUid) {
  return perfiles.filter(perfil => {
    // No mostrar mi propio perfil
    if (perfil.uid === miUid) return false;

    // No mostrar bloqueados
    if (bloqueados.includes(perfil.uid)) return false;

    // Filtro de edad
    if (preferencias.edadMin && perfil.edad < preferencias.edadMin) return false;
    if (preferencias.edadMax && perfil.edad > preferencias.edadMax) return false;

    // Filtro de género
    if (preferencias.generoInteres && preferencias.generoInteres !== "todos") {
      if (perfil.genero !== preferencias.generoInteres) return false;
    }

    // Filtro de distancia
    if (preferencias.distanciaMax && miUbicacion && perfil.ubicacion) {
      const distancia = calcularDistancia(miUbicacion, perfil.ubicacion);
      if (distancia > preferencias.distanciaMax) return false;
    }

    return true;
  });
}

/**
 * Ordenar perfiles por relevancia
 * @param {array} perfiles - Lista de perfiles filtrados
 * @param {object} miPerfil - Perfil del usuario actual
 * @param {object} miUbicacion - Ubicación del usuario
 */
export function ordenarPorRelevancia(perfiles, miPerfil, miUbicacion) {
  return perfiles.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Puntos por intereses comunes
    if (miPerfil.intereses && a.intereses) {
      const comunesA = miPerfil.intereses.filter(i => a.intereses.includes(i)).length;
      scoreA += comunesA * 10;
    }
    if (miPerfil.intereses && b.intereses) {
      const comunesB = miPerfil.intereses.filter(i => b.intereses.includes(i)).length;
      scoreB += comunesB * 10;
    }

    // Puntos por cercanía
    if (miUbicacion && a.ubicacion) {
      const distA = calcularDistancia(miUbicacion, a.ubicacion);
      scoreA += Math.max(0, 100 - distA); // Más cerca = más puntos
    }
    if (miUbicacion && b.ubicacion) {
      const distB = calcularDistancia(miUbicacion, b.ubicacion);
      scoreB += Math.max(0, 100 - distB);
    }

    // Puntos por perfil completo
    if (a.fotoPerfil) scoreA += 5;
    if (a.descripcion && a.descripcion.length > 50) scoreA += 5;
    if (b.fotoPerfil) scoreB += 5;
    if (b.descripcion && b.descripcion.length > 50) scoreB += 5;

    return scoreB - scoreA; // Orden descendente
  });
}
