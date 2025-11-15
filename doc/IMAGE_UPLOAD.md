# Subida de imágenes para eventos

_Volver al [índice de documentación](./README.md)._ 

Los eventos pueden incluir hasta cinco imágenes almacenadas localmente en `public/uploads/events`. Esta guía resume cómo probar y ajustar la característica.

## Configuración rápida

```env
UPLOAD_DESTINATION=./public/uploads/events
MAX_FILE_SIZE=5242880      # 5 MB
MAX_FILES_COUNT=5          # 5 imágenes por evento
```

Extensiones permitidas: `jpg`, `jpeg`, `png`, `gif`, `webp`.

## Crear un evento con imágenes

```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <jwt>" \
  -F "title=Conferencia KeyCode" \
  -F "date=2025-01-15T10:00:00Z" \
  -F "images=@/ruta/imagen1.jpg" \
  -F "images=@/ruta/imagen2.png"
```

Respuesta típica:

```json
{
  "id": "uuid",
  "title": "Conferencia KeyCode",
  "images": [
    "uploads/events/<uuid>-1.jpg",
    "uploads/events/<uuid>-2.png"
  ]
}
```

Para consumirlo desde el frontend basta con apuntar a `http://localhost:3000/<ruta>`. Nest sirve la carpeta `public` automáticamente.

## Validaciones incluidas

1. Número máximo de archivos.
2. Peso de cada archivo (5 MB).
3. Extensión + MIME type (doble check).
4. Manejo de errores con `BadRequestException` personalizadas.

## Errores comunes

| Mensaje | Motivo | Acción |
|---------|--------|--------|
| `Formato de archivo no permitido...` | Extensión distinta a las permitidas | Revisa el archivo antes de enviarlo |
| `... excede el tamaño máximo` | Archivo > 5 MB | Optimiza o comprímelo |
| `Se excedió el número máximo de imágenes` | Enviadas > 5 imágenes | Elimina archivos extras |

## Tips para estudiantes

- Las imágenes quedan ignoradas por git; agrega una de ejemplo en tu demo si necesitas mostrar la UI.
- Si cambias el path (`UPLOAD_DESTINATION`), actualiza también `ServeStaticModule` en `app.module.ts`.
- Usa esta misma configuración para otros módulos (por ejemplo, avatares) duplicando el config y ajustando los límites.
