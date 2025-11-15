# Documentación de referencia para el curso

Este directorio agrupa las guías que acompañan a la API base. Cada documento se enfoca en un tema concreto para que puedas estudiar o reutilizarlo en tu propio proyecto sin leer todo el código fuente.

## Cómo usar estas guías

1. Comienza siempre por el README general en la raíz del repo para entender el contexto.
2. Usa esta página como mapa: cada enlace te lleva a una guía corta y accionable.
3. Reproduce los ejemplos en tu entorno local (`npm run start:dev`) y modifícalos con tus propias ideas.
4. Si detectas mejoras, documenta tus hallazgos en este mismo directorio para compartirlos con el grupo.

## Índice rápido

| Tema | Archivo | ¿Qué resuelve? |
|------|---------|----------------|
| Autenticación JWT | [AUTH_README.md](AUTH_README.md) | Cómo se construyó el módulo de auth, variables de entorno y flujo de Postman |
| Reservas (Bookings) | [BOOKING_README.md](BOOKING_README.md) | Entidad, endpoints protegidos y tips para extenderlos |
| DTOs + validación | [DTO_VALIDATION.md](DTO_VALIDATION.md) | Cómo convivir con `multipart/form-data` y class-validator |
| Subida de imágenes | [IMAGE_UPLOAD.md](IMAGE_UPLOAD.md) | Configuración de Multer y ejemplos de consumo |
| Lifecycle hooks | [LIFECYCLE_HOOKS.md](LIFECYCLE_HOOKS.md) | Normalización de datos antes de guardar |
| ESLint vs Multer | [ESLINT_MULTER_CONFIG.md](ESLINT_MULTER_CONFIG.md) | Por qué se ignora una regla específica y qué alternativa usar |
| Debug del login | [DEBUG_LOGIN.md](DEBUG_LOGIN.md) | Checklist cuando no llega el token JWT |
| Testing | [TEST_README.md](TEST_README.md) | Qué pruebas existen y cómo ejecutarlas |

> ¿Buscas algo más específico? Revisa los directorios en `src/` en paralelo para ver la implementación exacta.

