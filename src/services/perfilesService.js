import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  limit,
  orderBy 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

export const obtenerPerfilesRecomendados = async (userId) => {
  try {
    // Obtener el perfil del usuario actual para filtros
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();
    
    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener usuarios bloqueados y likes ya dados
    const [bloqueadosSnapshot, likesSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'bloqueos'), where('bloqueador', '==', userId))),
      getDocs(query(collection(db, 'likes'), where('usuarioId', '==', userId)))
    ]);

    const usuariosBloqueados = bloqueadosSnapshot.docs.map(doc => doc.data().bloqueado);
    const usuariosConLike = likesSnapshot.docs.map(doc => doc.data().perfilId);
    
    // Excluir usuarios ya procesados
    const excluidos = [...usuariosBloqueados, ...usuariosConLike, userId];

    // Query para obtener perfiles recomendados
    const perfilesQuery = query(
      collection(db, 'usuarios'),
      where('activo', '==', true),
      orderBy('ultimaActividad', 'desc'),
      limit(50)
    );

    const perfilesSnapshot = await getDocs(perfilesQuery);
    
    let perfilesRecomendados = perfilesSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(perfil => !excluidos.includes(perfil.id))
      .filter(perfil => {
        // Filtros básicos de compatibilidad
        const edadCompatible = 
          perfil.edad >= (userData.preferencias?.edadMin || 18) &&
          perfil.edad <= (userData.preferencias?.edadMax || 50);
        
        const generoCompatible = 
          !userData.preferencias?.genero || 
          userData.preferencias.genero === 'todos' ||
          perfil.genero === userData.preferencias.genero;

        return edadCompatible && generoCompatible;
      })
      .slice(0, 20); // Limitar a 20 perfiles

    // Calcular score de compatibilidad y ordenar
    perfilesRecomendados = perfilesRecomendados.map(perfil => ({
      ...perfil,
      compatibilidad: calcularCompatibilidad(userData, perfil)
    })).sort((a, b) => b.compatibilidad - a.compatibilidad);

    return perfilesRecomendados;
  } catch (error) {
    console.error('Error obteniendo perfiles recomendados:', error);
    throw error;
  }
};

const calcularCompatibilidad = (usuario, perfil) => {
  let score = 0;

  // Intereses en común (peso: 40%)
  if (usuario.intereses && perfil.intereses) {
    const interesesComunes = usuario.intereses.filter(interes => 
      perfil.intereses.includes(interes)
    );
    score += (interesesComunes.length / Math.max(usuario.intereses.length, perfil.intereses.length)) * 40;
  }

  // Proximidad de edad (peso: 20%)
  const diferenciaEdad = Math.abs(usuario.edad - perfil.edad);
  const scoreEdad = Math.max(0, 20 - diferenciaEdad * 2);
  score += scoreEdad;

  // Actividad reciente (peso: 20%)
  if (perfil.ultimaActividad) {
    const diasInactivo = (Date.now() - perfil.ultimaActividad.toDate()) / (1000 * 60 * 60 * 24);
    const scoreActividad = Math.max(0, 20 - diasInactivo * 2);
    score += scoreActividad;
  }

  // Perfil completo (peso: 20%)
  let completitud = 0;
  if (perfil.descripcion) completitud += 5;
  if (perfil.fotos && perfil.fotos.length > 1) completitud += 5;
  if (perfil.intereses && perfil.intereses.length > 0) completitud += 5;
  if (perfil.trabajo) completitud += 2.5;
  if (perfil.educacion) completitud += 2.5;
  score += completitud;

  return Math.min(100, score);
};

export const obtenerPerfil = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};