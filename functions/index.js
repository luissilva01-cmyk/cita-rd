/**
 * Cloud Functions para Ta' Pa' Ti
 * 
 * Funciones serverless para operaciones seguras que requieren
 * credenciales privadas (como eliminar fotos de ImageKit)
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ImageKit = require('imagekit');

// Inicializar Firebase Admin
admin.initializeApp();

// Inicializar ImageKit con credenciales del entorno
const imagekit = new ImageKit({
  publicKey: functions.config().imagekit.public_key,
  privateKey: functions.config().imagekit.private_key,
  urlEndpoint: functions.config().imagekit.url_endpoint
});

// ==============================
// FUNCIONES DE NOTIFICACIONES PUSH
// ==============================

/**
 * Envía notificación push cuando hay un nuevo mensaje
 * 
 * Trigger: onCreate en /chats/{chatId}/messages/{messageId}
 */
exports.sendMessageNotification = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const { chatId } = context.params;
    
    try {
      // Obtener información del chat
      const chatDoc = await admin.firestore()
        .collection('chats')
        .doc(chatId)
        .get();
      
      if (!chatDoc.exists) {
        console.log('Chat no encontrado');
        return null;
      }
      
      const chatData = chatDoc.data();
      const participants = chatData.participants || [];
      
      // Encontrar el receptor (el que NO envió el mensaje)
      const recipientId = participants.find(id => id !== message.senderId);
      
      if (!recipientId) {
        console.log('Receptor no encontrado');
        return null;
      }
      
      // Obtener token FCM del receptor
      const tokenDoc = await admin.firestore()
        .collection('fcmTokens')
        .doc(recipientId)
        .get();
      
      if (!tokenDoc.exists || !tokenDoc.data().token) {
        console.log('Token FCM no encontrado para usuario:', recipientId);
        return null;
      }
      
      const fcmToken = tokenDoc.data().token;
      
      // Obtener nombre del remitente
      const senderDoc = await admin.firestore()
        .collection('perfiles')
        .doc(message.senderId)
        .get();
      
      const senderName = senderDoc.exists ? 
        (senderDoc.data().name || 'Alguien') : 
        'Alguien';
      
      // Preparar contenido del mensaje
      let messageBody = '';
      switch (message.type) {
        case 'text':
          messageBody = message.text || 'Nuevo mensaje';
          break;
        case 'photo':
          messageBody = '📷 Foto';
          break;
        case 'voice':
          messageBody = '🎤 Mensaje de voz';
          break;
        case 'video':
          messageBody = '🎥 Video mensaje';
          break;
        case 'story_reaction':
          messageBody = '❤️ Reaccionó a tu historia';
          break;
        default:
          messageBody = 'Nuevo mensaje';
      }
      
      // Enviar notificación
      const payload = {
        notification: {
          title: senderName,
          body: messageBody
        },
        data: {
          type: 'message',
          chatId: chatId,
          senderId: message.senderId,
          senderName: senderName,
          icon: '/logo192.png',
          clickAction: `https://tapati.online/chat/${chatId}`
        },
        webpush: {
          notification: {
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'message',
            requireInteraction: false,
            vibrate: [200, 100, 200]
          },
          fcmOptions: {
            link: `https://tapati.online/chat/${chatId}`
          }
        },
        token: fcmToken
      };
      
      await admin.messaging().send(payload);
      console.log('✅ Notificación de mensaje enviada a:', recipientId);
      
      return null;
    } catch (error) {
      console.error('❌ Error enviando notificación de mensaje:', error);
      return null;
    }
  });

/**
 * Envía notificación push cuando hay un nuevo match
 * 
 * Trigger: onCreate en /chats/{chatId}
 */
