# 🧹 Limpiar Mensajes Antiguos de Voz/Video

## Problema

Los mensajes de voz y video antiguos usan URLs `blob:` locales que ya no funcionan. Estos mensajes se crearon ANTES de activar el código de Firebase Storage.

## Solución

Tienes dos opciones:

### Opción 1: Eliminar Mensajes Antiguos desde Firebase Console (Recomendado)

1. Ve a https://console.firebase.google.com/project/citard-fbc26/firestore
2. Navega a la colección `messages`
3. Busca mensajes con:
   - `type: 'voice'` o `type: 'video'`
   - `content` que empiece con `blob:http://`
4. Elimina esos mensajes manualmente

### Opción 2: Crear Nuevos Mensajes de Prueba

Simplemente envía nuevos mensajes de voz/video. Los nuevos mensajes usarán Firebase Storage correctamente.

## Cómo Identificar Mensajes Nuevos vs Antiguos

### Mensajes Antiguos (NO funcionan)
```javascript
{
  type: "voice" o "video",
  content: "blob:http://localhost:3000/abc123...",  // ❌ URL local
  timestamp: ...
}
```

### Mensajes Nuevos (Funcionan)
```javascript
{
  type: "voice" o "video",
  content: "https://firebasestorage.googleapis.com/v0/b/citard-fbc26.appspot.com/o/voice_messages%2F...",  // ✅ URL de Firebase
  timestamp: ...
}
```

## Prueba Rápida

1. **Abre la consola del navegador** (F12)
2. **Graba un nuevo mensaje de voz**
3. **Busca en la consola:**
   ```
   ☁️ Subiendo archivo a Firebase Storage...
   📤 Subiendo a: voice_messages/...
   ✅ Archivo subido, obteniendo URL...
   ✅ URL obtenida: https://firebasestorage.googleapis.com/...
   ```
4. **Si ves estos logs, el código está funcionando correctamente**
5. **El receptor debería poder escuchar/ver el mensaje**

## Script de Limpieza (Opcional)

Si quieres eliminar todos los mensajes antiguos automáticamente, puedes ejecutar este script en la consola de Firebase:

```javascript
// ADVERTENCIA: Esto eliminará TODOS los mensajes de voz/video con URLs blob:
// Ejecutar en Firebase Console > Firestore > Reglas > Playground

const db = firebase.firestore();
const messagesRef = db.collection('messages');

// Buscar mensajes con URLs blob:
messagesRef
  .where('type', 'in', ['voice', 'video'])
  .get()
  .then(snapshot => {
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.content && data.content.startsWith('blob:')) {
        batch.delete(doc.ref);
        count++;
      }
    });
    
    if (count > 0) {
      return batch.commit().then(() => {
        console.log(`✅ Eliminados ${count} mensajes antiguos`);
      });
    } else {
      console.log('No hay mensajes antiguos para eliminar');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Verificación

Después de limpiar los mensajes antiguos o enviar nuevos mensajes:

1. Los errores `blob:http://... Failed to load resource` deberían desaparecer
2. Los nuevos mensajes deberían mostrar URLs de Firebase Storage
3. El receptor debería poder reproducir los mensajes

---

**Fecha:** 30 Enero 2026  
**Proyecto:** Ta' Pa' Ti  
**Firebase:** citard-fbc26
