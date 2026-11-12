---
name: Lime
description: Identidad minimalista para explorar propiedades con claridad.
colors:
  background: "#f5f5f7"
  surface: "#ffffff"
  foreground: "#1d1d1f"
  muted-foreground: "#65656b"
  border: "#dcdce1"
  primary: "#9fe03a"
  primary-hover: "#8ccf24"
  primary-foreground: "#1d1d1f"
  lime-wash: "#f1f8e4"
  footer: "#1d1d1f"
  footer-foreground: "#b9b9bd"
  accent: "#d5eeaa"
  accent-foreground: "#1d1d1f"
  accent-ink: "#527a24"
  danger: "#b72e35"
  warning: "#b25e09"
  brand-lime: "#9fe03a"
  brand-rind: "#5b9a17"
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

La calma visual surge del espacio, de una jerarquía breve y de controles familiares. El usuario pidió que el lima resalte más: el lima vivo es el color de la acción y de la región de marca, sobre una base de blancos, grises y grafito. Este documento es la referencia visual del frontend; los valores normativos están en el frontmatter y se corresponden con el código actual.

**Key Characteristics:**
- Superficies claras, texto grafito y lima vivo para actuar.
- Una sola familia tipográfica: Inter.
- Fotografías protagonistas y datos fáciles de comparar.
- Logo propio: media rodaja de lima bajo un techo, que se lee como casa.
- Movimiento breve y profundidad discreta.

## Colors

### Primary

El lima vivo (`primary`) es el color de las acciones primarias, siempre con texto grafito en peso 600 (10.6:1). Al pasar el puntero se profundiza a `primary-hover`; no usar opacidad, que lo lava. El lima suave (`accent`) marca la ruta activa de la navegación, los avisos publicados y la selección de texto; el verde de contraste (`accent-ink`) identifica enlaces y foco.

### Brand

El símbolo usa `brand-lime` para la pulpa y `brand-rind` para la cáscara. `brand-lime` también se usa como superficie de pequeños elementos de marca: la etiqueta de operación sobre la foto de cada tarjeta, el contador y el corazón de favoritos, y el resaltador bajo la palabra clave del título de inicio (`.lime-highlight`). Nunca como color de texto.

### Regiones

`lime-wash` tiñe el hero de inicio: es la única región de color amplia y lleva el buscador sobre una tarjeta blanca con sombra verdosa. El pie usa `footer` (grafito) con texto `footer-foreground` y el símbolo con techo blanco; sus enlaces pasan a lima al pasar el puntero.

### Neutral

El fondo gris frío separa las zonas de contenido de las superficies blancas. El grafito sostiene los títulos y precios; el gris secundario acompaña metadatos y descripciones; el borde gris delimita campos y contenedores.

Los tokens danger y warning se reservan para estados semánticos. La hoja global conserva un modo oscuro opt-in mediante la clase dark, sin selector visible; sus valores heredados no constituyen una segunda identidad aprobada. El sistema documentado aquí es el claro.

**The Contrast Rule.** El lima es fondo, nunca texto: lleva texto grafito encima. Para texto acentuado sobre blanco o `lime-wash`, usar verde de contraste (4.6:1 sobre `lime-wash`).

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

El símbolo de Lime es media rodaja de lima bajo un techo a dos aguas de trazo redondeado: la silueta completa se lee como una casa. La pulpa se divide en gajos por cortes transparentes y la cáscara la rodea, separada por una franja vacía; el techo se recorta de la fruta con un margen libre. Es un SVG original con máscara; el techo usa `currentColor` para adaptarse al modo oscuro. Acompaña la palabra lime en minúsculas. El símbolo ocupa 32 px y el nombre 1.6 rem, con peso 600 y espaciado de -0.04 em. Usar el componente Brand (o BrandMark para el símbolo solo) como fuente de la marca; `public/brand/lime-mark.svg` y `public/favicon.svg` son sus copias estáticas.

## Components

### Buttons

La variante primaria usa lima vivo con texto grafito semibold; secondary añade un borde; ghost conserva el fondo transparente; link usa verde y subrayado al pasar el puntero. El tamaño base tiene 44 px de alto. El primario se profundiza a `primary-hover` al pasar el puntero; secondary y ghost toman el color de borde al 40 %. El foco del botón usa un anillo de 2 px con separación de 2 px. El estado deshabilitado usa opacidad de 50 % y no recibe eventos de puntero.

### Inputs / Fields

Los campos usan superficie blanca, borde gris y radio sm. Al pasar el puntero el borde toma el color de texto secundario al 50 %; el foco cambia el borde a verde y añade un anillo de 1 px. Mantener etiquetas visibles; el placeholder es información secundaria.

### Cards / Containers

El contenedor genérico tiene borde y 16 px de relleno. La tarjeta de propiedad elimina el borde y usa 20 px de relleno interior, que pasan a 24 px en sm. Presenta foto, precio, ubicación y características antes del título y tipo. La operación (Venta, Alquiler, Alquiler temporario) va como cápsula lima arriba a la izquierda de la foto, dentro del enlace. El botón de favoritos es independiente del enlace de la tarjeta. Una foto ausente muestra un estado explícito.

### Chips

Badge es una cápsula con borde gris, texto de 12 px y peso 500. No atribuirle un estado seleccionado que el componente no implementa.

### Navigation

La cabecera fija conserva marca y enlaces visibles, permite saltos de línea y marca la ruta activa con fondo lima suave. El acceso a sesión usa una cápsula lima vivo. El contenido de navegación depende de la sesión y del rol; conservar esas diferencias al reutilizar el diseño.

### Brand

Mantener el techo y la media rodaja juntos, sin separar ni recolorear sus partes, junto a la palabra lime. El SVG es decorativo dentro de una marca con nombre accesible; el enlace de inicio proporciona el destino accesible.

## Do's and Don'ts

### Do:
- Do usar los tokens compartidos para color, radio y tipografía.
- Do mantener los precios y las fotografías como información principal de las tarjetas.
- Do comprobar el diseño a 390 px y 1440 px, con teclado y movimiento reducido.
- Do conservar los estados de carga, vacío, error y fotografía ausente.

### Don't:
- Don't reintroducir la identidad editorial anterior como norma del frontend.
- Don't copiar logotipos ni activos propietarios de Apple.
- Don't esparcir lima como decoración: cada uso es acción, estado, orientación o la región del hero.
- Don't inventar métricas, testimonios o garantías para completar una composición.

