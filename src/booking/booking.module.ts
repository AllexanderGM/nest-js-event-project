import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';

/**
 * Módulo de Reservas
 *
 * Gestiona todas las reservas de eventos.
 * Importa las entidades necesarias (Booking, Event, User) para las relaciones.
 */
@Module({
  imports: [
    // Importa las entidades necesarias para usar en el repositorio
    TypeOrmModule.forFeature([Booking, Event, User]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
