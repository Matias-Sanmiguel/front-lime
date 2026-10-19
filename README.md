# Lime — Frontend React

Interfaz de un portal inmobiliario para la tercera actividad obligatoria de Aplicaciones Interactivas. Implementa navegación, formularios y operaciones con **JSON locales y datos ficticios**. No requiere iniciar Java ni una base de datos para la entrega estática.

- [Diseño y wireflow en Figma](https://www.figma.com/design/bgyy8ucpBeyVH17eAapO7G/Lime?node-id=11-787)
- [Backend Java](https://github.com/Matias-Sanmiguel/back-lime)
- [Guía de ejecución y pruebas](mi-app/README.md)

## Ejecutar

Requiere Node.js 22.12 o posterior y npm.

```sh
cd mi-app
npm ci
npm run dev
```

Abrir la dirección que muestra Vite. Cuenta ficticia inicial: **lime@test.com / 12345678** (inmobiliaria).

## Pantallas

| Ruta | Función |
|---|---|
| `/` | Inicio y búsqueda rápida |
| `/buscar` | Filtros, resultados y paginación |
| `/propiedad/:id` | Detalle, galería y envío de consultas |
| `/login`, `/registro` | Ingreso y creación de cuentas Usuario/Inmobiliaria |
| `/panel` | Avisos propios y eliminación |
| `/panel/nuevo`, `/panel/:id/editar` | Borradores, edición, publicación, pausa y gestión de fotos |
| `/panel/consultas` | Bandeja, contador, filtro sin leer y paginación |
| `/panel/consultas/:inquiryId` | Detalle de consulta y marcar como leída |
| `/panel/perfil` | Datos del perfil y cambio de contraseña |

## Contrato de datos

Los archivos `mi-app/public/data/` conservan la forma de los DTOs Java. `properties.json` es `PageResponse<PropertyResponse>`, `inquiries.json` es `InquiryInboxResponse`, `auth.json` es `AuthResponse` y `me.json` es `UserResponse`. Cada `images-ID.json` es una lista de `ImageResponse` (incluye `createdAt` y `updatedAt`). Las fechas de respuestas usan ISO-8601 UTC.

Las imágenes **no** pertenecen a `PropertyResponse`: se consultan mediante `GET /properties/{id}/images`. La capa de presentación las combina con las propiedades para mostrar las tarjetas.

Todos los nombres, cuentas, avisos y consultas son ficticios. Las fotos externas son ilustrativas; no representan anuncios reales. Algunas propiedades no tienen fotos, para mostrar también ese estado.

El mock conserva los cambios de demostración en `sessionStorage` durante la pestaña, incluyendo registro, avisos, consultas leídas y fotos. Se puede volver a la semilla borrando los datos del sitio (`lime.mock.v1` y `lime.session`). Las contraseñas de cuentas creadas se guardan como hashes para la demostración; esto **no constituye autenticación de producción**. Los permisos reales corresponden al backend.

## Figma y compatibilidad

Se mantienen la paleta Editorial Lime, tipografías Inter/Newsreader, tarjetas claras, botones oscuros y acentos lima. Registro y consultas siguen los marcos Desktop del archivo. Los formularios y tarjetas se reorganizan en celular. El registro incluye fecha de nacimiento y sexo porque son obligatorios en Java, aunque no figuran en el marco de registro. Se agregaron perfil, detalle de consulta y eliminación para cubrir los endpoints existentes.

## Verificación

```sh
cd mi-app
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

Las pruebas incluyen contratos JSON, permisos, registro, duplicados, edición/publicación/pausa/eliminación, envío/lectura de consultas, validaciones, gestión de imágenes y actualización de perfil.
