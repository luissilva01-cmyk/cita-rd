# 🔊 Sonidos de CitaRD

Esta carpeta contiene los archivos de audio para las interacciones de la app.

## Archivos necesarios:

- `match.mp3` - Sonido de celebración cuando hay match
- `like.mp3` - Sonido sutil cuando das like
- `pass.mp3` - Sonido sutil cuando pasas un perfil
- `superlike.mp3` - Sonido especial para super likes

## Recomendaciones:

- **Duración**: 0.5-2 segundos máximo
- **Formato**: MP3 o WAV
- **Volumen**: Moderado, no muy alto
- **Tono**: Positivo y agradable

## Fuentes sugeridas:

- Freesound.org
- Zapsplat.com
- Adobe Audition (crear propios)
- Logic Pro / GarageBand

## Implementación:

Los sonidos se cargan automáticamente con los hooks `useMatchAnimation` y `useSoundEffects`.