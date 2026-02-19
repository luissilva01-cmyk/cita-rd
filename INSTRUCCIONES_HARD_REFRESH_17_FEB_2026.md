# Instrucciones para Hard Refresh - 17 Feb 2026

## 🚨 PROBLEMA

El navegador está mostrando la versión cacheada antigua de la app. Los logs nuevos con prefijo `[MOUNT]` y `[TRIGGER]` NO aparecen en consola.

## ✅ SOLUCIÓN: Hard Refresh Agresivo

### Opción 1: Hard Refresh en Edge/Chrome (RECOMENDADO)

1. **Abrir DevTools PRIMERO:**
   - Presiona `F12` para abrir DevTools
   - O clic derecho → "Inspeccionar"

2. **Con DevTools abierto, hacer clic derecho en el botón de recargar:**
   - Clic derecho en el ícono de recargar (🔄) en la barra de direcciones
   - Seleccionar **"Vaciar caché y recargar de manera forzada"** (Empty Cache and Hard Reload)

3. **Verificar en consola:**
   - Deberías ver logs con prefijo `[MOUNT]`:
     ```
     🚀 [MOUNT] Iniciando carga inicial de perfiles para Discovery
     📡 [MOUNT] Llamando a getDiscoveryProfiles...
     ```

### Opción 2: Limpiar Caché Manualmente

1. **Abrir configuración de caché:**
   - Presiona `Ctrl + Shift + Delete`
   - O ve a Configuración → Privacidad → Borrar datos de navegación

2. **Seleccionar:**
   - ✅ Imágenes y archivos en caché
   - ✅ Archivos y datos de sitios web
   - Rango de tiempo: **Última hora** (o "Todo el tiempo" si persiste)

3. **Borrar datos**

4. **Recargar la página:**
   - Presiona `Ctrl + Shift + R`

### Opción 3: Modo Incógnito (Para Testing Rápido)

1. **Abrir ventana de incógnito:**
   - Presiona `Ctrl + Shift + N`

2. **Navegar a:**
   - https://citard-fbc26.web.app

3. **Abrir consola:**
   - Presiona `F12`

4. **Verificar logs:**
   - Deberías ver los logs con prefijo `[MOUNT]`

## 🔍 LOGS ESPERADOS

Después del hard refresh, deberías ver en consola:

```
📱 StoriesService inicializado con persistencia en Firestore
📊 ANALYTICS Event: session_start
🔧 [ANALYTICS] Starting initialization...
...
🚀 [MOUNT] Iniciando carga inicial de perfiles para Discovery { userId: 'xxx' }
📡 [MOUNT] Llamando a getDiscoveryProfiles... { userId: 'xxx' }
🔍 getDiscoveryProfiles iniciado { currentUserId: 'xxx', profileLimit: 10 }
📊 Creando query de Firestore...
🔥 Ejecutando getDocs...
✅ getDocs completado { docsCount: X }
📄 Procesando perfil { id: 'xxx', name: 'Usuario 1' }
...
✅ Perfiles procesados { totalDocs: X, profilesAfterFilter: Y }
📞 Ejecutando callback con perfiles...
✅ [MOUNT] Callback de perfiles ejecutado { profileCount: Y }
✅ [MOUNT] setPotentialMatches ejecutado { count: Y }
```

## ❌ SI NO APARECEN LOS LOGS

Si después del hard refresh TODAVÍA no ves los logs con `[MOUNT]`:

### 1. Verificar que estás en la URL correcta:
```
https://citard-fbc26.web.app
```

### 2. Verificar el archivo JavaScript cargado:
- En DevTools, ve a la pestaña "Network" (Red)
- Recarga la página
- Busca el archivo `index-*.js` (debería ser `index-DKTYkH0m.js`)
- Verifica que el tamaño sea ~401 KB

### 3. Verificar el timestamp del deploy:
- En Firebase Console: https://console.firebase.google.com/project/citard-fbc26/hosting
- Debería mostrar el deploy más reciente (~9:10 PM, 17 Feb 2026)

### 4. Si nada funciona, hacer re-deploy:
```bash
cd cita-rd
npm run build
firebase deploy --only hosting
```

## 📊 DIFERENCIA ENTRE VERSIÓN ANTIGUA Y NUEVA

### Versión Antigua (Cacheada):
```
❌ NO aparecen logs de getDiscoveryProfiles
❌ Discovery muestra usuarios antiguos
❌ NO hay logs con prefijo [MOUNT] o [TRIGGER]
```

### Versión Nueva (Después del Hard Refresh):
```
✅ Aparecen logs con prefijo [MOUNT]
✅ Aparecen logs de getDiscoveryProfiles (🔍, 📊, 🔥, ✅)
✅ Discovery carga perfiles nuevos inmediatamente
✅ Los perfiles se recargan al navegar a Discovery
```

## 🎯 PRÓXIMOS PASOS

1. **Hacer hard refresh** usando una de las opciones arriba
2. **Abrir consola** (F12)
3. **Verificar logs** con prefijo `[MOUNT]`
4. **Navegar a Discovery** (si no abre automáticamente)
5. **Reportar resultados:**
   - ✅ Si ves los logs → El fix funcionó
   - ❌ Si NO ves los logs → Copiar TODOS los logs de consola y reportar

## 📅 METADATA

- **Fecha:** 17 de Febrero 2026
- **Hora:** ~9:15 PM
- **URL:** https://citard-fbc26.web.app
- **Build:** `index-DKTYkH0m.js` (~401 KB)
- **Archivo modificado:** `cita-rd/App.tsx`
