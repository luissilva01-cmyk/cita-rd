# 🚀 Guía de Despliegue - CitaRD

## Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Firebase
- Cuenta de Cloudinary (para imágenes)
- Firebase CLI instalado: `npm install -g firebase-tools`

## 1. Configuración de Firebase

### 1.1 Crear Proyecto
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Google Analytics (opcional)

### 1.2 Configurar Authentication
1. En Firebase Console, ve a **Authentication**
2. Habilita el método **Email/Password**
3. (Opcional) Configura plantillas de email personalizadas

### 1.3 Configurar Firestore
1. Ve a **Firestore Database**
2. Crea una base de datos en modo **producción**
3. Selecciona la ubicación más cercana a tus usuarios

### 1.4 Desplegar Reglas e Índices
```bash
# Iniciar sesión en Firebase
firebase login

# Inicializar proyecto (si no está inicializado)
firebase init

# Seleccionar:
# - Firestore
# - Hosting

# Desplegar reglas e índices
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 1.5 Obtener Credenciales
1. Ve a **Project Settings** (⚙️)
2. En la sección **Your apps**, crea una app web
3. Copia las credenciales de configuración

## 2. Configuración de Cloudinary

### 2.1 Crear Cuenta
1. Regístrate en [Cloudinary](https://cloudinary.com/)
2. Ve al Dashboard

### 2.2 Crear Upload Preset
1. Ve a **Settings** > **Upload**
2. Scroll hasta **Upload presets**
3. Click en **Add upload preset**
4. Configura:
   - **Preset name**: `citard_uploads` (o el que prefieras)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `citard` (opcional)
5. Guarda el preset

### 2.3 Obtener Credenciales
- **Cloud Name**: En el Dashboard
- **Upload Preset**: El nombre que creaste

## 3. Configuración de Variables de Entorno

### 3.1 Desarrollo Local
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus credenciales
```

### 3.2 Contenido de .env.local
```env
# Firebase
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=citard_uploads
```

## 4. Despliegue en Firebase Hosting

### 4.1 Preparar Build
```bash
# Instalar dependencias
npm install

# Crear build de producción
npm run build
```

### 4.2 Configurar firebase.json
Asegúrate de que `firebase.json` tenga:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4.3 Desplegar
```bash
# Desplegar a Firebase Hosting
firebase deploy --only hosting

# O desplegar todo (hosting + firestore)
firebase deploy
```

## 5. Despliegue en Vercel (Alternativa)

### 5.1 Instalar Vercel CLI
```bash
npm install -g vercel
```

### 5.2 Configurar Variables de Entorno
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings > Environment Variables
3. Agrega todas las variables de `.env.local`

### 5.3 Desplegar
```bash
# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

## 6. Despliegue en Netlify (Alternativa)

### 6.1 Configurar netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 6.2 Desplegar
1. Conecta tu repositorio en [Netlify](https://app.netlify.com/)
2. Configura las variables de entorno
3. Despliega automáticamente

## 7. Post-Despliegue

### 7.1 Verificar Funcionalidad
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Subida de imágenes funciona
- [ ] Chat en tiempo real funciona
- [ ] Likes y matches funcionan
- [ ] Filtros funcionan correctamente

### 7.2 Configurar Dominio Personalizado
#### Firebase Hosting
```bash
firebase hosting:channel:deploy production
```

#### Vercel/Netlify
1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### 7.3 Monitoreo
- Configura Firebase Analytics
- Revisa logs en Firebase Console
- Monitorea errores en la consola del navegador

## 8. Mantenimiento

### 8.1 Actualizar Reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

### 8.2 Actualizar Índices
```bash
firebase deploy --only firestore:indexes
```

### 8.3 Actualizar Aplicación
```bash
# Pull últimos cambios
git pull origin main

# Instalar dependencias
npm install

# Build
npm run build

# Desplegar
firebase deploy --only hosting
# o
vercel --prod
```

## 9. Troubleshooting

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

### Error: "Cloudinary upload failed"
- Verifica que el upload preset sea "unsigned"
- Verifica las credenciales en .env

### Error: "Firebase configuration missing"
- Verifica que todas las variables de entorno estén configuradas
- Reinicia el servidor de desarrollo

### Chat no funciona en tiempo real
- Verifica que los índices de Firestore estén desplegados
- Revisa la consola de Firebase para errores

## 10. Seguridad

### 10.1 Checklist de Seguridad
- [ ] Variables de entorno no están en el código
- [ ] Reglas de Firestore están en modo producción
- [ ] CORS configurado correctamente en Cloudinary
- [ ] HTTPS habilitado (automático en Firebase/Vercel/Netlify)
- [ ] Rate limiting configurado (Firebase tiene límites por defecto)

### 10.2 Backups
```bash
# Exportar datos de Firestore
gcloud firestore export gs://[BUCKET_NAME]
```

---

## 📞 Soporte

Si encuentras problemas durante el despliegue:
1. Revisa los logs de Firebase Console
2. Verifica la consola del navegador
3. Consulta la documentación oficial de Firebase
4. Abre un issue en el repositorio
