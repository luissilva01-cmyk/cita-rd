# 🚀 Setup Rápido - Cloud Functions

Sigue estos comandos en orden:

## 1️⃣ Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

## 2️⃣ Iniciar sesión
```bash
firebase login
```

## 3️⃣ Instalar dependencias
```bash
cd cita-rd/functions
npm install
cd ..
```

## 4️⃣ Configurar ImageKit
```bash
firebase functions:config:set imagekit.public_key="public_7UvlcweOdXIY9MmkbNWvPHW/aw0="

firebase functions:config:set imagekit.private_key="private_QQPSCxQq54yEBrjQf8JLkQhLELc="

firebase functions:config:set imagekit.url_endpoint="https://ik.imagekit.io/tapapati"
```

## 5️⃣ Verificar configuración
```bash
firebase functions:config:get
```

## 6️⃣ Desplegar functions
```bash
firebase deploy --only functions
```

## 7️⃣ Reiniciar servidor
```bash
npm run dev
```

## ✅ ¡Listo!

Ahora las fotos se eliminarán físicamente de ImageKit de forma segura.

**Ver documentación completa:** `CLOUD_FUNCTIONS_SETUP.md`
