# Instalar Google Cloud SDK en Windows

## Método 1: Instalador (Más Fácil)

1. **Descargar instalador**:
   - Ve a: https://cloud.google.com/sdk/docs/install#windows
   - Descarga: `GoogleCloudSDKInstaller.exe`

2. **Ejecutar instalador**:
   - Doble click en el archivo descargado
   - Sigue el asistente de instalación
   - Marca la opción: "Run 'gcloud init' when installation completes"

3. **Configurar**:
   - Se abrirá una ventana de terminal
   - Inicia sesión con tu cuenta de Google
   - Selecciona proyecto: `citard-fbc26`

4. **Verificar instalación**:
   ```cmd
   gcloud --version
   ```

## Método 2: PowerShell (Alternativo)

Si el instalador no funciona, usa PowerShell:

```powershell
# Descargar e instalar
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

## Después de Instalar

### 1. Autenticarte
```cmd
gcloud auth login
```
- Se abrirá tu navegador
- Inicia sesión con tu cuenta de Google

### 2. Configurar proyecto
```cmd
gcloud config set project citard-fbc26
```

### 3. Aplicar CORS
```cmd
cd cita-rd
gsutil cors set cors.json gs://citard-fbc26.firebasestorage.app
```

### 4. Verificar
```cmd
gsutil cors get gs://citard-fbc26.firebasestorage.app
```

## Tiempo Estimado
- Descarga: 2-3 minutos
- Instalación: 3-5 minutos
- Configuración: 2 minutos
- **Total: ~10 minutos**

## Si No Quieres Instalar

Usa la **Opción del Emulador** (ver `NEXT_STEPS.md`):
- No requiere instalación
- Funciona en 2 minutos
- Solo para desarrollo local
