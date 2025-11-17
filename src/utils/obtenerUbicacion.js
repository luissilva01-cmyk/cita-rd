// src/utils/obtenerUbicacion.js

export async function obtenerUbicacionActual() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La geolocalización no está soportada en este navegador."));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("⚠️ No se pudo obtener la ubicación:", err.message);
        resolve(null); // No rechazamos, solo devolvemos null si el usuario niega permisos
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
