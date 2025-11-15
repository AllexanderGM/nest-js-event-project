import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';

/**
 * Entidad User - Representa un usuario en la base de datos
 *
 * Esta entidad utiliza TypeORM para mapear la tabla 'users' en MySQL.
 * Almacena información básica del usuario y sus relaciones con eventos.
 *
 * RELACIONES:
 * - Many-to-Many con Event: Un usuario puede registrarse a múltiples eventos
 */
@Entity('users') // Define el nombre de la tabla en la base de datos
export class User {
  /**
   * ID único del usuario
   * Se genera automáticamente de forma incremental
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Email del usuario
   * Debe ser único en la base de datos
   */
  @Column({ unique: true })
  email: string;

  /**
   * Contraseña hasheada del usuario
   * NUNCA se debe retornar en las respuestas API
   */
  @Column({ select: false })
  password: string;

  /**
   * Nombre para mostrar del usuario
   * Máximo 100 caracteres
   */
  @Column({ length: 100 })
  displayName: string;

  /**
   * URL del avatar del usuario
   * Campo opcional (nullable)
   */
  @Column({ nullable: true })
  avatarUrl: string;

  /**
   * Mundo de origen del usuario
   * Campo opcional (nullable)
   */
  @Column({ nullable: true })
  originWorld: string;

  /**
   * Estado del usuario (vivo/muerto)
   * Por defecto es true (vivo)
   */
  @Column({ default: true })
  isAlive: boolean;

  /**
   * Fecha de creación del registro
   * Se genera automáticamente al crear el usuario
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   * Se actualiza automáticamente cada vez que se modifica el usuario
   */
  @UpdateDateColumn()
  updatedAt: Date;

  // ==========================================
  // RELACIONES (Relationships)
  // ==========================================

  /**
   * Eventos a los que el usuario está registrado
   *
   * Relación Many-to-Many con Event:
   * - Un usuario puede registrarse a muchos eventos
   * - Un evento puede tener muchos usuarios registrados
   *
   * IMPORTANTE:
   * - Esta es la parte "inversa" de la relación
   * - La tabla intermedia se define en Event entity (con @JoinTable)
   * - El lado que tiene @JoinTable es el "dueño" de la relación
   *
   * EJEMPLO DE USO:
   * const user = await userRepository.findOne({
   *   where: { id: 1 },
   *   relations: ['events']  // ← Carga los eventos del usuario
   * });
   *
   * console.log(user.events); // Array de eventos a los que está registrado
   *
   * Tabla intermedia en base de datos:
   * event_attendees
   * ├── event_id (FK → events.id)
   * └── user_id (FK → users.id)
   */
  @ManyToMany(() => Event, (event) => event.attendees)
  events: Event[];
}
