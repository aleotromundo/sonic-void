# Evaluación de downloaders y clientes no oficiales

## Decisión de alcance

Los repositorios sugeridos son útiles para estudiar **metadata, matching, colas, interfaces y empaquetado**, pero no deben convertirse en una fuente de audio para nowarfy. Descargar desde YouTube/Spotify y servir ese audio dentro de una web distinta requiere autorización y puede incumplir términos de servicio o derechos de los titulares. La regla del proyecto sigue siendo: **solo Play interno para streams autorizados, con licencia y atribución verificables**.

## Hallazgos verificados

| Proyecto | Función observada | Valor técnico reutilizable | Decisión para nowarfy |
|---|---|---|---|
| [spotDL][1] | Descarga audio desde YouTube cuando encuentra coincidencia usando metadata de Spotify. Su README advierte que el usuario es responsable de las consecuencias legales. | Matching de artista/título, normalización de metadata, carátula, letras y organización de descargas. | No integrar como backend ni descargar audio; reutilizar únicamente ideas de matching y modelo de metadata. |
| [yt-dlp][2] | Downloader de línea de comandos para miles de sitios. | Arquitectura modular de extractores y diagnóstico de errores. | No usar en el servidor ni desplegar extractores para retransmitir audio protegido. |
| [SpotiFlyer][3] | Aplicación multiplataforma orientada a descargas con metadata de servicios musicales. | Separación de UI, cola de trabajos, progreso y persistencia local. | Puede inspirar una cola de tareas local, no la adquisición de audio. |
| [Spowlo][4] | Cliente de descarga Android. | Flujo móvil, selección de calidad y estados de descarga. | Fuera del alcance de la radio web; no copiar flujo de descarga. |
| [sunnify][5] | Downloader con interfaz web opcional, playlists y búsquedas. | Organización de búsquedas y playlists. | No integrar el componente de descarga; sí evaluar patrones de biblioteca. |
| [spotify-dl][6] | Downloader antiguo que delega en herramientas de extracción. | Simplicidad de CLI y mapping de playlist. | No usar por riesgo de mantenimiento, términos y derechos. |
| [librespot][7] | Cliente alternativo de Spotify Connect. | Arquitectura de cliente, sesiones y control remoto. | No usar para extraer, grabar o retransmitir audio; no es una API pública de catálogo libre. |

## Por qué no son una fuente legal automática

La metadata de Spotify no concede derechos sobre el audio. Del mismo modo, que un extractor pueda resolver una URL o que un cliente pueda conectarse no significa que nowarfy tenga permiso para descargar, almacenar o retransmitir la grabación. La arquitectura propuesta por el usuario —metadata de Spotify, audio descargado de YouTube y reproducción dentro del servidor— debe mantenerse fuera del producto.

## Qué sí se incorpora

Se incorporan cuatro patrones seguros: normalización de artista/título para matching; resolución de carátula y letras como metadata separada del audio; una cola de trabajos visible con estados de preparado, reproduciendo, fallido y omitido; y persistencia local de favoritos, historial y playlists. Para el audio se conserva Openverse, Jamendo, Audius y otras fuentes cuyo stream y licencia puedan verificarse individualmente.

## Regla de producto

nowarfy puede mostrar metadata de una obra sin fingir que tiene audio. Solo una pista con `previewUrl`, probe exitoso, licencia y atribución se agrega a las filas reproducibles o a la cola. Las demás quedan como resultado de metadata, si se muestran, con estado explícito y sin botón Play interno.

## Referencias

[1]: https://github.com/spotDL/spotify-downloader "spotDL — Spotify downloader"
[2]: https://github.com/yt-dlp/yt-dlp "yt-dlp — audio/video downloader"
[3]: https://github.com/Shabinder/SpotiFlyer "SpotiFlyer"
[4]: https://github.com/Sorrow446/Spowlo "Spowlo"
[5]: https://github.com/Sunnify/sunnify "sunnify"
[6]: https://github.com/vitiko98/spotify-dl "spotify-dl"
[7]: https://github.com/librespot-org/librespot "librespot"

## Modo personal autorizado

La documentación oficial de Spotify indica que su Web Playback SDK reproduce contenido de Spotify dentro de una aplicación web mediante un dispositivo Spotify Connect local, requiere una suscripción Premium y no debe usarse en proyectos comerciales sin aprobación previa. Fuente: [Spotify Web Playback SDK][8]. Esto permite considerar un reproductor oficial separado para una cuenta del usuario, pero no usar Spotify como una URL MP3 para que el servidor la retransmita ni mezclar su audio en el catálogo abierto.

La documentación oficial de YouTube describe la IFrame Player API como un reproductor embebido que puede cargarse en el sitio y controlarse con JavaScript. Fuente: [YouTube IFrame Player API][9]. Si se eligiera esta vía, el audio tendría que permanecer dentro del reproductor oficial y bajo sus parámetros permitidos; no sería equivalente al `<audio>` interno de nowarfy ni a descargar el stream.

Por lo tanto, el modo personal viable se divide en tres clases: previews o streams autorizados del catálogo abierto, reproductores oficiales embebidos cuando el proveedor los permite, y archivos locales del usuario seleccionados desde su dispositivo. Cada clase debe tener un estado UI distinto y no debe presentarse como una única fuente homogénea.

[8]: https://developer.spotify.com/documentation/web-playback-sdk "Spotify Web Playback SDK"
[9]: https://developers.google.com/youtube/iframe_api_reference "YouTube IFrame Player API"

## Estados del modo personal

La interfaz debe distinguir cuatro estados: `archivo local`, cuando el usuario selecciona un archivo desde su dispositivo y el navegador crea un Object URL temporal; `preview autorizada`, cuando existe un stream externo validado por el backend; `metadata sin audio`, cuando hay información de una obra pero no una URL reproducible; y `fuente no disponible`, cuando el proveedor está caído, bloquea el acceso o no supera el probe. Los archivos locales no se suben al servidor ni se guardan como bytes en localStorage; solo pueden conservarse metadatos de sesión mientras el Object URL sea válido.

El backend no debe recibir rutas locales, aceptar comandos de descarga ni resolver URLs de plataformas como sustituto de una fuente autorizada. La cola persistida conserva únicamente pistas externas que ya tienen licencia, atribución y `previewUrl` verificadas; una selección local queda fuera de esa cola persistida salvo que en el futuro se diseñe un almacenamiento explícito del usuario.
