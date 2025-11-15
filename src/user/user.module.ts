import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

/**
 * Módulo de Usuarios
 *
 * Encapsula la funcionalidad completa relacionada con usuarios.
 *
 * CAMBIO IMPORTANTE:
 * Anteriormente: El servicio solo consultaba la API externa de Rick and Morty
 * Ahora: El servicio usa TypeORM para gestionar usuarios en la base de datos local
 *
 * Funcionalidades:
 * - CRUD completo de usuarios (Create, Read, Update, Delete)
 * - Relación Many-to-Many con Event (usuarios registrados a eventos)
 * - Almacenamiento local en MySQL
 *
 * Componentes:
 * - imports: TypeOrmModule con la entidad User
 * - controllers: UserController (endpoints REST)
 * - providers: UserService (lógica de negocio con TypeORM)
 * - exports: UserService (permite uso en otros módulos como EventModule)
 */
@Module({
  imports: [
    // Registra la entidad User en TypeORM
    // Permite usar el repositorio User en el servicio
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController], // Endpoints REST para usuarios
  providers: [UserService], // Lógica de negocio con base de datos
  exports: [UserService], // Exporta para uso en EventModule (relaciones)
})
export class UserModule {}
