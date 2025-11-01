import { DataSource } from 'typeorm';
import { Event } from '../../event/entities/event.entity';

/**
 * Semilla de Eventos
 *
 * Este archivo crea eventos de ejemplo en la base de datos.
 * Se ejecuta manualmente cuando necesitas datos de prueba.
 *
 * Uso:
 * npm run seed:events
 */

/**
 * Datos de eventos de ejemplo
 * Puedes modificar estos datos según tus necesidades
 */
const eventsData = [
  {
    title: 'Conferencia de NestJS 2025',
    description:
      'Aprende las mejores prácticas de NestJS, TypeORM y desarrollo backend moderno. Expositores internacionales compartirán sus experiencias.',
    date: new Date('2025-03-15T09:00:00Z'),
    location: 'Centro de Convenciones - Auditorio Principal',
  },
  {
    title: 'Workshop de TypeScript Avanzado',
    description:
      'Taller práctico sobre TypeScript avanzado, tipos genéricos, decoradores y patrones de diseño. Incluye ejercicios hands-on.',
    date: new Date('2025-03-20T14:00:00Z'),
    location: 'Tech Hub - Sala 201',
  },
  {
    title: 'Hackathon de APIs RESTful',
    description:
      'Competencia de 48 horas para desarrollar la mejor API RESTful. Premios para los 3 primeros lugares. Categorías: Innovación, Performance y Seguridad.',
    date: new Date('2025-04-05T10:00:00Z'),
    location: 'Campus Universitario - Edificio de Ingeniería',
  },
  {
    title: 'Meetup: Arquitectura de Microservicios',
    description:
      'Charla informal sobre arquitectura de microservicios, Docker, Kubernetes y mejores prácticas de deployment.',
    date: new Date('2025-04-12T18:30:00Z'),
    location: 'Coworking Space - Downtown',
  },
  {
    title: 'Webinar: Seguridad en Aplicaciones Node.js',
    description:
      'Sesión online sobre seguridad en aplicaciones Node.js. Temas: OWASP Top 10, JWT, autenticación, autorización y protección contra ataques comunes.',
    date: new Date('2025-04-18T16:00:00Z'),
    location: 'Evento Virtual - Zoom',
  },
  {
    title: 'Bootcamp de Testing con Jest',
    description:
      'Aprende a escribir tests unitarios, de integración y E2E con Jest. Cobertura de código, mocking y TDD.',
    date: new Date('2025-04-25T10:00:00Z'),
    location: 'Academia Tech - Sala de Capacitación',
  },
  {
    title: 'Conferencia: GraphQL vs REST',
    description:
      'Debate y comparación entre GraphQL y REST APIs. Ventajas, desventajas y casos de uso ideales para cada tecnología.',
    date: new Date('2025-05-02T15:00:00Z'),
    location: 'Hotel Convention Center',
  },
  {
    title: 'Taller de Bases de Datos SQL y NoSQL',
    description:
      'Comparación práctica entre bases de datos SQL (MySQL, PostgreSQL) y NoSQL (MongoDB, Redis). Cuándo usar cada una.',
    date: new Date('2025-05-10T09:30:00Z'),
    location: 'Centro de Formación Profesional',
  },
  {
    title: 'Summit de Desarrollo Backend 2025',
    description:
      'Evento de 2 días con múltiples tracks: APIs, Bases de Datos, Cloud Computing, DevOps y Architecture Patterns.',
    date: new Date('2025-05-20T08:00:00Z'),
    location: 'Centro de Exposiciones - Pabellón A',
  },
  {
    title: 'Code Review: Mejores Prácticas',
    description:
      'Sesión interactiva sobre code review efectivo, pair programming y colaboración en equipos de desarrollo.',
    date: new Date('2025-05-28T17:00:00Z'),
    location: 'Oficinas Tech Company - Sala de Reuniones',
  },
];

/**
 * Función principal que ejecuta la semilla
 */
async function runSeed() {
  console.log('🌱 Iniciando semilla de eventos...\n');

  // Crear conexión a la base de datos
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3308'),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'soy_una_contrasenia_segura',
    database: process.env.DB_NAME || 'mydatabase',
    entities: [Event],
    synchronize: false, // No sincronizar automáticamente
  });

  try {
    // Inicializar conexión
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Obtener el repositorio de eventos
    const eventRepository = dataSource.getRepository(Event);

    // Verificar si ya existen eventos
    const existingCount = await eventRepository.count();
    console.log(
      `📊 Eventos existentes en la base de datos: ${existingCount}\n`,
    );

    // Opción: Limpiar eventos existentes (descomentar si quieres borrar antes de insertar)
    // console.log('🗑️  Limpiando eventos existentes...');
    // await eventRepository.clear();
    // console.log('✅ Eventos limpiados\n');

    // Crear y guardar eventos
    console.log('📝 Creando eventos de ejemplo...\n');
    let createdCount = 0;

    for (const eventData of eventsData) {
      // Verificar si el evento ya existe por título
      const existingEvent = await eventRepository.findOne({
        where: { title: eventData.title },
      });

      if (existingEvent) {
        console.log(`⏭️  Saltando: "${eventData.title}" (ya existe)`);
        continue;
      }

      // Crear nuevo evento
      const event = eventRepository.create(eventData);
      await eventRepository.save(event);
      createdCount++;

      console.log(`✅ Creado: "${eventData.title}"`);
      console.log(`   📅 Fecha: ${eventData.date.toLocaleDateString()}`);
      console.log(`   📍 Lugar: ${eventData.location}\n`);
    }

    console.log('\n🎉 Semilla completada exitosamente!');
    console.log(`📊 Eventos creados: ${createdCount}`);
    console.log(
      `📊 Total de eventos en BD: ${await eventRepository.count()}\n`,
    );
  } catch (error) {
    console.error('❌ Error al ejecutar la semilla:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la semilla
void runSeed();
