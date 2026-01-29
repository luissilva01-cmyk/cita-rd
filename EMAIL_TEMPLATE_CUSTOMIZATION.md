# Personalización de Emails de Firebase - Ta' Pa' Ti

**Fecha:** 28 de enero de 2026  
**Problema:** Email de recuperación dice "Reset your password for citard-fbc26"  
**Solución:** Personalizar templates de email en Firebase Console

---

## 🎯 Objetivo

Cambiar los emails de Firebase para que digan "Ta' Pa' Ti" en lugar de "citard-fbc26"

---

## 📧 Emails a Personalizar

1. **Password Reset** - Recuperación de contraseña
2. **Email Verification** - Verificación de email
3. **Email Change** - Cambio de email

---

## 🔧 Cómo Personalizar en Firebase Console

### Paso 1: Acceder a Firebase Console

1. Ir a: https://console.firebase.google.com/
2. Seleccionar proyecto: **citard-fbc26**
3. En el menú lateral, ir a **Authentication**
4. Click en la pestaña **Templates**

### Paso 2: Personalizar Template de Password Reset

1. En la lista de templates, seleccionar **Password reset**
2. Click en el ícono de lápiz (editar)
3. Cambiar los siguientes campos:

**Sender name (Nombre del remitente):**
```
Ta' Pa' Ti
```

**Sender email (Email del remitente):**
```
noreply@citard-fbc26.firebaseapp.com
```
(Este no se puede cambiar sin dominio personalizado)

**Subject (Asunto):**
```
Recupera tu contraseña de Ta' Pa' Ti
```

**Email body (Cuerpo del email):**
```html
<p>Hola,</p>

<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de <strong>Ta' Pa' Ti</strong>.</p>

<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>

<p><a href="%LINK%">Restablecer contraseña</a></p>

<p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>

<p>Este enlace expirará en 1 hora.</p>

<p>Saludos,<br>
El equipo de Ta' Pa' Ti</p>

<p style="font-size: 12px; color: #666;">
Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:<br>
%LINK%
</p>
```

4. Click en **Save** (Guardar)

### Paso 3: Personalizar Template de Email Verification

1. Seleccionar **Email address verification**
2. Click en editar
3. Cambiar:

**Subject:**
```
Verifica tu email en Ta' Pa' Ti
```

**Email body:**
```html
<p>Hola,</p>

<p>Gracias por registrarte en <strong>Ta' Pa' Ti</strong>!</p>

<p>Para completar tu registro, verifica tu dirección de correo haciendo clic en el siguiente enlace:</p>

<p><a href="%LINK%">Verificar email</a></p>

<p>Si no creaste una cuenta en Ta' Pa' Ti, puedes ignorar este correo.</p>

<p>Saludos,<br>
El equipo de Ta' Pa' Ti</p>

<p style="font-size: 12px; color: #666;">
Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:<br>
%LINK%
</p>
```

4. Click en **Save**

### Paso 4: Personalizar Template de Email Change

1. Seleccionar **Email address change**
2. Click en editar
3. Cambiar:

**Subject:**
```
Confirma el cambio de email en Ta' Pa' Ti
```

**Email body:**
```html
<p>Hola,</p>

<p>Recibimos una solicitud para cambiar el email de tu cuenta de <strong>Ta' Pa' Ti</strong>.</p>

<p>Para confirmar este cambio, haz clic en el siguiente enlace:</p>

<p><a href="%LINK%">Confirmar cambio de email</a></p>

<p>Si no solicitaste este cambio, contacta inmediatamente a nuestro equipo de soporte.</p>

<p>Saludos,<br>
El equipo de Ta' Pa' Ti</p>

<p style="font-size: 12px; color: #666;">
Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:<br>
%LINK%
</p>
```

4. Click en **Save**

---

## 🎨 Personalización Avanzada (Opcional)

### Agregar Logo y Colores

Para agregar el logo de Ta' Pa' Ti y colores de marca, necesitas HTML más avanzado:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <!-- Header con logo -->
  <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">Ta' Pa' Ti</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Tu app de citas en República Dominicana</p>
  </div>
  
  <!-- Contenido -->
  <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #1f2937; margin-top: 0;">Recupera tu contraseña</h2>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Hola,
    </p>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta de <strong>Ta' Pa' Ti</strong>.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="%LINK%" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
        Restablecer contraseña
      </a>
    </div>
    
    <p style="color: #4b5563; line-height: 1.6;">
      Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
    </p>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Este enlace expirará en 1 hora.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
      Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
      <span style="color: #8b5cf6; word-break: break-all;">%LINK%</span>
    </p>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© 2026 Ta' Pa' Ti. Todos los derechos reservados.</p>
    <p>
      <a href="mailto:tapapatisoporte@gmail.com" style="color: #8b5cf6; text-decoration: none;">Soporte</a> • 
      <a href="https://tapapati.com/privacy" style="color: #8b5cf6; text-decoration: none;">Privacidad</a> • 
      <a href="https://tapapati.com/terms" style="color: #8b5cf6; text-decoration: none;">Términos</a>
    </p>
  </div>
</div>
```

---

## 🌐 Dominio Personalizado (Futuro)

Para tener emails como `noreply@tapapati.com` en lugar de `noreply@citard-fbc26.firebaseapp.com`:

### Requisitos:
1. Tener un dominio propio (tapapati.com)
2. Configurar DNS records
3. Verificar dominio en Firebase

### Pasos:
1. En Firebase Console → Authentication → Templates
2. Click en **Customize domain**
3. Seguir instrucciones para agregar DNS records
4. Esperar verificación (24-48 horas)

---

## 📱 Testing

### Probar Email de Recuperación:

1. Ir a http://localhost:3000/
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresar un email de prueba
4. Revisar inbox
5. Verificar que el email diga "Ta' Pa' Ti"

### Probar Email de Verificación:

1. Registrar un nuevo usuario
2. Revisar inbox
3. Verificar que el email diga "Ta' Pa' Ti"

---

## ✅ Checklist

- [ ] Acceder a Firebase Console
- [ ] Ir a Authentication → Templates
- [ ] Personalizar Password Reset template
- [ ] Personalizar Email Verification template
- [ ] Personalizar Email Change template
- [ ] Guardar todos los cambios
- [ ] Probar con email real
- [ ] Verificar que dice "Ta' Pa' Ti"

---

## 📝 Notas

- Los cambios en templates son inmediatos
- No requiere redeploy de la app
- Los emails antiguos ya enviados no se actualizan
- El dominio `citard-fbc26.firebaseapp.com` solo se puede cambiar con dominio personalizado

---

## 🔗 Enlaces Útiles

- Firebase Console: https://console.firebase.google.com/
- Documentación de Email Templates: https://firebase.google.com/docs/auth/custom-email-handler
- Soporte: tapapatisoporte@gmail.com

---

**Creado:** 28 de enero de 2026  
**Última actualización:** 28 de enero de 2026
