// src/components/chat/AIIcebreakerSuggestions.jsx
import { useState, useEffect, useCallback } from 'react';
import { getIcebreakerSuggestions } from '../../services/geminiService';

export default function AIIcebreakerSuggestions({ 
  targetProfile, 
  userProfile, 
  onSelectIcebreaker, 
  isVisible = false 
}) {
  const [icebreakers, setIcebreakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateIcebreakers = useCallback(async () => {
    if (!targetProfile || !userProfile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const suggestions = await getIcebreakerSuggestions(
        targetProfile.nombre || 'Usuario',
        targetProfile.intereses || [],
        targetProfile.descripcion || ''
      );
      setIcebreakers(suggestions);
    } catch (err) {
      console.error('Error generating icebreakers:', err);
      setError('No se pudieron generar sugerencias');
      // Fallback icebreakers
      setIcebreakers([
        `Hola ${targetProfile.nombre}! Me encantó ver que también te gusta ${targetProfile.intereses?.[0] || 'la música'}`,
        `¿Qué tal ${targetProfile.nombre}? Tu perfil me llamó mucho la atención`,
        `Hola! Vi que eres de ${targetProfile.ciudad || 'la ciudad'}, ¿conoces algún lugar genial por ahí?`
      ]);
    } finally {
      setLoading(false);
    }
  }, [targetProfile, userProfile]);

  useEffect(() => {
    if (isVisible && targetProfile && userProfile && icebreakers.length === 0) {
      generateIcebreakers();
    }
  }, [isVisible, targetProfile, userProfile, icebreakers.length, generateIcebreakers]);

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-sm">psychology</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Sugerencias de AI Coach
        </h3>
        <button
          onClick={generateIcebreakers}
          disabled={loading}
          className="ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Generar nuevas sugerencias"
        >
          <span className={`material-symbols-outlined text-sm text-gray-500 ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Generando sugerencias...
          </span>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      {!loading && icebreakers.length > 0 && (
        <div className="space-y-2">
          {icebreakers.map((icebreaker, index) => (
            <button
              key={index}
              onClick={() => onSelectIcebreaker(icebreaker)}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-pink-500 text-sm mt-0.5">auto_fix_high</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {icebreaker}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Sugerencias generadas por IA • Personalízalas a tu estilo
      </div>
    </div>
  );
}