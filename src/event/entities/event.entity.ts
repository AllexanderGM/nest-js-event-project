import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

/**
 * Entidad Event - Representa un evento en la base de datos
 *
 * Esta entidad utiliza TypeORM para mapear la tabla 'events' en MySQL.
 * Almacena información completa de eventos como título, descripción, fecha y ubicación.
 *
 * RELACIONES:
 * - Many-to-Many con User: Un evento puede tener múltiples usuarios registrados
 */
@Entity('events') // Define el nombre de la tabla en la base de datos
export class Event {
  /**
   * ID único del evento
   * Utiliza UUID (Universal Unique Identifier) en lugar de número incremental
   * Ejemplo: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Título del evento
   * Máximo 200 caracteres
   * Campo obligatorio
   */
  @Column({ length: 200 })
  title: string;

  /**
   * Descripción detallada del evento
   * Tipo TEXT permite almacenar textos largos
   * Campo opcional (nullable)
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Fecha y hora del evento
   * Almacena tanto fecha como hora (datetime)
   * Campo obligatorio
   */
  @Column({ type: 'datetime' })
  date: Date;

  /**
   * Ubicación del evento
   * Campo opcional (nullable)
   */
  @Column({ nullable: true })
  location: string;

  /**
   * Rutas de las imágenes del evento
   * Almacena hasta 5 rutas de imágenes
   * Campo opcional (nullable)
   * Formato: array de strings ["uploads/events/img1.jpg", "uploads/events/img2.jpg"]
   */
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  /**
   * Fecha de creación del registro
   * Se genera automáticamente al crear el evento
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   * Se actualiza automáticamente cada vez que se modifica el evento
   */
  @UpdateDateColumn()
  updatedAt: Date;

  // ==========================================
  // LIFECYCLE HOOKS (Ganchos de Ciclo de Vida)
  // ==========================================

  /**
   * Hook @BeforeInsert
   *
   * Este método se ejecuta ANTES de insertar un nuevo registro en la base de datos.
   * Es útil para:
   * - Normalizar datos (convertir a mayúsculas/minúsculas, trim, etc.)
   * - Validaciones personalizadas
   * - Generar valores por defecto
   * - Logging / Auditoría
   * - Encriptar datos sensibles
   *
   * IMPORTANTE: Este hook NO se ejecuta en operaciones masivas como:
   * - repository.insert([...]) - Inserción de múltiples registros
   * - QueryBuilder.insert().values([...]) - Inserción con query builder
   *
   * EJEMPLO DE USO:
   * Antes de guardar un evento, normalizamos el título y validamos la fecha.
   */
  @BeforeInsert()
  normalizeBeforeInsert() {
    // 1. Normalizar el título: capitalizar primera letra de cada palabra
    if (this.title) {
      this.title = this.title
        .trim() // Eliminar espacios al inicio/final
        .toLowerCase() // Convertir todo a minúsculas
        .split(' ') // Separar por palabras
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar cada palabra
        .join(' '); // Unir las palabras

      // Ejemplo:
      // Input:  "   CONFERENCIA de TECNOLOGÍA   "
      // Output: "Conferencia De Tecnología"
    }

    // 2. Normalizar ubicación si existe
    if (this.location) {
      this.location = this.location.trim();
    }

    // 3. Normalizar descripción si existe
    if (this.description) {
      this.description = this.description.trim();
    }

    // 4. Logging para auditoría (útil en desarrollo)
    console.log('📝 [BeforeInsert] Creando nuevo evento:', {
      title: this.title,
      date: this.date,
      hasImages: this.images ? this.images.length : 0,
    });
  }

