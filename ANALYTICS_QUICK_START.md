# 🚀 Analytics - Quick Start

## ⚡ 3 Pasos para Activar Analytics

### 1️⃣ Crear Google Analytics (5 min)
1. Ve a https://analytics.google.com/
2. Crea propiedad "Ta' Pa' Ti"
3. Copia tu Measurement ID: `G-XXXXXXXXXX`

### 2️⃣ Configurar App (1 min)
```bash
# Edita cita-rd/.env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3️⃣ Deploy (2 min)
```bash
cd cita-rd
npm run build
firebase deploy --only hosting
```

## ✅ Verificar
1. Abre https://citard-fbc26.web.app
2. Ve a Google Analytics → Tiempo real
3. ¡Deberías ver tu visita!

## 📊 Dashboard de Desarrollo
En localhost, verás un botón flotante morado (📊) en la esquina inferior derecha.
Click para ver:
- Errores capturados
- Estadísticas en tiempo real
- Estado de Analytics

## 📚 Documentación Completa
Ver: `ANALYTICS_SETUP_GUIDE.md`

---

**¡Listo en 8 minutos! 🎉**
