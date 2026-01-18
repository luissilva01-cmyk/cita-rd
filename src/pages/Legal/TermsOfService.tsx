// cita-rd/src/pages/Legal/TermsOfService.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Users, Heart, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
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
            Términos de Servicio
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
                style={{ backgroundColor: 'rgba(236, 73, 19, 0.1)', color: '#ec4913' }}
              >
                <Shield size={32} />
              </div>
              <h1 
                className="tracking-tight text-[28px] font-extrabold leading-tight text-center mb-2"
                style={{ color: '#1b110d' }}
              >
                Términos de Servicio
              </h1>
              <p 
                className="text-sm font-medium leading-normal text-center"
                style={{ color: '#9a5f4c' }}
              >
                Última actualización: Enero 2026
              </p>
            </div>

            {/* Important Notice */}
            <div className="highlight-box">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} style={{ color: '#FF6B6B', marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#FF6B6B', marginTop: 0, marginBottom: '0.5rem' }}>
                    Importante: Debes ser mayor de 18 años
                  </h3>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    Ta' Pa' Ti es exclusivamente para adultos. Al usar nuestra aplicación, confirmas que tienes al menos 18 años de edad.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y usar Ta' Pa' Ti, aceptas estar legalmente obligado por estos Términos de Servicio. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra aplicación.
            </p>

            <h2>2. Estado del Servicio (Versión Beta)</h2>
            <p>
              Ta' Pa' Ti se encuentra actualmente en una versión de desarrollo o beta. Esto significa que:
            </p>
            <ul>
              <li>Algunas funciones pueden cambiar, fallar o no estar disponibles temporalmente</li>
              <li>La experiencia puede no ser completamente estable</li>
              <li>Pueden ocurrir interrupciones del servicio sin previo aviso</li>
              <li>Los datos podrían ser modificados o reiniciados durante actualizaciones</li>
            </ul>
            <p>
              Al usar la aplicación durante esta fase beta, aceptas participar en esta etapa de prueba 
              y comprendes que el servicio está en desarrollo activo.
            </p>

            <h2>3. Descripción del Servicio</h2>
            <p>
              Ta' Pa' Ti es una plataforma de citas en línea que permite a usuarios adultos:
            </p>
            <ul>
              <li>Crear perfiles personales con fotos y información</li>
              <li>Descubrir y conectar con otros usuarios</li>
              <li>Intercambiar mensajes con matches</li>
              <li>Compartir historias temporales (Stories)</li>
              <li>Participar en videollamadas y mensajes de voz</li>
            </ul>

            <h2>4. Elegibilidad y Registro</h2>
            <h3>4.1 Requisitos de Edad</h3>
            <p>
              Debes tener al menos 18 años para usar Ta' Pa' Ti. Nos reservamos el derecho de solicitar 
              verificación de edad en cualquier momento.
            </p>
            
            <h3>4.2 Información Veraz</h3>
            <p>
              Te comprometes a proporcionar información precisa, actual y completa durante el registro 
              y a mantenerla actualizada.
            </p>
            
            <h3>4.3 Una Cuenta por Persona</h3>
            <p>
              Solo puedes tener una cuenta activa. Las cuentas múltiples o falsas serán eliminadas.
            </p>

            <h2>5. Contenido y Comportamiento</h2>
            <h3>5.1 Fotos de Perfil</h3>
            <p>Las fotos deben:</p>
            <ul>
              <li>Mostrar claramente tu rostro</li>
              <li>Ser apropiadas y no contener desnudez</li>
              <li>Ser tuyas y actuales</li>
              <li>No incluir menores de edad</li>
            </ul>

            <h3>5.2 Comportamiento Prohibido</h3>
            <p>Está estrictamente prohibido:</p>
            <ul>
              <li>Acosar, intimidar o amenazar a otros usuarios</li>
              <li>Enviar contenido sexual no solicitado</li>
              <li>Discriminar por raza, religión, orientación sexual, etc.</li>
              <li>Solicitar dinero o realizar actividades comerciales</li>
              <li>Compartir información personal de terceros</li>
              <li>Usar la plataforma para actividades ilegales</li>
            </ul>

            <h2>6. Sistema de Matching</h2>
            <p>
              Nuestro sistema de matching puede utilizar modelos automatizados y herramientas de 
              inteligencia artificial para sugerir perfiles compatibles basándose en preferencias, 
              ubicación y comportamiento en la app. No garantizamos resultados románticos específicos 
              ni matches particulares.
            </p>

            <h2>7. Privacidad y Datos</h2>
            <p>
              El manejo de tus datos personales se rige por nuestra 
              <button 
                onClick={() => navigate('/privacy-policy')}
                className="text-orange-600 underline hover:text-orange-700 bg-transparent border-none cursor-pointer p-0"
              >
                Política de Privacidad
              </button>
              , que forma parte integral de estos términos.
            </p>

            <h2>8. Seguridad Personal</h2>
            <div className="highlight-box">
              <div className="flex items-start gap-3">
                <Heart size={20} style={{ color: '#ec4913', marginTop: '2px' }} />
                <div>
                  <h3 style={{ color: '#ec4913', marginTop: 0, marginBottom: '0.5rem' }}>
                    Tu Seguridad es Prioritaria
                  </h3>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    Siempre informa a alguien de confianza sobre tus citas. Reúnete en lugares públicos 
                    y confía en tu instinto.
                  </p>
                </div>
              </div>
            </div>
            
            <p>
              Ta' Pa' Ti no se hace responsable por encuentros en persona entre usuarios. Eres responsable 
              de tu propia seguridad al interactuar con otros usuarios fuera de la plataforma.
            </p>

            <h2>9. Reportes y Moderación</h2>
            <p>
              Puedes reportar comportamiento inapropiado usando las herramientas de reporte en la app. 
              Investigamos todos los reportes y tomamos medidas apropiadas, incluyendo advertencias, 
              suspensiones o baneos permanentes.
            </p>

            <h2>10. Propiedad Intelectual</h2>
            <p>
              Ta' Pa' Ti y todo su contenido (diseño, código, logos, textos) son propiedad de Ta' Pa' Ti o 
              sus licenciantes. No puedes copiar, modificar o distribuir nuestro contenido sin autorización.
            </p>

            <h2>11. Limitación de Responsabilidad</h2>
            <p>
              Ta' Pa' Ti se proporciona "tal como está". No garantizamos que el servicio sea ininterrumpido 
              o libre de errores. No somos responsables por:
            </p>
            <ul>
              <li>Daños directos o indirectos por el uso de la app</li>
              <li>Pérdida de datos o información</li>
              <li>Comportamiento de otros usuarios</li>
              <li>Encuentros o relaciones fuera de la plataforma</li>
            </ul>

            <h2>12. Terminación</h2>
            <p>
              Puedes eliminar tu cuenta en cualquier momento desde la configuración. Nos reservamos 
              el derecho de suspender o terminar cuentas que violen estos términos.
            </p>

            <h2>13. Cambios a los Términos</h2>
            <p>
              Podemos actualizar estos términos ocasionalmente. Te notificaremos sobre cambios 
              significativos a través de la app o por correo electrónico.
            </p>

            <h2>14. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa 
              se resolverá en los tribunales competentes de Santo Domingo.
            </p>

            <h2>15. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos términos, contáctanos en:
            </p>
            <ul>
              <li>Email: tapapatisoporte@gmail.com</li>
              <li>Dirección: Santo Domingo, República Dominicana</li>
            </ul>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm" style={{ color: '#9a5f4c' }}>
                © 2026 Ta' Pa' Ti. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}