import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/**
 * Configuración de Multer para el upload de imágenes
 *
 * Define la estrategia de almacenamiento, validación de archivos y nomenclatura
 */

/**
 * Tamaño máximo permitido por imagen: 5 MB
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Número máximo de imágenes por evento
 */
export const MAX_FILES_COUNT = 5;

/**
 * Extensiones de archivo permitidas
 */
export const ALLOWED_IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;

/**
 * MIME types permitidos para imágenes
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Configuración de almacenamiento en disco
 *
 * Define dónde y cómo se guardan los archivos
 *
 * IMPORTANTE: Este objeto está tipado explícitamente como MulterOptions
 * para evitar errores de TypeScript/ESLint al usarlo en FilesInterceptor.
 *
 * NOTA SOBRE ESLINT:
 * Si ESLint sigue mostrando "Unsafe argument of type any", es un falso positivo.
 * El objeto está correctamente tipado. Puedes:
 * 1. Ignorar el warning (es seguro)
 * 2. Agregar // eslint-disable-next-line en el controller
 * 3. Actualizar las reglas de ESLint en .eslintrc.js
 */
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    /**
     * Destino donde se guardarán las imágenes
     */
    destination: (_req, _file, cb) => {
      cb(null, './public/uploads/events');
    },

    /**
     * Genera un nombre único para cada archivo
     * Formato: {uuid}-{timestamp}{extension}
     * Ejemplo: a1b2c3d4-1699999999999.jpg
     */
    filename: (_req, file, cb) => {
      const uniqueName = `${uuidv4()}-${Date.now()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),

  /**
   * Límites de tamaño y cantidad de archivos
   */
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_COUNT,
  },

  /**
   * Filtro para validar el tipo de archivo
   * Solo acepta imágenes en formatos permitidos
   */
  fileFilter: (_req, file, cb) => {
    // Validar extensión del archivo
    const originalName = String(file.originalname || '').toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.test(originalName)) {
      return cb(
        new BadRequestException(
          `Formato de archivo no permitido. Solo se aceptan: jpg, jpeg, png, gif, webp`,
        ),
        false,
      );
    }

    // Validar MIME type
    const mimeType = String(file.mimetype || '');
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return cb(
        new BadRequestException(
          `Tipo de archivo no permitido. MIME type: ${file.mimetype}`,
        ),
        false,
      );
    }

    cb(null, true);
  },
} as const;

/**
 * Valida el tamaño de múltiples archivos
 *
 * @param files - Array de archivos a validar
 * @throws BadRequestException si algún archivo excede el tamaño máximo
 */
export function validateFilesSize(files: Express.Multer.File[]): void {
  files.forEach((file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `El archivo ${file.originalname} excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
      );
    }
  });
}

/**
 * Valida el número de archivos
 *
 * @param files - Array de archivos a validar
 * @throws BadRequestException si se excede el número máximo de archivos
 */
export function validateFilesCount(files: Express.Multer.File[]): void {
  if (files.length > MAX_FILES_COUNT) {
    throw new BadRequestException(
      `Se excedió el número máximo de imágenes (${MAX_FILES_COUNT}). Se recibieron ${files.length}`,
    );
  }
}
