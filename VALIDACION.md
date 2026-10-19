# Revisión de entrega — 19 de octubre de 2026

## Pendientes detectados y resueltos

- Faltaban registro y `/panel/consultas`, pese a existir enlaces hacia esas rutas.
- El cliente mock no implementaba alta/baja de avisos, imágenes, perfil ni bandeja; edición y estados no persistían.
- `PropertyResponse` llevaba un campo `images` que no existe en el DTO Java. Las fotos ahora se leen del endpoint separado.
- Las consultas creadas omitían `propertyTitle` y `readAt`; las fechas locales no indicaban UTC.
- Faltaban navegación de sesión, salida, edición de perfil y eliminación desde el panel.
- Había implementaciones duplicadas de componentes y API, y una pantalla anterior todavía en el router.
- El panel activaba colores oscuros automáticamente, en conflicto con la identidad clara del resto de la aplicación.
- TypeScript no podía verificarse con la configuración anterior (`baseUrl` fue retirado en la versión instalada).
- La revisión adicional detectó reutilización de IDs después de eliminar avisos. Se agregó una secuencia persistente y una prueba que comprueba que las consultas no cambien de dueño.

## Resultados

| Verificación | Resultado |
|---|---|
| Front: `npm test` | 16 pruebas aprobadas: 11 de contrato/lógica y 5 de React/flujos |
| Front: `npm run typecheck` | Sin errores |
| Front: `npm run lint` | Sin advertencias ni errores |
| Front: `npm run build` | Compilación de producción correcta |
| Front: `npm audit` | Cero vulnerabilidades reportadas |
| Back: `mvn test` con Java 21 | 60 pruebas aprobadas, cero fallos, errores u omitidas |
| Revisión independiente | Hallazgo de IDs reproducido y corregido con prueba de regresión |

El backend se verificó en el commit `8281bef4b7b0b3ef819d8f123bb9ba65c32d4cc5`; no necesitó cambios para la entrega estática. En el equipo de revisión fue necesario apuntar `JAVA_HOME` al JDK 21 instalado antes de ejecutar Maven.

## Navegador

- Ingreso con cuenta de inmobiliaria y navegación al panel.
- Bandeja, filtro sin leer, marcado de lectura y actualización del contador.
- Detalle individual de consulta.
- Alta de borrador, publicación, pausa y edición guardada.
- Registro vacío: errores visibles por campo. Registro completo probado además con React/jsdom y el adaptador mock.
- Revisión móvil a 390 × 844: registro, búsqueda, detalle, nuevo aviso y bandeja sin desborde horizontal.
- Capturas de evidencia conservadas junto a los repositorios en `lime/evidencia/`.

## Límites

La referencia Figma se inspeccionó visualmente en el navegador. Se reprodujeron estructura, colores y tipografía de los marcos revisados; no se ejecutó una comparación automatizada píxel por píxel. El registro agrega los campos obligatorios de Java que faltan en el mockup. Las fotos y datos son ficticios, por lo que difieren de los textos/placeholder del diseño.

La entrega usa JSON locales. Las pruebas Java usan H2 y MockMvc; no se levantó una integración completa navegador → Java → SQL Server. El transporte HTTP queda preparado, pero no se presenta esa integración real como verificada. No se realizó la entrega a BSP ni se modificó el Figma.
