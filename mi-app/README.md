# Aplicación Lime

Ver [README principal](../README.md) para alcance, Figma, rutas y contratos.

## Desarrollo y compilación

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

`build` genera `dist/`. Un servidor de producción debe devolver `index.html` para las rutas de React Router que no correspondan a archivos estáticos.

## Datos estáticos y API real

Por defecto se usa `src/api/mock.js`. Los componentes acceden a `apiFetch` y conservan las mismas rutas, métodos y cuerpos del backend. La simulación implementa respuestas 400, 401, 403, 404 y 409 para los casos principales y devuelve las operaciones asíncronamente.

Para iniciar la integración real, crear `.env.local`:

```dotenv
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8080
```

El transporte HTTP envía el token Bearer, soporta JSON y multipart de imágenes, y maneja respuestas vacías 204 y Problem Details. La integración real requiere iniciar Java, configurar SQL Server y habilitar el origen del frontend en CORS. Los datos mock no se sincronizan con Java; sus cuentas y tokens no sirven en modo real.

## Pruebas

- `tests/mock.test.js`: comportamientos del adaptador y contratos de datos.
- `tests/registration.test.js`: validación del formulario de registro.
- `tests/flows.test.jsx`: flujos con React y el adaptador real de datos ficticios. Solo se reemplaza la lectura HTTP por los mismos JSON del disco; no se simulan las respuestas de negocio.

Las pruebas de React usan jsdom. La revisión visual se hace además en navegador, en escritorio y móvil. Fotos elegidas por el usuario solo se guardan en su demostración local; el mock no las sube a un servidor.