exports.sendMatchNotification = functions.firestore
  .document('chats/{chatId}')
  .onCreate(async (snap, context) => {
    const chat = snap.data();
    
    try {
      const participants = chat.participants || [];
      
      if (participants.length !== 2) {
        console.log('Chat no tiene exactamente 2 participantes');
        return null;
      }
      
      // Enviar notificación a ambos participantes
      for (const userId of participants) {
        // Obtener token FCM
        const tokenDoc = await admin.firestore()
          .collection('fcmTokens')
          .doc(userId)
          .get();
        
        if (!tokenDoc.exists || !tokenDoc.data().token) {
          console.log('Token FCM no encontrado para usuario:', userId);
          continue;
        }
        
        const fcmToken = tokenDoc.data().token;
        
        // Obtener nombre del otro usuario
        const otherUserId = participants.find(id => id !== userId);
        const otherUserDoc = await admin.firestore()
          .collection('perfiles')
          .doc(otherUserId)
          .get();
        
        const otherUserName = otherUserDoc.exists ? 
          (otherUserDoc.data().name || 'Alguien') : 
          'Alguien';
        
        // Enviar notificación
        const payload = {
          notification: {
            title: '🎉 ¡Nuevo Match!',
            body: `¡Hiciste match con ${otherUserName}!`
          },
          data: {
            type: 'match',
            chatId: context.params.chatId,
            matchUserId: otherUserId,
            matchUserName: otherUserName,
            icon: '/logo192.png',
            clickAction: 'https://tapati.online/matches'
          },
          webpush: {
            notification: {
              icon: '/logo192.png',
              badge: '/logo192.png',
              tag: 'match',
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200]
            },
            fcmOptions: {
              link: 'https://tapati.online/matches'
            }
          },
          token: fcmToken
        };
        
        await admin.messaging().send(payload);
        console.log('✅ Notificación de match enviada a:', userId);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error enviando notificación de match:', error);
      return null;
    }
  });

/**
 * Envía notificación push cuando alguien crea una nueva story
 * 
 * Trigger: onCreate en /stories/{storyId}
 */
exports.sendStoryNotification = functions.firestore
  .document('stories/{storyId}')
  .onCreate(async (snap, context) => {
    const story = snap.data();
    
    try {
      // Obtener nombre del creador de la story
      const creatorDoc = await admin.firestore()
        .collection('perfiles')
        .doc(story.userId)
        .get();
      
      const creatorName = creatorDoc.exists ? 
        (creatorDoc.data().name || 'Alguien') : 
        'Alguien';
      
      // Obtener configuración de privacidad
      const privacyDoc = await admin.firestore()
        .collection('privacySettings')
        .doc(story.userId)
        .get();
      
      let targetUserIds = [];
      
      if (privacyDoc.exists) {
        const privacy = privacyDoc.data();
        const storyPrivacy = privacy.stories || 'matches';
        
        if (storyPrivacy === 'everyone') {
          // Obtener todos los usuarios (limitado a 100 para evitar sobrecarga)
          const usersSnapshot = await admin.firestore()
            .collection('perfiles')
            .limit(100)
            .get();
          
          targetUserIds = usersSnapshot.docs
            .map(doc => doc.id)
            .filter(id => id !== story.userId);
        } else if (storyPrivacy === 'matches') {
          // Obtener matches del usuario
          const chatsSnapshot = await admin.firestore()
            .collection('chats')
            .where('participants', 'array-contains', story.userId)
            .get();
          
          targetUserIds = chatsSnapshot.docs
            .map(doc => {
              const participants = doc.data().participants || [];
              return participants.find(id => id !== story.userId);
            })
            .filter(id => id);
        }
      }
      
      // Enviar notificaciones a usuarios objetivo (máximo 10 por story)
      const limitedTargets = targetUserIds.slice(0, 10);
      
      for (const userId of limitedTargets) {
        // Obtener token FCM
        const tokenDoc = await admin.firestore()
          .collection('fcmTokens')
          .doc(userId)
          .get();
        
        if (!tokenDoc.exists || !tokenDoc.data().token) {
          continue;
        }
        
        const fcmToken = tokenDoc.data().token;
        
        // Enviar notificación
        const payload = {
          notification: {
            title: `${creatorName} publicó una historia`,
            body: '¡Mírala antes de que desaparezca!'
          },
          data: {
            type: 'story',
            storyId: context.params.storyId,
            creatorId: story.userId,
            creatorName: creatorName,
            icon: '/logo192.png',
            clickAction: 'https://tapati.online/'
          },
          webpush: {
            notification: {
              icon: '/logo192.png',
              badge: '/logo192.png',
              tag: 'story',
              requireInteraction: false,
              vibrate: [200, 100, 200]
            },
            fcmOptions: {
              link: 'https://tapati.online/'
            }
          },
          token: fcmToken
        };
        
        await admin.messaging().send(payload);
      }
      
      console.log(`✅ Notificaciones de story enviadas a ${limitedTargets.length} usuarios`);
      
      return null;
    } catch (error) {
      console.error('❌ Error enviando notificación de story:', error);
      return null;
    }
  });

