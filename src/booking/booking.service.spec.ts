import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Event } from '../event/entities/event.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let bookingRepository: Repository<Booking>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventRepository: Repository<Event>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  // Mock de evento
  const mockEvent: Event = {
    id: 'event-uuid-123',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2025-12-31'),
    location: 'Test Location',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  };

  // Mock de reserva
  const mockBooking: Booking = {
    id: 1,
    userId: 1,
    eventId: 'event-uuid-123',
    status: BookingStatus.PENDING,
    notes: 'Test booking',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      displayName: 'Test User',
      avatarUrl: null,
      originWorld: null,
      isAlive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookings: [],
    },
    event: mockEvent,
  };

  // Mocks de los repositorios
  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockEventRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una reserva exitosamente', async () => {
      const createBookingDto = {
        eventId: 'event-uuid-123',
        notes: 'Test booking',
      };
      const userId = 1;

      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockBookingRepository.findOne.mockResolvedValue(null);
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockBookingRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockBooking);

      const result = await service.create(createBookingDto, userId);

      expect(result).toEqual(mockBooking);
      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBookingDto.eventId },
      });
      expect(mockBookingRepository.create).toHaveBeenCalled();
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el evento no existe', async () => {
      const createBookingDto = {
        eventId: 'nonexistent-event',
        notes: 'Test booking',
      };
      const userId = 1;

      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar ConflictException si ya existe una reserva', async () => {
      const createBookingDto = {
        eventId: 'event-uuid-123',
        notes: 'Test booking',
      };
      const userId = 1;

      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.create(createBookingDto, userId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las reservas del usuario', async () => {
      const userId = 1;
      const mockBookings = [mockBooking];

      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockBookings);
      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'event'],
        order: {
          createdAt: 'DESC',
        },
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar una reserva si el usuario es el propietario', async () => {
      const bookingId = 1;
      const userId = 1;

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne(bookingId, userId);

      expect(result).toEqual(mockBooking);
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookingId },
        relations: ['user', 'event'],
      });
    });

    it('debería lanzar NotFoundException si la reserva no existe', async () => {
      const bookingId = 999;
      const userId = 1;

      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(bookingId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar ForbiddenException si el usuario no es el propietario', async () => {
      const bookingId = 1;
      const differentUserId = 2;

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.findOne(bookingId, differentUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar una reserva exitosamente', async () => {
      const bookingId = 1;
      const userId = 1;
      const updateBookingDto = {
        status: BookingStatus.CONFIRMED,
        notes: 'Updated notes',
      };

      const updatedBooking = { ...mockBooking, ...updateBookingDto };

      mockBookingRepository.findOne
        .mockResolvedValueOnce(mockBooking)
        .mockResolvedValueOnce(updatedBooking);
      mockBookingRepository.save.mockResolvedValue(updatedBooking);

      const result = await service.update(bookingId, updateBookingDto, userId);

      expect(result).toEqual(updatedBooking);
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar una reserva exitosamente', async () => {
      const bookingId = 1;
      const userId = 1;

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.remove.mockResolvedValue(mockBooking);

      await service.remove(bookingId, userId);

      expect(mockBookingRepository.remove).toHaveBeenCalledWith(mockBooking);
    });
  });
});
