# Auditoría de coherencia de nowarfy — 18 de agosto de 2026

## Resultado general

La dirección actual es coherente con lo conversado: la home abre con cinco estaciones circulares —Relax, Focus, Workout, Energize y Sleep—, las filas inferiores son Más escuchado, Recomendados y Seguí vos, y cada acción de reproducción pasa por una pista con `previewUrl`. La interfaz conserva la identidad Sonic//Void y usa referencias de interacción de Spotify/YouTube Music sin copiar marcas ni assets.

## Consistencias verificadas

| Área | Verificación | Resultado |
|---|---|---|
| Entrada principal | Cinco círculos con arte propio y selección de sesión | Consistente |
| Catálogo | Solo pistas con audio reproducible en grillas y filas | Consistente |
| Fuente | Licencia, atribución y proveedor se conservan en los objetos de pista | Consistente |
| Player | Volumen, silencio, Media Session, siguiente/anterior y reproducción continua | Consistente |
| Cola | Cola local y cola anticipada antes de `ended` | Consistente |
| Letras | LRCLIB complementa una pista; no se usa como fuente de audio | Consistente |
| Full Signal | Visible en el reproductor y con fallback Canvas/WebGL | Consistente |
| Resiliencia | `probePlayableStream` y circuit breaker para Jamendo/Audius | Implementado localmente |
| Estado de fuentes | HUD lateral muestra Jamendo/Audius como listos, pausados o con latencia | Implementado localmente |
| Legalidad | No se inventan previews, reseñas, artistas, licencias ni historial | Consistente |

## Inconsistencias o riesgos que siguen abiertos

La home puede quedar con filas vacías cuando Jamendo y Audius no responden; esto es técnicamente honesto, pero la disponibilidad musical real sigue siendo insuficiente. MusicBrainz y Cover Art Archive continúan siendo fuentes de metadatos, no de audio.

El dominio público de Vercel todavía debe confirmarse contra el nuevo commit. El panel consultado mostró temporalmente `c160b15` como Production Deployment mientras el deployment de `cbd07df0` estaba en `Building`; no se debe afirmar que Vercel está actualizado hasta que el nuevo deployment figure como `Ready` y la búsqueda `/api/trpc` responda.

La expansión periódica del catálogo todavía no debe ejecutarse como tarea infinita. La base disponible es una caché local de metadatos y lotes limitados por estación; falta decidir si la actualización controlada se hará con un runtime persistente o con un mecanismo de ejecución programada compatible con el proyecto.

## Validación local

TypeScript pasó y Vitest quedó en 48 pruebas aprobadas con 3 pruebas externas opt-in omitidas. La captura local muestra la jerarquía visual prevista y el HUD de fuentes sin romper el layout. Los mensajes de logs indican que Audius/Jamendo pueden abrir circuito después de timeouts; esto evita bloqueos repetidos, pero no crea audio donde el proveedor no responde.

## Capturas del pulido

Las capturas local de escritorio y móvil mantienen los cinco círculos dentro del hero, las tres filas en orden y la línea de reproducción fija sin desbordar el viewport. En móvil, la navegación lateral se oculta correctamente, las tarjetas de accesos rápidos se apilan y el player permanece visible al final. Las cinco artes se cargan localmente desde las rutas persistentes nuevas; Vercel debe volver a verificarse después del siguiente push.

## Verificación de despliegue posterior al pulido

El push de `c1013d9e` llegó correctamente a `aleotromundo/sonic-void` en `main`. En Vercel, el panel consultado después del push todavía muestra `cbd07df` como Production Deployment en estado Ready; por lo tanto, no se debe afirmar que c1013d9e ya esté en producción. El dominio `nowarfy.vercel.app` carga la SPA, muestra los cinco botones de estación, las filas y Full Signal, pero la confirmación textual no permite verificar el arte de cada círculo en esta consulta.

Vercel registra 605 edge requests, 192 invocaciones y una tasa de error histórica del 100 %. Ese dato debe tratarse como observabilidad acumulada y no como prueba aislada de que la SPA actual esté caída; falta revisar el endpoint tRPC y los logs del deployment nuevo cuando Vercel lo detecte.

## Rediseño de esferas y catálogo visible

Las capturas desktop y móvil muestran las cinco esferas centradas en el hero y una sección `Música disponible ahora` con contador visible. La interacción táctil está implementada sobre el contenedor orbital mediante Pointer Events y conserva botones individuales accesibles. En el estado actual de las fuentes, el contador muestra 0 y la lista informa que espera audio validado; esto es correcto y honesto, pero evidencia que la mejora de cantidad musical depende de que Jamendo/Audius respondan o de integrar otra fuente autorizada.
