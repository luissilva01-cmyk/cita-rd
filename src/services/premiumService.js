import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

/* ----------------------------------------------------
   🔹 1. Obtener estado premium del usuario
---------------------------------------------------- */
export async function obtenerEstadoPremium(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const premiumDoc = await getDoc(doc(db, 'premium', userId));
    
    const userData = userDoc.exists() ? userDoc.data() : {};
    const premiumData = premiumDoc.exists() ? premiumDoc.data() : {};

    const now = new Date();
    const subscriptionEnd = premiumData.subscriptionEnd?.toDate();
    const isActive = subscriptionEnd && subscriptionEnd > now;

    return {
      isPremium: isActive,
      plan: premiumData.plan || 'free',
      subscriptionEnd: subscriptionEnd,
      features: {
        unlimitedLikes: isActive,
        rewind: isActive,
        boost: isActive,
        superBoost: premiumData.plan === 'gold',
        seeWhoLikesYou: isActive,
        passport: premiumData.plan === 'gold',
        readReceipts: isActive,
        topPicks: isActive
      },
      usage: {
        likesToday: userData.likesToday || 0,
        boostsUsed: premiumData.boostsUsed || 0,
        superBoostsUsed: premiumData.superBoostsUsed || 0,
        rewindsUsed: premiumData.rewindsUsed || 0
      },
      limits: {
        dailyLikes: isActive ? -1 : 50, // -1 = unlimited
        monthlyBoosts: premiumData.plan === 'gold' ? 5 : (isActive ? 1 : 0),
        monthlyRewinds: isActive ? 5 : 0
      }
    };
  } catch (error) {
    console.error('Error obteniendo estado premium:', error);
    return {
      isPremium: false,
      plan: 'free',
      features: {},
      usage: {},
      limits: { dailyLikes: 50, monthlyBoosts: 0, monthlyRewinds: 0 }
    };
  }
}