// ==============================
// FUNCIONES DE IMAGEKIT
// ==============================

/**
 * Elimina una foto de ImageKit
 * 
 * Esta función verifica que:
 * 1. El usuario esté autenticado
 * 2. La foto pertenezca al usuario
 * 3. Elimina la foto físicamente de ImageKit
 * 
 * @param {Object} data - { fileId: string, photoUrl: string }
 * @param {Object} context - Contexto de autenticación
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
exports.deleteImageKitPhoto = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuario debe estar autenticado para eliminar fotos'
    );
  }

  const { fileId, photoUrl } = data;
  const userId = context.auth.uid;

  // Validar parámetros
  if (!fileId || !photoUrl) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Se requieren fileId y photoUrl'
    );
  }

  try {
    console.log(`🗑️ Eliminando foto para usuario: ${userId}`);
    console.log(`📝 File ID: ${fileId}`);
    console.log(`🔗 URL: ${photoUrl}`);

    // Verificar que la foto pertenece al usuario
    const userDoc = await admin.firestore()
      .collection('perfiles')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Perfil de usuario no encontrado'
      );
    }

    const userData = userDoc.data();
    const userImages = userData.images || [];

    // Verificar que la URL está en las imágenes del usuario
    if (!userImages.includes(photoUrl)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'No tienes permiso para eliminar esta foto'
      );
    }

    // Eliminar de ImageKit
    console.log('☁️ Eliminando de ImageKit...');
    await imagekit.deleteFile(fileId);
    console.log('✅ Foto eliminada de ImageKit');

    return {
      success: true,
      message: 'Foto eliminada correctamente de ImageKit'
    };

  } catch (error) {
    console.error('❌ Error eliminando foto:', error);

    // Si es un error de ImageKit
    if (error.message && error.message.includes('File not found')) {
      // La foto ya no existe en ImageKit, considerarlo éxito
      console.log('⚠️ Foto ya no existe en ImageKit');
      return {
        success: true,
        message: 'Foto ya había sido eliminada'
      };
    }

    // Otros errores
    throw new functions.https.HttpsError(
      'internal',
      `Error al eliminar la foto: ${error.message}`
    );
  }
});

/**
 * Obtiene parámetros de autenticación para ImageKit
 * 
 * Esta función genera los parámetros necesarios para autenticar
 * subidas a ImageKit desde el frontend de forma segura
 * 
 * @returns {Promise<Object>} - { signature, expire, token }
 */
exports.getImageKitAuthParams = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuario debe estar autenticado'
    );
  }

  try {
    // Generar parámetros de autenticación
    const authParams = imagekit.getAuthenticationParameters();
    
    console.log(`🔐 Parámetros de autenticación generados para usuario: ${context.auth.uid}`);
    
    return authParams;

  } catch (error) {
    console.error('❌ Error generando parámetros de autenticación:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Error generando parámetros: ${error.message}`
    );
  }
});

/**
 * Limpia fotos huérfanas de ImageKit
 * 
 * Esta función se ejecuta periódicamente para eliminar fotos
 * que ya no están referenciadas en ningún perfil de usuario
 * 
 * Ejecutar manualmente: firebase functions:call cleanOrphanedPhotos
 */
