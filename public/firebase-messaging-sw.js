// cita-rd/public/firebase-messaging-sw.js
// Service Worker para Firebase Cloud Messaging

// Importar Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con tu config)
const firebaseConfig = {
  apiKey: "AIzaSyBXSLcUbXD5fJ5oNVYEbZ_ijH8cN-OqYhI",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.firebasestorage.app",
  messagingSenderId: "211883945351",
  appId: "1:211883945351:web:c5e3f5e5e5e5e5e5e5e5e5"
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Ta\' Pa\' Ti';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: payload.data?.type || 'general',
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.', event);
  
  event.notification.close();
  
  // Determinar URL según el tipo de notificación
  let urlToOpen = '/';
  const notificationData = event.notification.data;
  
  if (notificationData) {
    switch (notificationData.type) {
      case 'message':
        urlToOpen = `/chat/${notificationData.chatId}`;
        break;
      case 'match':
        urlToOpen = '/matches';
        break;
      case 'story':
        urlToOpen = '/';
        break;
      default:
        urlToOpen = '/';
    }
  }
  
  // Abrir o enfocar la ventana de la app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then(() => client.navigate(urlToOpen));
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
