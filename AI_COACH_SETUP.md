# 🤖 AI Coach - Configuración y Uso

## 📋 Descripción

El AI Coach es una funcionalidad avanzada que utiliza Google Gemini AI para proporcionar:

- **Análisis de perfil**: Feedback personalizado sobre tu perfil de citas
- **Optimización de bio**: Sugerencias para mejorar tu descripción
- **Consejos de citas**: Tips personalizados basados en tu perfil
- **Icebreakers inteligentes**: Sugerencias de conversación en el chat

## 🔧 Configuración

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la API key generada

### 2. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto (si no existe)
2. Agrega tu API key:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Verificar Instalación

El paquete `@google/generative-ai` ya está instalado. Si necesitas reinstalarlo:

```bash
npm install @google/generative-ai
```

## 🚀 Funcionalidades

### 1. Análisis de Perfil
- Accede desde: **Perfil → AI Coach → Análisis de Perfil**
- Proporciona una puntuación del 1-10
- Sugerencias específicas para mejorar
- Consejos sobre fotos y descripción

### 2. Optimización de Bio
- Accede desde: **Perfil → AI Coach → Optimizar Bio**
- Genera 2-3 opciones de bio mejorada
- Basado en tus intereses y edad
- Mantiene autenticidad personal

### 3. Consejos de Citas
- Accede desde: **Perfil → AI Coach → Consejos**
- Tips personalizados para tu perfil
- Consejos sobre fotos, conversaciones y primeras citas
- Adaptado a tu edad e intereses

### 4. Icebreakers Inteligentes
- Accede desde: **Chat → Botón de AI (🧠)**
- Genera 3 icebreakers personalizados
- Basado en el perfil de la otra persona
- Se actualiza automáticamente

## 🎯 Navegación

### Accesos Directos:
- **Desde Home**: Botón AI Coach en el header (🧠)
- **Desde Perfil**: Botón "AI Coach" prominente
- **Desde Chat**: Botón AI en la barra de entrada

### Rutas:
- AI Coach principal: `/ai-coach`
- Perfil: `/ultra-profile`
- Chat con AI: `/ultra-chat/:chatId`

## 🔒 Privacidad y Seguridad

- Los datos se envían a Google Gemini AI para procesamiento
- No se almacenan conversaciones en servidores externos
- La API key se mantiene en el cliente (variables de entorno)
- Todos los prompts están optimizados para contexto de citas

## 🛠️ Desarrollo

### Archivos Principales:
- `src/services/geminiService.js` - Servicio principal de AI
- `src/pages/AICoach.jsx` - Página principal del coach
- `src/components/chat/AIIcebreakerSuggestions.jsx` - Sugerencias en chat

### Personalización:
- Modifica los prompts en `geminiService.js`
- Ajusta la UI en `AICoach.jsx`
- Personaliza sugerencias en `AIIcebreakerSuggestions.jsx`

## 🐛 Solución de Problemas

### Error: "API Key requerida"
- Verifica que `VITE_GEMINI_API_KEY` esté en `.env.local`
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "No se pudo analizar el perfil"
- Verifica tu conexión a internet
- Confirma que la API key sea válida
- Revisa la consola para errores específicos

### Sugerencias no aparecen
- Verifica que el perfil tenga datos (nombre, intereses)
- Confirma que la API key esté configurada
- Revisa la consola del navegador

## 📱 Experiencia de Usuario

- **Carga rápida**: Respuestas en 2-5 segundos
- **Fallbacks**: Sugerencias predeterminadas si falla la AI
- **Responsive**: Funciona en móvil y desktop
- **Accesible**: Iconos y textos claros

## 🔄 Actualizaciones Futuras

- [ ] Análisis de fotos con Gemini Vision
- [ ] Sugerencias de respuesta en tiempo real
- [ ] Coaching de conversación avanzado
- [ ] Integración con preferencias de usuario
- [ ] Métricas de éxito de sugerencias