  /**
   * Hook @BeforeUpdate
   *
   * Este método se ejecuta ANTES de actualizar un registro existente.
   * Es útil para:
   * - Normalizar datos actualizados
   * - Validaciones de cambios
   * - Logging de modificaciones
   * - Auditoría de cambios
   * - Prevenir actualizaciones no deseadas
   *
   * IMPORTANTE: Este hook NO se ejecuta en operaciones masivas como:
   * - repository.update({ ... }, { ... }) - Actualización directa
   * - QueryBuilder.update().set({ ... }) - Actualización con query builder
   *
   * Para que se ejecute, debes usar:
   * - repository.save(entity) - Guardar entidad existente
   *
   * EJEMPLO DE USO:
   * Antes de actualizar un evento, normalizamos los datos modificados.
   */
  @BeforeUpdate()
  normalizeBeforeUpdate() {
    // 1. Normalizar el título si fue modificado
    if (this.title) {
      this.title = this.title
        .trim()
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // 2. Normalizar ubicación si fue modificada
    if (this.location) {
      this.location = this.location.trim();
    }

    // 3. Normalizar descripción si fue modificada
    if (this.description) {
      this.description = this.description.trim();
    }

    // 4. Logging para auditoría (útil en desarrollo)
    console.log('✏️  [BeforeUpdate] Actualizando evento:', {
      id: this.id,
      title: this.title,
      date: this.date,
    });
  }

  // ==========================================
  // NOTAS ADICIONALES SOBRE LIFECYCLE HOOKS
  // ==========================================

  /**
   * Otros hooks disponibles en TypeORM:
   *
   * @AfterInsert() - Se ejecuta DESPUÉS de insertar
   * @AfterUpdate() - Se ejecuta DESPUÉS de actualizar
   * @BeforeRemove() - Se ejecuta ANTES de eliminar
   * @AfterRemove() - Se ejecuta DESPUÉS de eliminar
   * @AfterLoad() - Se ejecuta DESPUÉS de cargar desde BD
   *
   * Orden de ejecución en INSERT:
   * 1. @BeforeInsert()
   * 2. INSERT INTO ... (operación en BD)
   * 3. @AfterInsert()
   *
   * Orden de ejecución en UPDATE:
   * 1. @BeforeUpdate()
   * 2. UPDATE ... SET ... (operación en BD)
   * 3. @AfterUpdate()
   *
   * Casos de uso comunes:
   * - @BeforeInsert/@BeforeUpdate: Normalizar, validar, encriptar
   * - @AfterInsert/@AfterUpdate: Enviar notificaciones, sincronizar cache
   * - @AfterLoad: Desencriptar datos, formatear para presentación
   * - @BeforeRemove: Validar si se puede eliminar, limpiar archivos
   * - @AfterRemove: Eliminar archivos relacionados, limpiar cache
   */

  // ==========================================
  // RELACIONES (Relationships)
  // ==========================================

  /**
   * Usuarios registrados al evento (asistentes)
   *
   * Relación Many-to-Many con User:
   * - Un evento puede tener muchos usuarios registrados
   * - Un usuario puede registrarse a muchos eventos
   *
   * IMPORTANTE: @JoinTable
   * - Este decorador define que Event es el "dueño" de la relación
   * - Solo se coloca en UNO de los lados de la relación Many-to-Many
   * - Crea automáticamente la tabla intermedia en la base de datos
   *
   * TABLA INTERMEDIA GENERADA:
   * event_attendees
   * ├── event_id (UUID, FK → events.id)
   * ├── user_id (INT, FK → users.id)
   * └── PRIMARY KEY (event_id, user_id)
   *
   * EJEMPLO DE USO:
   * // Cargar evento con asistentes
   * const event = await eventRepository.findOne({
   *   where: { id: 'uuid-123' },
   *   relations: ['attendees']  // ← Carga los usuarios registrados
   * });
   *
   * console.log(event.attendees); // Array de usuarios
   *
   * // Agregar usuario a evento
   * event.attendees = [...event.attendees, newUser];
   * await eventRepository.save(event);
   *
   * // O usando el método de asociación en el service
   * await eventService.registerUserToEvent(eventId, userId);
   */
  @ManyToMany(() => User, (user: User) => user.events)
  @JoinTable({
    name: 'event_attendees', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'event_id', // Columna que referencia a Event
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id', // Columna que referencia a User
      referencedColumnName: 'id',
    },
  })
  attendees: User[];
}
