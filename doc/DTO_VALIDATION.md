# DTOs + validación cuando subimos archivos

_Volver al [índice de documentación](./README.md)._ 

El módulo de eventos acepta `application/json` y `multipart/form-data` en el mismo endpoint. Esta guía resume cómo NestJS valida cada parte de la petición.

## Capas involucradas

1. **Interceptor de archivos (`FilesInterceptor`)**
   - Usa la configuración exportada desde `common/utils/file-upload.config.ts`.
   - Valida cantidad (`MAX_FILES_COUNT`), peso (`MAX_FILE_SIZE`) y extensiones permitidas.
   - Si todo sale bien, entrega `files: Express.Multer.File[]` al controlador.

2. **DTO (`CreateEventDto`) con class-validator**
   - Solo se enfoca en campos de texto (`title`, `description`, `date`, `location`).
   - No incluimos `images` en el DTO porque los archivos no pasan por class-validator.
   - Las reglas (`@IsString`, `@IsNotEmpty`, `@MaxLength`, `@IsDateString`) se aplican igual cuando envías JSON o form-data.

3. **Service**
   - Recibe datos limpios y decide qué hacer con los archivos (guardar rutas en la entidad `Event`).

## Diagrama mental

```
POST /events (multipart/form-data)
        │
        ▼
FilesInterceptor → valida archivos con Multer → @UploadedFiles()
        │
        ▼
ValidationPipe + CreateEventDto → limpia texto → @Body()
        │
        ▼
EventService.create(dto, files)
```

## Ejemplo de controller

```ts
@Post()
@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
create(
  @Body() dto: CreateEventDto,
  @UploadedFiles() files?: Express.Multer.File[],
) {
  return this.eventService.create(dto, files);
}
```

## Buenas prácticas

- Valida archivos en el interceptor y, si necesitas reglas adicionales (ej. contar imágenes existentes), hazlo en el service.
- Mantén los DTOs agnósticos del `Content-Type`. Así puedes probar los endpoints con JSON puro cuando no necesitas imágenes.
- Documenta qué campos pertenecen a cada capa (como en esta guía) para evitar mezclar responsabilidades.

Con este patrón podrás agregar otros endpoints mixtos (archivos + JSON) sin perder la protección de class-validator.
