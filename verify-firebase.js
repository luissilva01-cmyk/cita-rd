// verify-firebase.js - Script para verificar la configuración de Firebase
import { auth, db } from './src/utils/firebase.js';

console.log('🔥 Verificando configuración de Firebase...');

// Verificar que Firebase Auth está inicializado
if (auth) {
    console.log('✅ Firebase Auth inicializado correctamente');
    console.log('📱 Auth Domain:', auth.config.authDomain);
    console.log('🔑 Project ID:', auth.config.projectId);
} else {
    console.error('❌ Error: Firebase Auth no está inicializado');
}

// Verificar que Firestore está inicializado
if (db) {
    console.log('✅ Firestore inicializado correctamente');
    console.log('🗄️ Database:', db.app.name);
} else {
    console.error('❌ Error: Firestore no está inicializado');
}

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('👤 Usuario autenticado:', user.email);
    } else {
        console.log('🔓 No hay usuario autenticado (normal en primera carga)');
    }
});

console.log('🎯 Verificación de Firebase completada');
console.log('🚀 La aplicación está lista para usar autenticación');