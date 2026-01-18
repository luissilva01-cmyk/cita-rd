// cita-rd/src/pages/Legal/PrivacyPolicy.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Eye, Shield, Database, Users, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          
          .legal-content {
            line-height: 1.6;
          }
          
          .legal-content h2 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 700;
            color: #1b110d;
          }
          
          .legal-content h3 {
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: #1b110d;
          }
          
          .legal-content p {
            margin-bottom: 1rem;
            color: #4a4a4a;
          }
          
          .legal-content ul {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
          }
          
          .legal-content li {
            margin-bottom: 0.5rem;
            color: #4a4a4a;
          }
          
          .highlight-box {
            background-color: rgba(236, 73, 19, 0.05);
            border-left: 4px solid #ec4913;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0 8px 8px 0;
          }
          
          .privacy-section {
            background-color: rgba(59, 130, 246, 0.05);
            border-left: 4px solid #3b82f6;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0 8px 8px 0;
          }
        `}
      </style>
      
      <div 
        className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl"
        style={{ 
          backgroundColor: '#f8f6f6',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#1b110d',
          minHeight: 'max(884px, 100dvh)'
        }}
      >
        {/* Top Bar */}
        <div 
          className="flex items-center p-4 justify-between sticky top-0 z-10 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(248, 246, 246, 0.95)' }}
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            style={{ color: '#1b110d' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 
            className="text-lg font-bold leading-tight tracking-[-0.015em] text-center absolute left-1/2 -translate-x-1/2"
            style={{ color: '#1b110d' }}
          >
            Política de Privacidad
          </h2>
          <div className="size-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-8 overflow-y-auto">
          <div className="legal-content">
            {/* Header */}
            <div className="flex flex-col items-center pt-6 pb-6">
              <div 
                className="size-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}
              >
                <Lock size={32} />
              </div>
              <h1 
                className="tracking-tight text-[28px] font-extrabold leading-tight text-center mb-2"
                style={{ color: '#1b110d' }}
              >
                Política de Privacidad
              </h1>
              <p 
                className="text-sm font-medium leading-normal text-center"
                style={{ color: '#9a5f4c' }}
              >
                Última actualización: Enero 2026
              </p>
            </div>

            {/* Privacy Promise */}
            <div className="privacy-section">
              <div className="flex items-start gap-3">
                <Shield size={20} style={{ color: '#3b82f6', marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#3b82f6', marginTop: 0, marginBottom: '0.5rem' }}>
                    Nuestro Compromiso con tu Privacidad
                  </h3>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    En Ta' Pa' Ti, tu privacidad es fundamental. Nunca vendemos tus datos personales 
                    y solo los usamos para mejorar tu experiencia de citas.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Información que Recopilamos</h2>
            
            <h3>1.1 Información de Perfil</h3>
            <p>Cuando creas tu cuenta, recopilamos:</p>
            <ul>
              <li><strong>Datos básicos:</strong> Nombre, edad, correo electrónico</li>
              <li><strong>Fotos:</strong> Imágenes que subes a tu perfil</li>
              <li><strong>Biografía:</strong> Descripción personal y preferencias</li>
              <li><strong>Intereses:</strong> Hobbies, música, deportes, etc.</li>
            </ul>

            <h3>1.2 Datos de Ubicación</h3>
            <p>
              Usamos tu ubicación para mostrarte perfiles cercanos y mejorar las recomendaciones. 
              Puedes controlar esto en la configuración de tu dispositivo.
            </p>

            <h3>1.3 Actividad en la App</h3>
            <ul>
              <li>Perfiles que ves y con los que interactúas</li>
              <li>Mensajes enviados y recibidos</li>
              <li>Tiempo de uso y patrones de actividad</li>
              <li>Preferencias de matching y filtros</li>
            </ul>

            <h3>1.4 Información Técnica</h3>
            <ul>
              <li>Tipo de dispositivo y sistema operativo</li>
              <li>Dirección IP y datos de conexión</li>
              <li>Identificadores únicos del dispositivo</li>
              <li>Logs de errores y rendimiento</li>
            </ul>

            <h2>2. Cómo Usamos tu Información</h2>

            <h3>2.1 Matching y Recomendaciones</h3>
            <p>
              Nuestro sistema de matching puede utilizar modelos automatizados y herramientas de 
              inteligencia artificial para analizar tus preferencias, comportamiento y compatibilidad, 
              con el fin de sugerir perfiles que podrían interesarte.
            </p>

            <h3>2.2 Comunicación</h3>
            <p>
              Facilitamos mensajes, videollamadas y otras formas de comunicación entre usuarios 
              que han hecho match.
            </p>

            <h3>2.3 Seguridad y Moderación</h3>
            <ul>
              <li>Detectar comportamiento sospechoso o inapropiado</li>
              <li>Verificar la autenticidad de perfiles</li>
              <li>Investigar reportes de usuarios</li>
              <li>Prevenir fraudes y actividades ilegales</li>
            </ul>

            <h3>2.4 Mejoras del Servicio</h3>
            <p>
              Analizamos datos agregados y anónimos para mejorar la funcionalidad de la app 
              y desarrollar nuevas características.
            </p>

            <h2>3. Compartir Información</h2>

            <h3>3.1 Con Otros Usuarios</h3>
            <p>
              Tu perfil (fotos, nombre, edad, biografía) es visible para otros usuarios de Ta' Pa' Ti. 
              Tú controlas qué información incluir en tu perfil.
            </p>

            <h3>3.2 Proveedores de Servicios</h3>
            <p>Compartimos datos limitados con:</p>
            <ul>
              <li><strong>Firebase (Google):</strong> Autenticación y base de datos</li>
              <li><strong>Servicios de analytics:</strong> Para mejorar la app</li>
              <li><strong>Servicios de moderación:</strong> Para revisar contenido</li>
            </ul>

            <h3>3.3 Requerimientos Legales</h3>
            <p>
              Podemos compartir información si es requerido por ley, orden judicial, 
              o para proteger nuestros derechos y los de nuestros usuarios.
            </p>

            <div className="highlight-box">
              <div className="flex items-start gap-3">
                <Eye size={20} style={{ color: '#ec4913', marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#ec4913', marginTop: 0, marginBottom: '0.5rem' }}>
                    Nunca Vendemos tus Datos
                  </h3>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    Ta' Pa' Ti nunca vende, alquila o comercializa tu información personal 
                    a terceros con fines publicitarios o comerciales.
                  </p>
                </div>
              </div>
            </div>

            <h2>4. Seguridad de Datos</h2>

            <h3>4.1 Encriptación</h3>
            <p>
              Aplicamos medidas de seguridad técnicas y organizativas razonables, incluyendo 
              encriptación de datos en tránsito y en reposo cuando es posible, usando estándares 
              de la industria.
            </p>

            <h3>4.2 Acceso Limitado</h3>
            <p>
              Solo empleados autorizados tienen acceso a datos personales, y únicamente 
              cuando es necesario para proporcionar soporte o mejorar el servicio.
            </p>

            <h3>4.3 Monitoreo de Seguridad</h3>
            <p>
              Monitoreamos continuamente nuestros sistemas para detectar y prevenir 
              accesos no autorizados o brechas de seguridad.
            </p>

            <h2>5. Tus Derechos de Privacidad</h2>

            <h3>5.1 Acceso a tus Datos</h3>
            <p>
              Puedes solicitar una copia de todos los datos personales que tenemos sobre ti.
            </p>

            <h3>5.2 Corrección de Datos</h3>
            <p>
              Puedes actualizar o corregir tu información personal en cualquier momento 
              desde la configuración de tu perfil.
            </p>

            <h3>5.3 Eliminación de Datos</h3>
            <p>
              Puedes eliminar tu cuenta y todos tus datos asociados desde la configuración. 
              Algunos datos pueden conservarse por razones legales o de seguridad.
            </p>

            <h3>5.4 Portabilidad de Datos</h3>
            <p>
              Puedes solicitar exportar tus datos en un formato legible por máquina.
            </p>

            <h3>5.5 Objeción al Procesamiento</h3>
            <p>
              Puedes oponerte a ciertos usos de tus datos, aunque esto puede limitar 
              la funcionalidad de la app.
            </p>

            <h2>6. Retención de Datos</h2>

            <h3>6.1 Cuentas Activas</h3>
            <p>
              Mantenemos tus datos mientras tu cuenta esté activa y sea necesario 
              para proporcionar nuestros servicios.
            </p>

            <h3>6.2 Cuentas Eliminadas</h3>
            <p>
              Después de eliminar tu cuenta, conservamos algunos datos por 30 días 
              para permitir la recuperación de la cuenta si cambias de opinión.
            </p>

            <h3>6.3 Datos de Seguridad</h3>
            <p>
              Algunos datos relacionados con seguridad y moderación pueden conservarse 
              hasta 2 años para investigaciones y prevención de fraudes.
            </p>

            <h2>7. Menores de Edad</h2>
            <p>
              Ta' Pa' Ti es exclusivamente para adultos mayores de 18 años. No recopilamos 
              intencionalmente información de menores de edad.
            </p>

            <h2>8. Transferencias Internacionales</h2>
            <p>
              Tus datos pueden procesarse en servidores ubicados fuera de República Dominicana, 
              incluyendo Estados Unidos y otros países donde operan nuestros proveedores de servicios.
            </p>

            <h2>9. Cookies y Tecnologías Similares</h2>
            <p>
              Usamos cookies y tecnologías similares para mejorar tu experiencia, 
              recordar preferencias y analizar el uso de la app.
            </p>

            <h2>10. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te notificaremos sobre 
              cambios significativos a través de la app o por correo electrónico.
            </p>

            <h2>11. Contacto sobre Privacidad</h2>
            <p>
              Si tienes preguntas sobre esta política o quieres ejercer tus derechos de privacidad:
            </p>
            <ul>
              <li>Email: tapapatisoporte@gmail.com</li>
              <li>Dirección: Santo Domingo, República Dominicana</li>
            </ul>

            <div className="privacy-section">
              <div className="flex items-start gap-3">
                <Database size={20} style={{ color: '#3b82f6', marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#3b82f6', marginTop: 0, marginBottom: '0.5rem' }}>
                    Control Total sobre tus Datos
                  </h3>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    Recuerda que siempre tienes control sobre tu información. Puedes actualizar, 
                    exportar o eliminar tus datos en cualquier momento desde la configuración de tu cuenta.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm" style={{ color: '#9a5f4c' }}>
                © 2026 Ta' Pa' Ti. Comprometidos con tu privacidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}