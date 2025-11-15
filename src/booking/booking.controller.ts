import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

/**
 * Controlador de reservas
 *
 * Maneja todos los endpoints relacionados con las reservas de eventos
 * Todas las rutas requieren autenticación JWT
 */
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Crea una nueva reserva para un evento
   *
   * @route POST /bookings
   * @access Private (requiere token JWT)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto, @GetUser() user: User) {
    return this.bookingService.create(createBookingDto, user.id);
  }

  /**
   * Obtiene todas las reservas del usuario autenticado
   *
   * @route GET /bookings
   * @access Private (requiere token JWT)
   */
  @Get()
  findAll(@GetUser() user: User) {
    return this.bookingService.findAllByUser(user.id);
  }

  /**
   * Obtiene las reservas de un evento específico
   *
   * @route GET /bookings/event/:eventId
   * @access Private (requiere token JWT)
   */
  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.bookingService.findByEvent(eventId);
  }

  /**
   * Obtiene una reserva específica por su ID
   *
   * @route GET /bookings/:id
   * @access Private (requiere token JWT)
   */
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.findOne(+id, user.id);
  }

  /**
   * Actualiza una reserva existente
   *
   * @route PATCH /bookings/:id
   * @access Private (requiere token JWT)
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.update(+id, updateBookingDto, user.id);
  }

  /**
   * Elimina una reserva
   *
   * @route DELETE /bookings/:id
   * @access Private (requiere token JWT)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.remove(+id, user.id);
  }
}
