/**
 * Script para insertar likes de prueba en Firestore
 * Ejecutar: node scripts/seed-test-likes.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializar con el proyecto por defecto (usa GOOGLE_APPLICATION_CREDENTIALS o gcloud auth)
initializeApp({ projectId: 'citard-fbc26' });
const db = getFirestore();

const TARGET_USER_ID = 'je1HdwssPigxtDyHKZpkXNMOGY32';

const fakeUsers = [
  {
    id: 'test_valentina_001',
    name: 'Valentina Cruz',
    age: 24,
    bio: 'Amante de la música y los viajes. Buscando alguien con buena vibra.',
    location: 'Santo Domingo Este',
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop'],
    interests: ['Música', 'Viajes', 'Arte'],
    gender: 'mujer',
    isVerified: true,
  },
  {
    id: 'test_mariana_002',
    name: 'Mariana Pérez',
    age: 26,
    bio: 'Deportista y cocinera. Me encanta probar restaurantes nuevos.',
    location: 'Piantini',
    images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop'],
    interests: ['Deportes', 'Cocina', 'Cine'],
    gender: 'mujer',
    isVerified: true,
  },
  {
    id: 'test_isabella_003',
    name: 'Isabella Méndez',
    age: 23,
    bio: 'Artista y lectora. Busco conexiones reales.',
    location: 'Naco',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop'],
    interests: ['Arte', 'Lectura', 'Yoga'],
    gender: 'mujer',
    isVerified: false,
  },
  {
    id: 'test_sofia_004',
    name: 'Sofía Reyes',
    age: 27,
    bio: 'Bailarina y foodie. La vida es mejor con merengue.',
    location: 'Bella Vista',
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop'],
    interests: ['Música', 'Baile', 'Gastronomía'],
    gender: 'mujer',
    isVerified: true,
  },
];

async function seedTestData() {
  console.log('🌱 Insertando datos de prueba...\n');

  // 1. Crear perfiles falsos
  for (const user of fakeUsers) {
    const { id, ...profileData } = user;
    await db.collection('perfiles').doc(id).set(profileData, { merge: true });
    console.log(`✅ Perfil creado: ${user.name} (${id})`);
  }

  // 2. Crear likes apuntando al usuario target
  const now = Date.now();
  for (let i = 0; i < fakeUsers.length; i++) {
    const user = fakeUsers[i];
    const likeId = `${user.id}_${TARGET_USER_ID}`;
    await db.collection('likes').doc(likeId).set({
      fromUserId: user.id,
      toUserId: TARGET_USER_ID,
      timestamp: now - (i * 3600000), // cada uno 1 hora antes
      isSuperLike: i === 0, // el primero es super like
    });
    console.log(`❤️ Like creado: ${user.name} → Luis (${i === 0 ? 'SUPER LIKE' : 'like normal'})`);
  }

  console.log('\n🎉 ¡Listo! 4 likes insertados.');
  console.log('Ve a tapati.online → Te dieron like para ver el efecto.');
  console.log('- Likes 1 y 2: visibles (Valentina y Mariana)');
  console.log('- Likes 3 y 4: bloqueados con blur + candado Premium (Isabella y Sofía)');
}

seedTestData().catch(console.error);
