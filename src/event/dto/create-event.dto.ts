import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo evento
 *
 * Los DTOs (Data Transfer Objects) definen la estructura de datos
 * que debe enviarse en las peticiones HTTP. Este DTO incluye validaciones
 * automáticas usando class-validator.
 *
 * ==========================================
 * IMPORTANTE: Este DTO funciona con DOS tipos de Content-Type
 * ==========================================
 *
 * 1. APPLICATION/JSON (sin archivos)
 * -----------------------------------
 * Content-Type: application/json
 * Body (JSON):
 * {
 *   "title": "Conferencia de NestJS",
 *   "description": "Aprende a usar NestJS con TypeORM",
 *   "date": "2025-01-15T10:00:00Z",
 *   "location": "Auditorio Principal"
 * }
 *
 * 2. MULTIPART/FORM-DATA (con archivos e imágenes)
 * -------------------------------------------------
 * Content-Type: multipart/form-data
 * Body (Form Data):
 * - title: "Conferencia de NestJS" (text)
 * - description: "Aprende a usar NestJS con TypeORM" (text)
 * - date: "2025-01-15T10:00:00Z" (text)
 * - location: "Auditorio Principal" (text)
 * - images: [archivo1.jpg, archivo2.png] (file[])
 *
 * ==========================================
 * ¿Por qué NO incluimos "images" en el DTO?
 * ==========================================
 *
 * Los archivos NO se validan con class-validator en el DTO.
 * En su lugar, se manejan en el Controller usando:
 * - @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
 * - @UploadedFiles() files: Express.Multer.File[]
 *
 * La validación de archivos se hace con Multer:
 * - Tipo de archivo (MIME type, extensión)
 * - Tamaño máximo (5 MB)
 * - Cantidad máxima (5 archivos)
 *
 * ==========================================
 * ¿Cómo funcionan las validaciones con multipart/form-data?
 * ==========================================
 *
 * Cuando el cliente envía multipart/form-data:
 * 1. NestJS extrae los campos de texto y los transforma al DTO
 * 2. Los decoradores @IsString(), @IsNotEmpty(), etc. validan los campos
 * 3. Los archivos se extraen por separado con @UploadedFiles()
 * 4. Los archivos se validan con Multer config y funciones helper
 *
 * IMPORTANTE: Todos los campos en form-data vienen como strings.
 * - title: "Conferencia" → string ✅
 * - date: "2025-01-15T10:00:00Z" → string ✅ (validado con @IsDateString)
 * - El service convierte el string de fecha a objeto Date
 *
 * ==========================================
 * Flujo completo de una petición con archivos:
 * ==========================================
 *
 * 1. Cliente envía POST /events con multipart/form-data
 *    └─ Campos: title, date, description, location
 *    └─ Archivos: images (array de archivos)
 *
 * 2. FilesInterceptor intercepta la petición
 *    └─ Extrae los archivos del campo "images"
 *    └─ Valida con Multer (tipo, tamaño, cantidad)
 *    └─ Guarda en disco: ./public/uploads/events/
 *
 * 3. NestJS valida los campos de texto con este DTO
 *    └─ @IsString(), @IsNotEmpty(), @MaxLength(), etc.
 *
 * 4. Controller recibe:
 *    └─ createEventDto (campos de texto validados)
 *    └─ files (archivos validados y guardados)
 *
 * 5. Service procesa y guarda en base de datos
 *    └─ Convierte date de string a Date
 *    └─ Extrae rutas de archivos: ["uploads/events/uuid-123.jpg"]
 *    └─ Guarda evento con rutas de imágenes
 *
 * ==========================================
 */
export class CreateEventDto {
  /**
   * Título del evento
   *
   * Validaciones:
   * - @IsString(): Debe ser un string (texto)
   * - @IsNotEmpty(): No puede estar vacío
   * - @MaxLength(200): Máximo 200 caracteres
   *
   * Funciona con ambos Content-Types:
   * - JSON: "title": "Conferencia de NestJS"
   * - Form-data: title = "Conferencia de NestJS" (text field)
   *
   * Nota: El hook @BeforeInsert() normalizará este campo
   * antes de guardarlo en la base de datos.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  /**
   * Descripción del evento
   *
   * Validaciones:
   * - @IsString(): Debe ser un string (texto)
   * - @IsOptional(): Campo opcional (puede omitirse)
   *
   * Funciona con ambos Content-Types:
   * - JSON: "description": "Evento sobre tecnología"
   * - Form-data: description = "Evento sobre tecnología" (text field)
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Fecha y hora del evento
   *
   * Validaciones:
   * - @IsDateString(): Debe ser una fecha válida en formato ISO 8601
   * - @IsNotEmpty(): No puede estar vacío
   *
   * Formato ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
   * Ejemplo: "2025-01-15T10:00:00.000Z"
   *
   * Funciona con ambos Content-Types:
   * - JSON: "date": "2025-01-15T10:00:00Z"
   * - Form-data: date = "2025-01-15T10:00:00Z" (text field)
   *
   * IMPORTANTE: Este campo viene como string y el Service
   * lo convierte a objeto Date antes de guardar en BD.
   */
  @IsDateString()
  @IsNotEmpty()
  date: string;

  /**
   * Ubicación del evento
   *
   * Validaciones:
   * - @IsString(): Debe ser un string (texto)
   * - @IsOptional(): Campo opcional (puede omitirse)
   *
   * Funciona con ambos Content-Types:
   * - JSON: "location": "Auditorio Principal"
   * - Form-data: location = "Auditorio Principal" (text field)
   */
  @IsString()
  @IsOptional()
  location?: string;

  // ==========================================
  // NOTA SOBRE IMÁGENES:
  // ==========================================
  // Las imágenes NO se definen aquí en el DTO.
  // Se manejan por separado usando:
  //
  // En el Controller:
  // @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  // create(@Body() dto: CreateEventDto, @UploadedFiles() files?: Express.Multer.File[])
  //
  // En Postman/Cliente:
  // images = [archivo1.jpg, archivo2.png] (file field, múltiples archivos)
  //
  // Ver más detalles en: src/event/event.controller.ts:70
  // ==========================================
}
