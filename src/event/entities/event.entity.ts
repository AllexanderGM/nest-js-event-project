import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Event - Representa un evento en la base de datos
 *
 * Esta entidad utiliza TypeORM para mapear la tabla 'events' en MySQL.
 * Almacena información completa de eventos como título, descripción, fecha y ubicación.
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
}
