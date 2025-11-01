import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

/**
 * Módulo de Usuarios
 *
 * Encapsula la funcionalidad relacionada con usuarios.
 * Actualmente solo tiene un servicio que consulta la API de Rick and Morty.
 *
 * Nota: Aunque importa TypeORM con la entidad User, el servicio actual
 * no la usa porque solo consulta la API externa. La entidad está preparada
 * para futuras funcionalidades que requieran almacenar usuarios localmente.
 *
 * Componentes:
 * - imports: Importa TypeOrmModule con la entidad User (preparado para uso futuro)
 * - providers: Registra el UserService
 * - exports: Exporta UserService para que otros módulos puedan usarlo
 */
@Module({
  imports: [
    // Registra la entidad User en TypeORM (lista para uso futuro)
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService], // Servicio que consulta la API de Rick and Morty
  exports: [UserService], // Permite que otros módulos usen este servicio
})
export class UserModule {}
