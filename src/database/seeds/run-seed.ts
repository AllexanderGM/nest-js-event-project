import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Script para ejecutar semillas
 *
 * Este script carga las variables de entorno y ejecuta el archivo de semilla
 * especificado como argumento.
 *
 * Uso:
 * ts-node src/database/seeds/run-seed.ts event.seed.ts
 */

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
  const seedFile = process.argv[2];

  if (!seedFile) {
    console.error('❌ Error: Debes especificar el archivo de semilla');
    console.log(
      '\nUso: ts-node src/database/seeds/run-seed.ts <archivo-semilla>',
    );
    console.log(
      'Ejemplo: ts-node src/database/seeds/run-seed.ts event.seed.ts\n',
    );
    process.exit(1);
  }

  const seedPath = path.resolve(__dirname, seedFile);

  try {
    console.log(`\n🚀 Ejecutando semilla: ${seedFile}\n`);
    console.log(`📁 Ruta: ${seedPath}\n`);
    console.log('─'.repeat(60), '\n');

    // Importar y ejecutar el archivo de semilla
    await import(seedPath);
  } catch (error) {
    console.error('\n❌ Error al ejecutar la semilla:', error);
    process.exit(1);
  }
}

void main();
