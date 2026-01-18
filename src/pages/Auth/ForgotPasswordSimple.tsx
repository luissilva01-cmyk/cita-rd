// cita-rd/src/pages/Auth/ForgotPasswordSimple.tsx - Versión simplificada para testing
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordSimple() {
  const navigate = useNavigate();

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
          🔐 Recuperar Contraseña
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '30px'
        }}>
          ✅ ¡Navegación exitosa! La ruta /forgot-password funciona correctamente.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Correo Electrónico:
          </label>
          <input 
            type="email" 
            placeholder="ejemplo@email.com"
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
          onClick={() => alert('¡Funcionalidad de envío funcionando!')}
        >
          Enviar Enlace de Recuperación
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              color: '#ec4913',
              textDecoration: 'none',
              fontWeight: 'bold',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Volver al Login
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          color: '#155724'
        }}>
          <strong>✅ Test Exitoso:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>React Router funcionando</li>
            <li>Componente renderizando</li>
            <li>Navegación operativa</li>
            <li>Enlaces funcionando</li>
          </ul>
        </div>

        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          <strong>Información de Debug:</strong>
          <br />
          • Ruta actual: /forgot-password
          <br />
          • Componente: ForgotPasswordSimple
          <br />
          • Estado: Funcionando correctamente
        </div>
      </div>
    </div>
  );
}