# Auditoría Vercel — 2026-08-18

URL revisada: https://vercel.com/agradecidos-projects/nowarfy

El proyecto Vercel está conectado al repositorio privado https://github.com/aleotromundo/sonic-void, rama `main`. La producción todavía muestra como Source el commit `9abbb23` (checkpoint anterior), aunque el repositorio ya recibió el commit `c160b15` y el panel muestra un deployment nuevo en estado `Building` asociado al checkpoint de filtros/probe. El dominio de producción es https://nowarfy.vercel.app y el deployment visible anterior es `nowarfy-4gteetnp7-agradecidos-projects.vercel.app`.

El panel de Observability muestra 151 invocaciones y una tasa de error del 100 %, dato que requiere revisar en Logs después de que termine el deployment. El proyecto reconoce `main`, pero el dominio público inspeccionado antes de este audit todavía servía la interfaz vieja con las tarjetas Afterglow/Neon Focus/Riot Frequency y filtros anteriores; es posible que estuviera sirviendo el deployment anterior mientras el nuevo build estaba en curso.

El panel de Vercel ofrece Deployment Settings, Deployments, Logs y Environment Variables. No se modificó configuración ni se inició ninguna operación sensible durante esta auditoría.

Fuente externa: página pública autenticada de Vercel, consultada el 2026-08-18.
