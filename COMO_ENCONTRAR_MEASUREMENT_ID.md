# 🎯 Cómo Encontrar el Measurement ID Correcto

## El Problema

Encontraste el **Property ID** (524271886), pero necesitas el **Measurement ID** (formato: G-XXXXXXXXXX).

Son dos cosas diferentes:
- **Property ID:** 524271886 ❌ (No es lo que necesitas)
- **Measurement ID:** G-XXXXXXXXXX ✅ (Esto es lo que necesitas)

---

## Cómo Encontrar el Measurement ID

### Paso 1: Ve a Data Streams

1. Abre Google Analytics Console: https://analytics.google.com/
2. Asegúrate de estar en la propiedad "Ta' Pa' Ti Web" (ID: 524271886)
3. En el menú lateral izquierdo, haz clic en **"Admin"** (ícono de engranaje)
4. En la columna del medio (Propiedad), busca y haz clic en **"Data Streams"**

### Paso 2: Selecciona tu Web Stream

1. Verás una lista de streams (probablemente solo uno)
2. Haz clic en el stream de tipo **"Web"**
3. El nombre probablemente es algo como "Ta' Pa' Ti Web" o similar

### Paso 3: Copia el Measurement ID

1. En la parte superior de la página verás:
   ```
   MEASUREMENT ID
   G-XXXXXXXXXX
   ```
2. **Copia ese ID completo** (debe empezar con "G-")

---

## Ruta Visual

```
Google Analytics Console
    ↓
Admin (menú lateral izquierdo, abajo)
    ↓
Data Streams (columna del medio - "Propiedad")
    ↓
Haz clic en tu Web Stream
    ↓
Copia el "MEASUREMENT ID" (G-XXXXXXXXXX)
```

---

## Qué Hacer Después

### Si el Measurement ID es G-3J77FEQ9PN

✅ **Tu código ya está correcto.** Solo necesitas esperar 24-48 horas para ver datos.

### Si el Measurement ID es DIFERENTE

Necesitas actualizar tu código:

1. **Actualiza `.env.local`:**
   ```bash
   cd cita-rd
   # Edita .env.local y cambia esta línea:
   VITE_GA_MEASUREMENT_ID=G-TU-NUEVO-ID-AQUI
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Redeploy:**
   ```bash
   firebase deploy --only hosting
   ```

4. **Espera 5 minutos** y prueba nuevamente

---

## Captura de Pantalla de Referencia

Cuando estés en la página del Data Stream, verás algo así:

```
┌─────────────────────────────────────────────────┐
│  Web stream details                             │
│                                                 │
│  MEASUREMENT ID                                 │
│  G-XXXXXXXXXX          [📋 Copy]               │
│                                                 │
│  STREAM NAME                                    │
│  Ta' Pa' Ti Web                                 │
│                                                 │
│  STREAM URL                                     │
│  https://citard-fbc26.web.app                  │
│                                                 │
│  STREAM ID                                      │
│  1234567890                                     │
└─────────────────────────────────────────────────┘
```

**El que necesitas es el de arriba: MEASUREMENT ID (G-XXXXXXXXXX)**

---

## Troubleshooting

### "No veo Data Streams en el menú"

Asegúrate de estar en la columna correcta:
- Columna izquierda: Cuenta
- **Columna del medio: Propiedad** ← Aquí debe estar "Data Streams"
- Columna derecha: Vista

### "No tengo ningún Web Stream"

Necesitas crear uno:
1. En Data Streams, haz clic en "Add stream"
2. Selecciona "Web"
3. URL del sitio web: `https://citard-fbc26.web.app`
4. Nombre del stream: "Ta' Pa' Ti Web"
5. Haz clic en "Create stream"
6. Copia el Measurement ID que se genera

### "Tengo múltiples streams"

Busca el que tenga la URL: `https://citard-fbc26.web.app`

---

## Próximos Pasos

1. **Ahora:** Encuentra el Measurement ID en Data Streams
2. **Compártelo aquí** para verificar si coincide con el código
3. **Si no coincide:** Actualizamos el código y redeployamos
4. **Si coincide:** Solo necesitas esperar 24-48 horas

---

**Fecha:** 16 de Febrero 2026  
**Property ID:** 524271886  
**Measurement ID actual en código:** G-3J77FEQ9PN  
**Acción:** Verificar Measurement ID en Data Streams

