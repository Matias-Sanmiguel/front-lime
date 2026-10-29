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

El listado público devuelve `coverImage` (`ImageResponse` o `null`) dentro de cada `PropertyResponse`, sin peticiones adicionales por tarjeta. La galería completa se consulta mediante `GET /api/v1/properties/{id}/images`. El detalle y las respuestas de edición devuelven `coverImage: null`; el mock agrega el campo a partir de las imágenes de la semilla.

## Búsqueda y organización de la UI

Los filtros aplicados y la página viven en la URL. `src/lib/property-search.js` centraliza su lectura, serialización y validación; el formulario conserva un borrador hasta pulsar Buscar o Aplicar filtros. Moneda admite ARS/USD y es obligatoria para límites de precio y orden por precio. `sort` admite `newest`, `price_asc` y `price_desc`; el backend ordena antes de paginar, sin convertir monedas. Quitar la moneda también quita límites y orden de precio.

Las páginas componen componentes; los hooks coordinan cargas y las funciones de `src/api/` conocen los endpoints. El detalle carga fotos independientemente: un error de galería no bloquea la consulta. Su enlace de regreso conserva la búsqueda de origen. La galería ampliada usa un diálogo nativo con cierre por Escape y retorno del foco.

Los tokens de `src/index.css` son compartidos por el catálogo y el panel; `panel.css` conserva solamente alias y distribución propios. Para nuevas pantallas, reutilizar las primitivas de `components/ui` y extraer componentes por responsabilidad, evitando variantes que mezclen pantallas completas.

Desplegar primero el backend con filtros de moneda/orden y portadas, y luego este frontend. El modo demo implementa el mismo contrato. Un backend anterior no entiende estos filtros ni devuelve portadas.

Todos los nombres, cuentas, avisos y consultas son ficticios. Las fotos externas son ilustrativas; no representan anuncios reales. Algunas propiedades no tienen fotos, para mostrar también ese estado.

El mock conserva los cambios de demostración en `sessionStorage` durante la pestaña, incluyendo registro, avisos, consultas leídas y fotos. Se puede volver a la semilla borrando los datos del sitio (`lime.mock.v1` y `lime.session`). Las contraseñas de cuentas creadas se guardan como hashes para la demostración; esto **no constituye autenticación de producción**. Los permisos reales corresponden al backend.

## Figma y compatibilidad

La identidad vigente está documentada en [DESIGN.md](./DESIGN.md): Inter, superficies blancas y grises, tipografía grafito, acento lima discreto y un símbolo L propio. El archivo de Figma y la identidad Editorial Lime quedan como referencias históricas. Los formularios y tarjetas se reorganizan en celular. El registro incluye fecha de nacimiento y sexo porque son obligatorios en Java. Se agregaron perfil, detalle de consulta y eliminación para cubrir los endpoints existentes.

Los favoritos usan Redux Toolkit (`favoritesSlice`) y persistencia local en el navegador; no se sincronizan con una cuenta del backend.

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
