import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';

/**
 * Módulo de Eventos
 *
 * Encapsula toda la funcionalidad relacionada con eventos.
 * Este módulo sigue el patrón de organización de NestJS.
 *
 * Componentes:
 * - imports: Importa TypeOrmModule con la entidad Event para acceso a BD
 * - controllers: Define el EventController para manejar peticiones HTTP
 * - providers: Registra el EventService para la lógica de negocio
 * - exports: Exporta EventService para que otros módulos puedan usarlo
 */
@Module({
  imports: [
    // Registra la entidad Event en TypeORM para este módulo
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventController], // Controlador REST de eventos
  providers: [EventService], // Servicio de lógica de negocio
  exports: [EventService], // Permite que otros módulos usen este servicio
})
export class EventModule {}