exports.cleanOrphanedPhotos = functions.https.onCall(async (data, context) => {
  // Solo administradores pueden ejecutar esta función
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo administradores pueden ejecutar esta función'
    );
  }

  try {
    console.log('🧹 Iniciando limpieza de fotos huérfanas...');

    // Obtener todas las fotos de ImageKit
    const imagekitFiles = await imagekit.listFiles({
      path: '/profile-photos',
      limit: 1000
    });

    console.log(`📊 Total de fotos en ImageKit: ${imagekitFiles.length}`);

    // Obtener todas las URLs de fotos en uso
    const usersSnapshot = await admin.firestore()
      .collection('perfiles')
      .get();

    const usedUrls = new Set();
    usersSnapshot.forEach(doc => {
      const images = doc.data().images || [];
      images.forEach(url => usedUrls.add(url));
    });

    console.log(`📊 Total de fotos en uso: ${usedUrls.size}`);

    // Encontrar fotos huérfanas
    const orphanedPhotos = imagekitFiles.filter(file => {
      const fileUrl = file.url;
      return !usedUrls.has(fileUrl);
    });

    console.log(`🗑️ Fotos huérfanas encontradas: ${orphanedPhotos.length}`);

    // Eliminar fotos huérfanas
    let deletedCount = 0;
    for (const photo of orphanedPhotos) {
      try {
        await imagekit.deleteFile(photo.fileId);
        deletedCount++;
        console.log(`✅ Eliminada: ${photo.name}`);
      } catch (error) {
        console.error(`❌ Error eliminando ${photo.name}:`, error.message);
      }
    }

    console.log(`✅ Limpieza completada. Eliminadas: ${deletedCount}/${orphanedPhotos.length}`);

    return {
      success: true,
      totalPhotos: imagekitFiles.length,
      usedPhotos: usedUrls.size,
      orphanedPhotos: orphanedPhotos.length,
      deletedPhotos: deletedCount
    };

  } catch (error) {
    console.error('❌ Error en limpieza:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Error en limpieza: ${error.message}`
    );
  }
});


// ==============================
// LIMPIEZA DE PERFILES HUÉRFANOS
// ==============================

/**
 * Elimina perfiles en Firestore cuyo usuario ya no existe en Firebase Auth.
 * Esto ocurre cuando se borra un usuario directamente desde la consola de Firebase
 * sin pasar por el flujo de eliminación de cuenta de la app.
 *
 * Solo puede ser llamada por un administrador (isAdmin === true en perfiles).
 */
exports.cleanOrphanedProfiles = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  // Verificar que el llamante es admin
  const callerDoc = await admin.firestore()
    .collection('perfiles')
    .doc(context.auth.uid)
    .get();

  if (!callerDoc.exists || callerDoc.data().isAdmin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Solo administradores pueden ejecutar esta función');
  }

  try {
    console.log('🧹 Iniciando limpieza de perfiles huérfanos...');

    const perfilesSnapshot = await admin.firestore().collection('perfiles').get();
    console.log(`📊 Total perfiles en Firestore: ${perfilesSnapshot.size}`);

    const orphaned = [];

    for (const docSnap of perfilesSnapshot.docs) {
      const uid = docSnap.id;
      try {
        await admin.auth().getUser(uid);
        // Usuario existe en Auth → no es huérfano
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          orphaned.push(uid);
        }
      }
    }

    console.log(`🗑️ Perfiles huérfanos encontrados: ${orphaned.length}`);

    // Eliminar cada perfil huérfano y sus datos asociados
    for (const uid of orphaned) {
      const batch = admin.firestore().batch();

      // Perfil
      batch.delete(admin.firestore().collection('perfiles').doc(uid));
      // Presence
      batch.delete(admin.firestore().collection('presence').doc(uid));
      // Privacy settings
      batch.delete(admin.firestore().collection('privacySettings').doc(uid));
      // Verification
      batch.delete(admin.firestore().collection('verifications').doc(uid));

      await batch.commit();

      // Likes dados y recibidos
      const likesGiven = await admin.firestore().collection('likes').where('fromUserId', '==', uid).get();
      const likesReceived = await admin.firestore().collection('likes').where('toUserId', '==', uid).get();
      const likesBatch = admin.firestore().batch();
      [...likesGiven.docs, ...likesReceived.docs].forEach(d => likesBatch.delete(d.ref));
      await likesBatch.commit();

      // Stories
      const stories = await admin.firestore().collection('stories').where('userId', '==', uid).get();
      const storiesBatch = admin.firestore().batch();
      stories.docs.forEach(d => storiesBatch.delete(d.ref));
      await storiesBatch.commit();

      console.log(`✅ Perfil huérfano eliminado: ${uid}`);
    }

    return {
      success: true,
      checked: perfilesSnapshot.size,
      orphanedFound: orphaned.length,
      deleted: orphaned.length,
      deletedIds: orphaned
    };

  } catch (error) {
    console.error('❌ Error en cleanOrphanedProfiles:', error);
    throw new functions.https.HttpsError('internal', `Error: ${error.message}`);
  }
});

