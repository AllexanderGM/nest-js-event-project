# Lifecycle hooks en TypeORM

_Volver al [índice de documentación](./README.md)._ 

Los lifecycle hooks permiten ejecutar lógica antes o después de persistir entidades. En el proyecto se usan para normalizar los eventos y dejar trazas útiles en desarrollo.

## Hooks usados en `Event`

```ts
@BeforeInsert()
normalizeBeforeInsert() {
  this.normalizeTitle();
  console.log('Creando evento', { title: this.title, date: this.date });
}

@BeforeUpdate()
normalizeBeforeUpdate() {
  this.normalizeTitle();
  console.log('Actualizando evento', { id: this.id });
}
```

`normalizeTitle` capitaliza las palabras y elimina espacios innecesarios. Gracias a esto puedes enviar títulos como `  CONFERENCIA dev  ` y se guardarán como `Conferencia Dev` sin tocar la capa de servicio.

## Otros hooks disponibles

- `@AfterInsert`, `@AfterUpdate`: disparan lógica justo después de persistir.
- `@BeforeRemove`, `@AfterRemove`: útiles para limpiar archivos relacionados.
- `@AfterLoad`: ejecuta código después de leer desde la base (ideal para cálculos derivados).

## Cuándo usarlos

- Normalización ligera (capitalizar, trim, generar slugs).
- Hashing de contraseñas (`@BeforeInsert` + `@BeforeUpdate`).
- Auditoría o logs específicos del dominio.

Evita colocar lógica pesada en los hooks (llamadas HTTP, consultas adicionales) porque se ejecutan en cada operación y pueden sorprenderte durante los tests.

Esta técnica mantiene tus servicios más limpios y asegura que la base siempre contenga datos consistentes sin importar desde qué endpoint se cree/actualice la entidad.
