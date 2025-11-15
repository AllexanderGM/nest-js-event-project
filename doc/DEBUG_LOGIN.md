# Checklist de debugging para el login

_Volver al [índice de documentación](./README.md)._

Si `/auth/login` no entrega `access_token`, sigue esta secuencia antes de tocar el código.

## 1. Variables de entorno cargadas

1. Define `JWT_SECRET` y `JWT_EXPIRES_IN` en `.env`.
2. Reinicia Nest después de cambiar `.env`:
   ```bash
   npm run start:dev
   ```

## 2. Confirmar que existe el usuario

1. Haz `POST /auth/register` con correo y password conocidos.
2. Respuesta esperada (201) debe incluir token y `user`.
3. Si recibes `409`, elimina el registro desde la base de datos o usa otro correo.

## 3. Probar login con Postman o cURL

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'
```

Respuesta esperada (200):

```json
{
  "access_token": "<jwt>",
  "user": {
    "id": 1,
    "email": "student@example.com"
  }
}
```

## 4. Revisar logs del servidor

En `AuthService` hay logs temporales para diagnosticar:

- `User found: NO` → regístrate nuevamente.
- `Invalid password` → revisa la contraseña enviada.
- No aparece ningún log → revisa que estés golpeando la API correcta (`baseUrl`).

## 5. Errores comunes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `400 Bad Request` | Body sin formato JSON válido | En Postman usa Body → raw → JSON |
| `401 Unauthorized` con mensaje "User not found" | Email incorrecto | Valida con `/auth/register` o inspecciona la BD |
| `401 Unauthorized` con mensaje "Invalid password" | Contraseña no coincide | Cambia el password usando signup o limpia registros |
| No aparece `access_token` | Falta JWT en `.env` o server sin reiniciar | Define variables y reinicia |

## 6. Cuando todo falla

1. Borra los usuarios de la tabla `user` (o reinicia la base).
2. Crea un usuario nuevo desde `/auth/register`.
3. Si aún no ves resultados, revisa la guía de [Autenticación](AUTH_README.md) para confirmar que los archivos no fueron modificados.

Con este checklist deberías volver a tener tokens válidos en minutos sin necesidad de depurar línea por línea.
