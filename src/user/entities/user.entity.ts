import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad User - Representa un usuario en la base de datos
 *
 * Esta entidad utiliza TypeORM para mapear la tabla 'users' en MySQL.
 * Almacena información básica del usuario.
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
}
