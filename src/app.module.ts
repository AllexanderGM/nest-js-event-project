import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { BookingModule } from './booking/booking.module';

/**
 * Módulo Principal de la Aplicación
 *
 * Este es el módulo raíz que importa y configura todos los demás módulos.
 * Aquí se configuran los servicios globales como:
 * - Variables de entorno (ConfigModule)
 * - Conexión a la base de datos (TypeORM)
 * - Módulos de funcionalidad (EventModule, UserModule)
 */
@Module({
  imports: [
    /**
     * ConfigModule - Configuración de Variables de Entorno
     *
     * Lee el archivo .env y hace las variables disponibles en toda la app.
     * - isGlobal: true -> No necesitas importarlo en otros módulos
     * - envFilePath: '.env' -> Ruta al archivo de variables de entorno
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible globalmente sin necesidad de importar
      envFilePath: '.env', // Archivo de configuración
    }),

    /**
     * TypeORM - Configuración de Base de Datos
     *
     * Configura la conexión a MySQL usando variables de entorno.
     * forRootAsync permite configuración asíncrona y usar ConfigService.
     *
     * Variables de entorno usadas:
     * - DB_TYPE: Tipo de base de datos (mysql, postgres, etc.)
     * - DB_HOST: Host del servidor de BD (localhost o nombre del contenedor)
     * - DB_PORT: Puerto de la BD (3306 para MySQL)
     * - DB_USER: Usuario de la BD
     * - DB_PASSWORD: Contraseña de la BD
     * - DB_NAME: Nombre de la base de datos
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Tipo de base de datos (mysql por defecto)
        type: configService.get<
          | 'mysql'
          | 'postgres'
          | 'mariadb'
          | 'sqlite'
          | 'mssql'
          | 'oracle'
          | 'mongodb'
        >('DB_TYPE', 'mysql'),

        // Configuración de conexión
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'user'),
        password: configService.get<string>(
          'DB_PASSWORD',
          'soy_una_contrasenia_segura',
        ),
        database: configService.get<string>('DB_NAME', 'mydatabase'),

        // Busca todas las entidades en la carpeta entities
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // synchronize: true -> Sincroniza automáticamente las entidades con la BD
        // ADVERTENCIA: En producción debe ser false para evitar pérdida de datos
        synchronize: true,

        // logging: false -> No muestra las queries SQL en consola
        // Cambia a true para ver las queries durante el desarrollo
        logging: false,
      }),
      inject: [ConfigService], // Inyecta ConfigService en la factory
    }),

    /**
     * ServeStaticModule - Configuración de Archivos Estáticos
     *
     * Sirve archivos estáticos desde la carpeta public.
     * Las imágenes de eventos estarán disponibles en /uploads/events/...
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    /**
     * Módulos de Funcionalidad
     *
     * Importa los módulos que contienen la lógica de negocio:
     * - EventModule: Gestión de eventos
     * - UserModule: Gestión de usuarios (actualmente consulta API externa)
     */
    EventModule,
    UserModule,
    AuthModule,
    BookingModule,
  ],
  providers: [
    /**
     * JwtAuthGuard Global
     *
     * Protege todas las rutas de la aplicación con autenticación JWT.
     * Las rutas marcadas con @Public() quedan excluidas de esta protección.
     */
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
