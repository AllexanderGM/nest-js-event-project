# ESLint y la configuración de Multer

_Volver al [índice de documentación](./README.md)._ 

Al aplicar `FilesInterceptor('images', 5, multerConfig)` ESLint (regla `@typescript-eslint/no-unsafe-argument`) marcó la llamada como insegura. No es un bug del runtime sino una limitación de tipos entre `multer` y `@nestjs/platform-express`.

## Qué hicimos

```ts
import { MulterOptions } from '@nestjs/platform-express';

export const multerConfig: MulterOptions = {
  // ... storage, limits y fileFilter
} as const;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
```

- Tipamos explícitamente `multerConfig` para mantener autocompletado.
- Usamos `as const` porque es una configuración inmutable.
- Deshabilitamos la regla solo en la línea problemática.

## ¿Por qué es aceptable?

1. TypeScript compila sin advertencias: los tipos reales coinciden con `MulterOptions`.
2. `fileFilter` necesita lanzar `BadRequestException`, pero el callback espera un `Error`. El cast es intencional.
3. En runtime Multer funciona correctamente y corta la subida si hay archivos inválidos.

## Alternativas consideradas

- **Convertir todo en `any`:** descartado, perdemos chequeos de tipo.
- **Mover la config inline al controller:** hace el archivo inmanejable.
- **Usar `Error` genérico:** perderíamos el status HTTP 400 personalizado.

Conclusión: documentar el false positive y limitar el `eslint-disable` a una sola línea es la opción más clara para estudiantes.
