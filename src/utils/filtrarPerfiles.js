// src/utils/filtrarPerfiles.js

// 🔍 Función de similitud entre dos listas de intereses
export function calcularSimilitud(interesesUsuario, interesesOtro) {
  if (!interesesUsuario?.length || !interesesOtro?.length) return 0;
  const comunes = interesesUsuario.filter((i) => interesesOtro.includes(i));
  return comunes.length / Math.max(interesesUsuario.length, interesesOtro.length);
}

// 📍 Calcular distancia (si ambos tienen ubicación: lat, lng)
export function calcularDistanciaKm(ubic1, ubic2) {
  if (!ubic1 || !ubic2) return null;

  const R = 6371; // Radio de la Tierra en km
  const dLat = ((ubic2.lat - ubic1.lat) * Math.PI) / 180;
  const dLon = ((ubic2.lng - ubic1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((ubic1.lat * Math.PI) / 180) *
      Math.cos((ubic2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distancia en km
}

// 💘 Filtrar y ordenar perfiles
export function filtrarPerfiles({ usuarioActual, perfiles, distanciaMaxKm = 50 }) {
  return perfiles
    .filter((p) => p.uid !== usuarioActual.uid) // excluirse a sí mismo
    .map((p) => {
      const similitud = calcularSimilitud(usuarioActual.intereses, p.intereses);
      const distancia = calcularDistanciaKm(usuarioActual.ubicacion, p.ubicacion);
      return { ...p, similitud, distancia };
    })
    .filter((p) => p.similitud > 0.2 || (p.distancia !== null && p.distancia <= distanciaMaxKm)) // mínimo 20% de afinidad o cerca
    .sort((a, b) => b.similitud - a.similitud); // ordenar por mayor coincidencia
}