/* ----------------------------------------------------
   🔹 2. Sistema de Rewind (deshacer último swipe)
---------------------------------------------------- */
export async function rewindLastSwipe(userId) {
  try {
    const premiumStatus = await obtenerEstadoPremium(userId);
    
    if (!premiumStatus.features.rewind) {
      return { 
        success: false, 
        error: 'Rewind requiere suscripción premium',
        requiresPremium: true 
      };
    }

    if (premiumStatus.usage.rewindsUsed >= premiumStatus.limits.monthlyRewinds) {
      return { 
        success: false, 
        error: 'Has agotado tus rewinds del mes' 
      };
    }

    // Buscar el último like/pass del usuario
    const likesQuery = query(
      collection(db, 'likes'),
      where('from', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const likesSnap = await getDocs(likesQuery);
    
    if (likesSnap.empty) {
      return { 
        success: false, 
        error: 'No hay acciones para deshacer' 
      };
    }

    const lastLike = likesSnap.docs[0];
    const lastLikeData = lastLike.data();

    // Verificar que no haya pasado mucho tiempo (máximo 24 horas)
    const now = new Date();
    const likeTime = lastLikeData.timestamp.toDate();
    const hoursDiff = (now - likeTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return { 
        success: false, 
        error: 'Solo puedes deshacer acciones de las últimas 24 horas' 
      };
    }

    // Eliminar el like/pass
    await lastLike.ref.delete();

    // Si había match, eliminarlo también
    if (lastLikeData.tipo !== 'pass') {
      const matchQuery = query(
        collection(db, 'matches'),
        where('usuarios', 'array-contains', userId)
      );
      
      const matchSnap = await getDocs(matchQuery);
      
      for (const matchDoc of matchSnap.docs) {
        const matchData = matchDoc.data();
        if (matchData.usuarios.includes(lastLikeData.to)) {
          await matchDoc.ref.delete();
          break;
        }
      }
    }

    // Incrementar contador de rewinds usados
    await updateDoc(doc(db, 'premium', userId), {
      rewindsUsed: increment(1),
      lastRewindUsed: serverTimestamp()
    });

    // Obtener datos del perfil restaurado
    const profileDoc = await getDoc(doc(db, 'usuarios', lastLikeData.to));
    const profileData = profileDoc.exists() ? profileDoc.data() : null;

    return { 
      success: true, 
      restoredProfile: profileData ? {
        id: lastLikeData.to,
        ...profileData
      } : null,
      action: lastLikeData.tipo
    };

  } catch (error) {
    console.error('Error en rewind:', error);
    return { 
      success: false, 
      error: 'Error al deshacer la acción' 
    };
  }
}

/* ----------------------------------------------------
   🔹 3. Sistema de Boost (aumentar visibilidad)
---------------------------------------------------- */
export async function activarBoost(userId, type = 'normal') {
  try {
    const premiumStatus = await obtenerEstadoPremium(userId);
    
    if (type === 'super' && !premiumStatus.features.superBoost) {
      return { 
        success: false, 
        error: 'Super Boost requiere suscripción Gold',
        requiresPremium: true 
      };
    }

    if (type === 'normal' && !premiumStatus.features.boost) {
      return { 
        success: false, 
        error: 'Boost requiere suscripción premium',
        requiresPremium: true 
      };
    }

    const boostsUsed = type === 'super' ? 
      premiumStatus.usage.superBoostsUsed : 
      premiumStatus.usage.boostsUsed;
    
    const boostLimit = type === 'super' ? 1 : premiumStatus.limits.monthlyBoosts;

    if (boostsUsed >= boostLimit) {
      return { 
        success: false, 
        error: `Has agotado tus ${type === 'super' ? 'Super ' : ''}Boosts del mes` 
      };
    }

    // Verificar si ya tiene un boost activo
    const activeBoostQuery = query(
      collection(db, 'boosts'),
      where('userId', '==', userId),
      where('active', '==', true)
    );

    const activeBoostSnap = await getDocs(activeBoostQuery);
    
    if (!activeBoostSnap.empty) {
      return { 
        success: false, 
        error: 'Ya tienes un boost activo' 
      };
    }

    const duration = type === 'super' ? 3 * 60 * 60 * 1000 : 30 * 60 * 1000; // 3h vs 30min
    const endTime = new Date(Date.now() + duration);

    // Crear boost
    const boostDoc = await addDoc(collection(db, 'boosts'), {
      userId,
      type,
      startTime: serverTimestamp(),
      endTime: endTime,
      active: true,
      viewsGenerated: 0,
      likesReceived: 0
    });

    // Actualizar perfil del usuario para mayor visibilidad
    await updateDoc(doc(db, 'usuarios', userId), {
      boosted: true,
      boostType: type,
      boostEndTime: endTime,
      boostMultiplier: type === 'super' ? 10 : 3
    });

    // Incrementar contador
    const field = type === 'super' ? 'superBoostsUsed' : 'boostsUsed';
    await updateDoc(doc(db, 'premium', userId), {
      [field]: increment(1),
      lastBoostUsed: serverTimestamp()
    });

    return { 
      success: true, 
      boostId: boostDoc.id,
      duration: duration / 1000 / 60, // en minutos
      endTime: endTime
    };

  } catch (error) {
    console.error('Error activando boost:', error);
    return { 
      success: false, 
      error: 'Error al activar boost' 
    };
  }
}

/* ----------------------------------------------------
   🔹 4. Verificar y desactivar boosts expirados
---------------------------------------------------- */
export async function verificarBoostsExpirados() {
  try {
    const now = new Date();
    const expiredBoostsQuery = query(
      collection(db, 'boosts'),
      where('active', '==', true),
      where('endTime', '<=', now)
    );

    const expiredBoostsSnap = await getDocs(expiredBoostsQuery);

    for (const boostDoc of expiredBoostsSnap.docs) {
      const boostData = boostDoc.data();
      
      // Desactivar boost
      await updateDoc(boostDoc.ref, {
        active: false,
        deactivatedAt: serverTimestamp()
      });

      // Actualizar perfil del usuario
      await updateDoc(doc(db, 'usuarios', boostData.userId), {
        boosted: false,
        boostType: null,
        boostEndTime: null,
        boostMultiplier: 1
      });
    }

    return expiredBoostsSnap.size;
  } catch (error) {
    console.error('Error verificando boosts expirados:', error);
    return 0;
  }
}

/* ----------------------------------------------------
   🔹 5. Obtener "Top Picks" curados
---------------------------------------------------- */
export async function obtenerTopPicks(userId) {
  try {
    const premiumStatus = await obtenerEstadoPremium(userId);
    
    if (!premiumStatus.features.topPicks) {
      return { 
        success: false, 
        error: 'Top Picks requiere suscripción premium',
        requiresPremium: true 
      };
    }

    // Obtener perfiles de alta calidad basados en:
    // - Perfiles completos (fotos, descripción, intereses)
    // - Alta actividad reciente
    // - Buena compatibilidad
    const topPicksQuery = query(
      collection(db, 'usuarios'),
      where('activo', '==', true),
      where('perfilCompleto', '==', true),
      orderBy('popularityScore', 'desc'),
      limit(10)
    );

    const topPicksSnap = await getDocs(topPicksQuery);
    
    const topPicks = topPicksSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      isTopPick: true,
      reason: 'Perfil popular y activo'
    }));

    // Filtrar usuarios ya vistos/bloqueados
    // (implementar lógica similar a obtenerPerfilesRecomendados)

    return { 
      success: true, 
      picks: topPicks 
    };

  } catch (error) {
    console.error('Error obteniendo Top Picks:', error);
    return { 
      success: false, 
      error: 'Error cargando Top Picks' 
    };
  }
}

