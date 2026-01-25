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
