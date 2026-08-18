
## Despliegue en Vercel

El repositorio incluye una configuración específica para Vercel. `vercel.json` sirve la SPA compilada en `dist/public`, enruta `/api/*` al entrypoint serverless `api/index.ts` y mantiene el fallback de rutas del frontend hacia `index.html`. El entrypoint reutiliza Express, tRPC, OAuth y el proxy de almacenamiento sin abrir un puerto TCP, que es el comportamiento requerido por las funciones de Vercel.

En Vercel, importá el repositorio y conservá la raíz del proyecto en `/`. El comando de build debe quedar como `pnpm run build:vercel`; el directorio de salida es `dist/public`. No uses `pnpm run build` como comando de Vercel, porque ese comando también genera el servidor standalone utilizado por el hosting administrado de Manus.

Antes del primer deployment, cargá las variables de entorno del proyecto en los entornos `Production`, `Preview` y `Development` según corresponda. Las variables del servidor incluyen `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` y `JAMENDO_CLIENT_ID`. Las variables públicas que empiezan con `VITE_` se inyectan durante el build: `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_APP_TITLE`, `VITE_APP_LOGO`, `VITE_ANALYTICS_ENDPOINT` y `VITE_ANALYTICS_WEBSITE_ID`.

Si se usa OAuth, la URL pública de Vercel debe estar incluida en la configuración del proveedor correspondiente. El callback de Manus utiliza `/api/oauth/callback`; para el dominio `nowarfy.vercel.app`, la URL de callback debe apuntar a `https://nowarfy.vercel.app/api/oauth/callback`, siempre que ese dominio sea el definitivo.

Para una comprobación local del build estático se puede ejecutar `pnpm run build:vercel`. Para la validación completa del proyecto se deben ejecutar `pnpm exec tsc --noEmit` y `pnpm test -- --run`. El hosting administrado de Manus continúa utilizando `pnpm run build` y no depende de esta configuración Vercel.
