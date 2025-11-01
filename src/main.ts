import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Función de Inicio de la Aplicación
 *
 * Esta es la función principal que inicia la aplicación NestJS.
 * Se ejecuta automáticamente cuando inicias el servidor.
 *
 * Pasos:
 * 1. Crea la aplicación NestJS
 * 2. Configura la validación global de DTOs
 * 3. Inicia el servidor en el puerto configurado
 */
async function bootstrap() {
  // Crea una instancia de la aplicación NestJS con el módulo raíz
  const app = await NestFactory.create(AppModule);

  /**
   * ValidationPipe - Validación Global de DTOs
   *
   * Aplica validaciones automáticas a todas las peticiones HTTP
   * usando los decoradores de class-validator en los DTOs.
   *
   * Configuración:
   * - whitelist: true
   *   Elimina automáticamente propiedades que no están definidas en el DTO.
   *   Ejemplo: Si el DTO tiene "title" y "date", pero envías "extra",
   *   la propiedad "extra" será removida automáticamente.
   *
   * - forbidNonWhitelisted: true
   *   Rechaza la petición si se envían propiedades no definidas en el DTO.
   *   Retorna un error 400 Bad Request con detalles de las propiedades inválidas.
   *
   * - transform: true
   *   Transforma automáticamente los tipos de datos.
   *   Ejemplo: Convierte "123" (string) a 123 (number) si el DTO espera un number.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas
      forbidNonWhitelisted: true, // Rechaza peticiones con propiedades extras
      transform: true, // Transforma tipos automáticamente
    }),
  );

  // Inicia el servidor HTTP
  // Lee el puerto desde la variable de entorno PORT, si no existe usa 3000
  await app.listen(process.env.PORT ?? 3000);

  // Muestra en consola donde está corriendo el servidor
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

// Ejecuta la función bootstrap
void bootstrap();