/* ----------------------------------------------------
   🔹 6. Ver quién te dio like (Likes You)
---------------------------------------------------- */
export async function obtenerLikesRecibidos(userId) {
  try {
    const premiumStatus = await obtenerEstadoPremium(userId);
    
    if (!premiumStatus.features.seeWhoLikesYou) {
      // Para usuarios free, solo mostrar cantidad borrosa
      const likesQuery = query(
        collection(db, 'likes'),
        where('to', '==', userId),
        where('tipo', 'in', ['like', 'superlike'])
      );

      const likesSnap = await getDocs(likesQuery);
      
      return { 
        success: false, 
        error: 'Ver quién te dio like requiere suscripción premium',
        requiresPremium: true,
        blurredCount: likesSnap.size
      };
    }

    // Para usuarios premium, mostrar perfiles completos
    const likesQuery = query(
      collection(db, 'likes'),
      where('to', '==', userId),
      where('tipo', 'in', ['like', 'superlike']),
      orderBy('timestamp', 'desc')
    );

    const likesSnap = await getDocs(likesQuery);
    const likes = [];

    for (const likeDoc of likesSnap.docs) {
      const likeData = likeDoc.data();
      
      // Verificar que no sea un match existente
      const matchQuery = query(
        collection(db, 'matches'),
        where('usuarios', 'array-contains-any', [userId, likeData.from])
      );
      
      const matchSnap = await getDocs(matchQuery);
      const isMatch = matchSnap.docs.some(doc => {
        const usuarios = doc.data().usuarios;
        return usuarios.includes(userId) && usuarios.includes(likeData.from);
      });

      if (!isMatch) {
        // Obtener datos del usuario
        const userDoc = await getDoc(doc(db, 'usuarios', likeData.from));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          likes.push({
            id: likeDoc.id,
            userId: likeData.from,
            type: likeData.tipo,
            timestamp: likeData.timestamp,
            profile: {
              nombre: userData.nombre,
              edad: userData.edad,
              fotoUrl: userData.fotoUrl,
              ciudad: userData.ciudad,
              intereses: userData.intereses
            }
          });
        }
      }
    }

    return { 
      success: true, 
      likes: likes 
    };

  } catch (error) {
    console.error('Error obteniendo likes recibidos:', error);
    return { 
      success: false, 
      error: 'Error cargando likes recibidos' 
    };
  }
}

