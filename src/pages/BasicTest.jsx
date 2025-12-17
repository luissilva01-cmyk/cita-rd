import React from 'react';

export default function BasicTest() {
  console.log('BasicTest component rendering');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Prueba Básica
        </h1>
        
        <p className="text-gray-600 mb-8">
          Si ves esto, React está funcionando correctamente
        </p>

        <div className="space-y-4">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            ✅ React está funcionando
          </div>
          
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
            ℹ️ Error Boundary está activo
          </div>
          
          <button
            onClick={() => {
              console.log('Button clicked');
              alert('¡Funciona!');
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Probar Interacción
          </button>

          <button
            onClick={() => {
              throw new Error('Error de prueba para el boundary');
            }}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            Probar Error Boundary
          </button>
        </div>
      </div>
    </div>
  );
}