---
name: Lime
description: Identidad minimalista para explorar propiedades con claridad.
colors:
  background: "#f5f5f7"
  surface: "#ffffff"
  foreground: "#1d1d1f"
  muted-foreground: "#65656b"
  border: "#dcdce1"
  primary: "#1d1d1f"
  primary-foreground: "#ffffff"
  accent: "#d5eeaa"
  accent-foreground: "#1d1d1f"
  accent-ink: "#527a24"
  danger: "#b72e35"
  warning: "#b25e09"
typography:
  display:
    fontFamily: "Inter, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.03em"
  price:
    fontFamily: "Inter, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
rounded:
  sm: "10px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge:
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: Lime

## Overview

**Creative North Star: "Claridad para encontrar tu lugar"**

Este nombre describe la implementación; no se presenta como una elección textual del usuario. La dirección confirmada es una identidad nueva, minimalista y linda, con referencia estética Apple y logo propio. Reemplaza el mundo editorial anterior: blancos y grises fríos, tipografía sans serif y fotografías de propiedades como protagonistas.

La calma visual surge del espacio, de una jerarquía breve y de controles familiares. El lima suave y su verde de contraste son una elección de implementación pendiente de la preferencia cromática del usuario. Este documento es la referencia visual del frontend; los valores normativos están en el frontmatter y se corresponden con el código actual.

**Key Characteristics:**
- Superficies claras y contraste de grafito.
- Una sola familia tipográfica: Inter.
- Fotografías protagonistas y datos fáciles de comparar.
- Logo geométrico propio, abierto y de trazos redondeados.
- Movimiento breve y profundidad discreta.

## Colors

### Primary

El grafito es el color de las acciones primarias, con texto blanco. El lima suave acompaña la selección de texto; el verde de contraste identifica enlaces, foco y la esquina del símbolo. El acento sigue siendo una decisión de implementación, no una preferencia confirmada del usuario.

### Neutral

El fondo gris frío separa las zonas de contenido de las superficies blancas. El grafito sostiene los títulos y precios; el gris secundario acompaña metadatos y descripciones; el borde gris delimita campos y contenedores.

Los tokens danger y warning se reservan para estados semánticos. La hoja global conserva un modo oscuro opt-in mediante la clase dark, sin selector visible; sus valores heredados no constituyen una segunda identidad aprobada. El sistema documentado aquí es el claro.

**The Contrast Rule.** Usar grafito para la acción primaria y verde de contraste para el texto acentuado; el lima suave no funciona como texto sobre blanco.

## Typography

Inter se usa tanto en títulos como en cuerpo, con las alternativas del sistema indicadas en los tokens. Los títulos combinan peso semibold con espaciado compacto; las cifras de precio usan números tabulares.

El display fluido corresponde al título de inicio. Los títulos de sección pasan de 24 a 30 px en pantallas sm. El texto introductorio pasa de 16 a 18 px, con interlineado relajado y ancho máximo de 32 rem. Las etiquetas usan 14 px; la navegación usa 12 px y pasa a 13 px en sm. El precio de tarjeta usa el rol price; el título de la propiedad se muestra como información secundaria, de 14 px y peso normal.

## Layout

El contenedor principal tiene un máximo de 72 rem. Los márgenes laterales de inicio son 20 px y pasan a 24 px en sm; la navegación usa 16 y 24 px. El espacio entre tarjetas es 24 px. La cuadrícula muestra una columna, dos desde sm (640 px) y tres desde lg (1024 px).

La búsqueda inicial tiene dos columnas en pantallas pequeñas: ciudad y botón ocupan ambas; operación y tipo comparten fila. En lg se convierte en una fila de cuatro áreas. La navegación admite salto de línea.

Usar 390 px y 1440 px como anchos de comprobación móvil y escritorio, respectivamente: son referencias de revisión, no breakpoints del CSS. A 640 px o menos, los controles de formulario usan un mínimo de 44 px de alto y texto de 16 px; los objetivos táctiles de navegación y botones conservan un mínimo de 44 px.

## Elevation & Depth

La separación depende principalmente del contraste entre superficies. Las tarjetas de propiedades están libres de borde y sombra en reposo; al pasar el puntero reciben una sombra ambiental y suben 2 px. La cabecera fija usa una superficie al 95 % y desenfoque de fondo.

La sombra de tarjeta es `0 10px 30px rgb(29 29 31 / 8%)`. La transición de sombra y desplazamiento dura 200 ms con curva ease. Con prefers-reduced-motion: reduce se eliminan la transición y el desplazamiento de tarjeta. No extender este comportamiento a animaciones innecesarias; la excepción actual se aplica específicamente a las tarjetas.

## Shapes

Los campos y botones usan el radio sm; las tarjetas y el buscador usan lg. La navegación y las etiquetas son cápsulas. Las fotografías de las tarjetas se recortan a 4:3 y sus esquinas superiores siguen el contenedor.

El símbolo de Lime es una L abierta, con una esquina verde independiente arriba a la derecha. Se construye como SVG original con trazos redondeados; acompaña la palabra lime en minúsculas. El símbolo ocupa 32 px y el nombre 1.6 rem, con peso 600 y espaciado de -0.04 em. Usar el componente Brand como fuente de la marca.

## Components

### Buttons

La variante primaria usa grafito y blanco; secondary añade un borde; ghost conserva el fondo transparente; link usa verde y subrayado al pasar el puntero. El tamaño base tiene 44 px de alto. El primario baja a 90 % de opacidad al pasar el puntero; secondary y ghost toman el color de borde al 40 %. El foco del botón usa un anillo de 2 px con separación de 2 px. El estado deshabilitado usa opacidad de 50 % y no recibe eventos de puntero.

### Inputs / Fields

Los campos usan superficie blanca, borde gris y radio sm. Al pasar el puntero el borde toma el color de texto secundario al 50 %; el foco cambia el borde a verde y añade un anillo de 1 px. Mantener etiquetas visibles; el placeholder es información secundaria.

### Cards / Containers

El contenedor genérico tiene borde y 16 px de relleno. La tarjeta de propiedad elimina el borde y usa 20 px de relleno interior, que pasan a 24 px en sm. Presenta foto, precio, ubicación y características antes del título y tipo. El botón de favoritos es independiente del enlace de la tarjeta. Una foto ausente muestra un estado explícito.

### Chips

Badge es una cápsula con borde gris, texto de 12 px y peso 500. No atribuirle un estado seleccionado que el componente no implementa.

### Navigation

La cabecera fija conserva marca y enlaces visibles, permite saltos de línea y marca la ruta activa con fondo gris claro. El acceso a sesión usa una cápsula grafito. El contenido de navegación depende de la sesión y del rol; conservar esas diferencias al reutilizar el diseño.

### Brand

Mantener el símbolo abierto y su esquina verde junto a la palabra lime. El SVG es decorativo dentro de una marca con nombre accesible; el enlace de inicio proporciona el destino accesible.

## Do's and Don'ts

### Do:
- Do usar los tokens compartidos para color, radio y tipografía.
- Do mantener los precios y las fotografías como información principal de las tarjetas.
- Do comprobar el diseño a 390 px y 1440 px, con teclado y movimiento reducido.
- Do conservar los estados de carga, vacío, error y fotografía ausente.

### Don't:
- Don't reintroducir la identidad editorial anterior como norma del frontend.
- Don't copiar logotipos ni activos propietarios de Apple.
- Don't presentar el acento lima como una preferencia confirmada del usuario.
- Don't inventar métricas, testimonios o garantías para completar una composición.