/* ----------------------------------------------------
   🔹 7. Cambiar ubicación (Passport)
---------------------------------------------------- */
export async function cambiarUbicacion(userId, nuevaUbicacion) {
  try {
    const premiumStatus = await obtenerEstadoPremium(userId);
    
    if (!premiumStatus.features.passport) {
      return { 
        success: false, 
        error: 'Passport requiere suscripción Gold',
        requiresPremium: true 
      };
    }

    // Guardar ubicación original si es la primera vez
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();

    if (!userData.ubicacionOriginal) {
      await updateDoc(doc(db, 'usuarios', userId), {
        ubicacionOriginal: {
          ciudad: userData.ciudad,
          latitude: userData.latitude,
          longitude: userData.longitude
        }
      });
    }

    // Actualizar ubicación actual
    await updateDoc(doc(db, 'usuarios', userId), {
      ciudad: nuevaUbicacion.ciudad,
      latitude: nuevaUbicacion.latitude,
      longitude: nuevaUbicacion.longitude,
      usingPassport: true,
      passportLocation: nuevaUbicacion
    });

    return { 
      success: true, 
      newLocation: nuevaUbicacion 
    };

  } catch (error) {
    console.error('Error cambiando ubicación:', error);
    return { 
      success: false, 
      error: 'Error al cambiar ubicación' 
    };
  }
}

/* ----------------------------------------------------
   🔹 8. Restaurar ubicación original
---------------------------------------------------- */
export async function restaurarUbicacionOriginal(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    const userData = userDoc.data();

    if (!userData.ubicacionOriginal) {
      return { 
        success: false, 
        error: 'No hay ubicación original guardada' 
      };
    }

    await updateDoc(doc(db, 'usuarios', userId), {
      ciudad: userData.ubicacionOriginal.ciudad,
      latitude: userData.ubicacionOriginal.latitude,
      longitude: userData.ubicacionOriginal.longitude,
      usingPassport: false,
      passportLocation: null
    });

    return { 
      success: true, 
      originalLocation: userData.ubicacionOriginal 
    };

  } catch (error) {
    console.error('Error restaurando ubicación:', error);
    return { 
      success: false, 
      error: 'Error al restaurar ubicación' 
    };
  }
}

/* ----------------------------------------------------
   🔹 9. Obtener estadísticas de uso premium
---------------------------------------------------- */
export async function obtenerEstadisticasPremium(userId) {
  try {
    const premiumDoc = await getDoc(doc(db, 'premium', userId));
    const premiumData = premiumDoc.exists() ? premiumDoc.data() : {};

    const boostsQuery = query(
      collection(db, 'boosts'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );

    const boostsSnap = await getDocs(boostsQuery);
    const boosts = boostsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      subscription: {
        plan: premiumData.plan || 'free',
        startDate: premiumData.subscriptionStart,
        endDate: premiumData.subscriptionEnd,
        autoRenew: premiumData.autoRenew || false
      },
      usage: {
        rewindsUsed: premiumData.rewindsUsed || 0,
        boostsUsed: premiumData.boostsUsed || 0,
        superBoostsUsed: premiumData.superBoostsUsed || 0,
        totalBoosts: boosts.length
      },
      boostHistory: boosts,
      savings: {
        // Calcular cuánto ha ahorrado vs comprar funciones individualmente
        totalValue: (premiumData.rewindsUsed || 0) * 2 + 
                   (premiumData.boostsUsed || 0) * 5 + 
                   (premiumData.superBoostsUsed || 0) * 15
      }
    };

  } catch (error) {
    console.error('Error obteniendo estadísticas premium:', error);
    return null;
  }
}