
// Frontend-safe mock implementation of Gemini service.
// In production, replace with server-side implementation that calls @google/genai.

export async function getAIProfileFeedback(bio, interests) {
  await new Promise((r) => setTimeout(r, 500));
  return {
    feedback: 'Buen inicio — añade más detalles sobre pasatiempos concretos y una línea divertida.',
    improvedBio: `${bio || ''} Me encanta salir a la playa y disfrutar de buena música; busco alguien con quien compartir aventuras.`,
    icebreakers: [
      '¿Cuál fue tu playa favorita en RD y por qué?',
      'Si hiciéramos una playlist juntos, ¿qué canción no puede faltar?',
      '¿Te gusta más una tarde de playa o una noche de merengue?'
    ]
  };
}

export async function getIcebreakerSuggestions(name, interests = []) {
  await new Promise((r) => setTimeout(r, 300));
  return [
    `Hola ${name}, ¿qué actividad nueva te gustaría probar este mes?`,
    `${name}, ¿qué lugar de RD recomiendas para una escapada de fin de semana?`,
    'Si tuvieras que elegir: playa tranquila o playa con música y baile?'
  ];
}