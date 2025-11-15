import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { User } from '../user/entities/user.entity';

/**
 * Módulo de Eventos
 *
 * Encapsula toda la funcionalidad relacionada con eventos,
 * incluyendo la gestión de relaciones con usuarios.
 *
 * RELACIONES:
 * - Many-to-Many con User: Usuarios registrados a eventos
 * - Tabla intermedia: event_attendees
 *
 * Componentes:
 * - imports: TypeOrmModule con Event y User (para relaciones)
 * - controllers: EventController (endpoints REST)
 * - providers: EventService (lógica de negocio)
 * - exports: EventService (permite uso en otros módulos)
 */
@Module({
  imports: [
    // Registra las entidades Event y User en TypeORM
    // User se necesita para gestionar la relación Many-to-Many
    TypeOrmModule.forFeature([Event, User]),
  ],
  controllers: [EventController], // Controlador REST de eventos
  providers: [EventService], // Servicio de lógica de negocio con relaciones
  exports: [EventService], // Permite que otros módulos usen este servicio
})
export class EventModule {}
