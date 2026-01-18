// cita-rd/src/pages/Auth/ForgotPasswordTest.tsx - Componente de prueba simple
import React from "react";

export default function ForgotPasswordTest() {
  console.log('🔐 ForgotPasswordTest renderizando...');

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f6f6',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#ec4913', 
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          🔐 Test: Forgot Password
        </h1>
        
        <div style={{
          padding: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          <strong>✅ ¡ÉXITO!</strong>
          <p>Si ves este mensaje, significa que:</p>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>El routing funciona correctamente</li>
            <li>El componente se renderiza sin errores</li>
            <li>La navegación a /forgot-password está operativa</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email de prueba:
          </label>
          <input 
            type="email" 
            placeholder="test@example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        <button
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ec4913',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
          onClick={() => alert('¡Botón de test funcionando!')}
        >
          Test: Enviar Enlace
        </button>

        <div style={{ textAlign: 'center' }}>
          <a
            href="/login"
            style={{
              color: '#ec4913',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            ← Volver al Login
          </a>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          <strong>Debug Info:</strong>
          <br />
          • Componente: ForgotPasswordTest
          <br />
          • Ruta: /forgot-password
          <br />
          • Estado: Funcionando ✅
        </div>
      </div>
    </div>
  );
}