// ==============================
// NOTIFICACIÓN DE NUEVO USUARIO
// ==============================

/**
 * Envía push notification a todos los usuarios cuando alguien nuevo se registra
 * 
 * Trigger: onCreate en /perfiles/{userId}
 * Notifica: "🔥 Nuevo perfil en Ta' Pa' Ti — entra a ver quién es"
 */
exports.notifyNewUser = functions.firestore
  .document('perfiles/{userId}')
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    const newUserId = context.params.userId;
    
    try {
      const newUserName = newUser.name || 'Alguien nuevo';
      const newUserLocation = newUser.location || '';
      
      console.log(`🆕 Nuevo usuario registrado: ${newUserName} (${newUserId})`);
      
      // Obtener todos los tokens FCM (excepto el del nuevo usuario)
      const tokensSnapshot = await admin.firestore()
        .collection('fcmTokens')
        .get();
      
      if (tokensSnapshot.empty) {
        console.log('No hay tokens FCM registrados');
        return null;
      }
      
      const tokens = [];
      tokensSnapshot.forEach(doc => {
        if (doc.id !== newUserId && doc.data().token) {
          tokens.push(doc.data().token);
        }
      });
      
      if (tokens.length === 0) {
        console.log('No hay otros usuarios con tokens FCM');
        return null;
      }
      
      console.log(`📤 Enviando notificación a ${tokens.length} usuarios`);
      
      // Preparar mensaje
      const locationText = newUserLocation ? ` de ${newUserLocation}` : '';
      const body = `${newUserName}${locationText} se unió a Ta' Pa' Ti. ¡Entra a ver su perfil!`;
      
      // Enviar a cada token individualmente (multicast puede fallar con tokens inválidos)
      let successCount = 0;
      let failCount = 0;
      
      for (const token of tokens) {
        try {
          await admin.messaging().send({
            notification: {
              title: '🔥 Nuevo perfil disponible',
              body: body
            },
            data: {
              type: 'new_user',
              newUserId: newUserId,
              newUserName: newUserName,
              clickAction: 'https://tapati.online'
            },
            webpush: {
              notification: {
                icon: '/logo-tpt.png',
                badge: '/logo-tpt.png',
                tag: 'new-user',
                requireInteraction: false,
                vibrate: [200, 100, 200]
              },
              fcmOptions: {
                link: 'https://tapati.online'
              }
            },
            token: token
          });
          successCount++;
        } catch (err) {
          failCount++;
          // Si el token es inválido, eliminarlo
          if (err.code === 'messaging/registration-token-not-registered' ||
              err.code === 'messaging/invalid-registration-token') {
            // Buscar y eliminar el token inválido
            const invalidTokenQuery = await admin.firestore()
              .collection('fcmTokens')
              .where('token', '==', token)
              .get();
            invalidTokenQuery.forEach(doc => doc.ref.delete());
            console.log('🗑️ Token inválido eliminado');
          }
        }
      }
      
      console.log(`✅ Notificaciones enviadas: ${successCount} éxito, ${failCount} fallidas`);
      
      return null;
    } catch (error) {
      console.error('❌ Error en notifyNewUser:', error);
      return null;
    }
  });
