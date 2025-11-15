# Guía rápida de testing

_Volver al [índice de documentación](./README.md)._ 

Los tests se usan como ejemplos de cómo probar servicios NestJS y flujos completos. Aún no cubren todo el proyecto, pero sirven de base para tus propias pruebas.

## Estructura

```
src/
├── auth/auth.service.spec.ts      # Tests unitarios del AuthService
├── booking/booking.service.spec.ts# Tests unitarios del BookingService
test/
└── auth.e2e-spec.ts               # Tests end-to-end de autenticación
```

## Comandos principales

```bash
npm run test        # unitarios
npm run test:watch  # recarga al guardar
npm run test:cov    # cobertura
npm run test:e2e    # e2e (requieren MySQL activo)
```

## Qué validan

| Archivo | Casos destacados |
|---------|------------------|
| `auth.service.spec.ts` | Registro, login y validaciones de usuario con repositorios mockeados |
| `booking.service.spec.ts` | Creación de reservas, duplicados, ownership y eliminación |
| `test/auth.e2e-spec.ts` | Flujo completo de registro/login/perfil usando Supertest |

## Cómo extenderlos

1. Duplica los patrones de mock (uso de `getRepositoryToken`) para otros servicios.
2. En e2e, crea módulos de prueba con `Test.createTestingModule` y reutiliza la app real (`main.ts`).
3. Usa `supertest` para describir flujos (crear evento → reservar → eliminar).

> Consejo: agrega tests nuevos en la misma carpeta del módulo (`src/<module>/*.spec.ts`) para mantener la misma convención que Nest CLI.

Con esta base puedes demostrar dominio de testing en tus propias entregas del curso.
