# Auditoría de nowarfy frente a plataformas de música

## Propósito y alcance

Esta auditoría compara patrones de producto documentados por Spotify, YouTube Music, Deezer, SoundCloud, Bandcamp y Apple Music con la implementación actual de nowarfy — Sonic//Void Radio. La comparación se limita a **patrones de interacción y arquitectura de experiencia**. No propone copiar marcas, código, assets, algoritmos propietarios ni catálogos protegidos.

La conclusión principal es que nowarfy ya tiene la dirección visual correcta —radio, cinco señales, cola persistente, visualizador, carátulas y atribución— pero todavía funciona más como un **prototipo de agregación de fuentes** que como una radio continua. El problema más grande no es la cantidad de pantallas: es la confiabilidad del primer play, la continuidad de la cola y la claridad de qué está disponible.

## Qué hacen las plataformas de referencia

| Área | Patrón observado | Fuente | Adaptación legal para nowarfy |
|---|---|---|---|
| Radio | Spotify genera radio desde artista, álbum o canción y permite guardarla en biblioteca. | [Spotify Radio][1] | Crear una señal desde cualquier pista, búsqueda o estación; guardar semilla y estado local. |
| Mix personalizado | YouTube Music usa artistas recientes y permite ajustar variedad, descubrimiento, BPM, popularidad y mood. | [YouTube Music Custom Mix][2] | Añadir “Afinar señal” con variedad, descubrimiento y mood aplicados solo a pistas reproducibles. |
| Feedback | Deezer Flow usa historial, favoritos, saltos y bloqueos para mejorar una mezcla infinita. | [Deezer Flow][3] | Persistir play, skip, favorito y “no sugerir”; ordenar candidatos por señales explicables. |
| Station seed | SoundCloud permite iniciar una estación desde cualquier pista, búsqueda o biblioteca y retomar estaciones recientes. | [SoundCloud Stations][4] | Mostrar “Iniciar señal” en cada tarjeta, búsqueda y reproductor; guardar estaciones recientes. |
| Biblioteca | Bandcamp separa colección, wishlist, follows, feed, cola y playlists, con foco en artistas independientes. | [Bandcamp for Fans][5] | Separar favoritos, “guardar para después”, historial y playlists; mantener atribución visible. |
| Letras y búsqueda | Apple Music combina búsqueda por canción, artista, álbum o letra con letras sincronizadas y biblioteca. | [Apple Music User Guide][6] | Mantener LRCLIB como capa sincronizada, y preparar búsqueda por letra sin afirmar cobertura total. |
| Disponibilidad | Spotify aclara que letras y funciones pueden variar por mercado, dispositivo y acuerdos de derechos. | [Spotify Lyrics][7] | Exponer estados “audio validado”, “metadata solamente”, “letra no encontrada” y fuente/licencia. |

## Auditoría de nowarfy

| Flujo | Estado actual | Falla o riesgo | Prioridad |
|---|---|---|---|
| Primer vistazo | Hero con cinco esferas y filas tipo radio. | En frío puede quedar con `0` pistas mientras Openverse y estaciones esperan; la experiencia parece rota aunque una fuente responda después. | P0 |
| Primer Play | El reproductor, Media Session, volumen, mute y cola existen. | La disponibilidad depende de probes externos inestables; una fuente con 403/timeout puede dejar señales sin acción inmediata. | P0 |
| Continuidad | Hay cola local y cola anticipada basada en artista/álbum/palabras compartidas. | Falta una capa de historial y feedback negativo; la radio no aprende de skips o pistas fallidas. | P0 |
| Descubrimiento | Openverse, Jamendo, Audius y ccMixter tienen adaptadores y circuit breaker. | Openverse puede devolver resultados indexados pero no streams accesibles desde el entorno; no hay caché persistente de metadata validada y el catálogo caliente es dependiente del proceso. | P0 |
| Biblioteca | Favoritos, cola y playlists viven en localStorage. | No hay historial separado, estaciones recientes, “no recomendar” ni “guardar para después”; los IDs de favoritos/cola pueden colisionar entre fuentes si coinciden. | P1 |
| Radio configurable | Hay cinco estaciones con queries fijas. | No hay controles de variedad, descubrimiento, mood o energía; la personalización es más visual que funcional. | P1 |
| Búsqueda | Existe búsqueda instantánea, ranking y fallbacks. | La búsqueda mezcla metadata con audio y depende de requests batched; las fuentes lentas pueden retrasar la sensación de respuesta. | P1 |
| Letras | LRCLIB y línea sincronizada están integradas. | La cobertura es parcial y los estados deben mantenerse honestos; no conviene usar letras de una fuente no verificable. | P1 |
| Atribución | Las tarjetas y cola muestran fuente/licencia/atribución. | La lista principal debe mantener estos datos también en detalles, historial y playlists; no se debe mostrar como reproducible algo que perdió su URL. | P1 |
| Visuales | Canvas, Full Signal y Butterchurn están presentes. | Deben degradar con gracia cuando no hay CORS/AudioContext y no bloquear el Play. | P2 |
| Despliegue | Manus refleja cambios; Vercel tenía producción en `c1013d9` y falló `8dbaf87`. | La configuración de runtime inválida impidió que el nuevo deployment llegara a producción; debe verificarse después del commit de corrección `f53ee59`. | P0 |

## Roadmap priorizado

### P0 — hacer que parezca una radio confiable

Primero hay que separar **metadata descubierta** de **audio reproducible**, mostrar un estado de carga no bloqueante y conservar en caché solo pistas que hayan pasado el probe. La home debe cargar el catálogo reproducible antes de disparar las consultas de estaciones secundarias. Si no hay pistas en frío, debe existir un estado de reintento explícito y no una pantalla que parezca vacía indefinidamente.

El reproductor debe registrar cada reproducción, error y skip. Cuando termina una pista, la siguiente debe salir de una cola ya preparada; si la cola queda vacía, debe hacer una nueva búsqueda usando la semilla actual y no detenerse silenciosamente.

### P1 — darle memoria a la radio

Agregar historial local con fecha de última reproducción, contador, skips y errores; estaciones recientes; acción “no recomendar”; y un panel compacto para ajustar descubrimiento y variedad. El ranking debe ser explicable: favoritos y artistas repetidos suben, skips y errores bajan, y la diversidad evita repetir la misma fuente o artista consecutivamente.

La biblioteca debe diferenciar IDs como `source:id`, porque un identificador igual en dos proveedores no representa necesariamente la misma pista. Las playlists deben conservar snapshot de metadata, licencia, atribución y URL validada para que sigan siendo honestas aunque una API externa cambie.

### P2 — profundidad del producto

Después de estabilizar Play y continuidad, se pueden agregar búsqueda por letra, filtros de duración y energía aproximada, historial visual, reordenamiento manual de cola, importación de listas propias sin copiar audio y una vista de procedencia por pista. El visualizador debe permanecer como una capa de expresión, no como requisito de reproducción.

## Primera implementación recomendada

El primer bloque técnico debe ser pequeño y medible: **historial local + feedback de reproducción + radio reciente + ranking de “Seguí vos”**. El éxito se mide por cuatro condiciones: una pista reproducida aparece en historial; un skip no reaparece inmediatamente; “Seguí vos” deja de ser solamente la cola actual; y ningún elemento marcado reproducible carece de URL, licencia y atribución.

## Límites que no se deben prometer

No es realista prometer “millones de canciones reproducibles” solo por indexar fuentes abiertas. Openverse puede indexar audio con licencias abiertas, pero cada URL depende del proveedor original y puede responder 403, rate limit, CORS o timeout. La métrica honesta para nowarfy debe distinguir **resultados indexados**, **licencia identificada** y **pistas reproducibles ahora**.

## Referencias

[1]: https://support.spotify.com/us/article/spotify-radio/ "Spotify Radio"
[2]: https://support.google.com/youtubemusic/answer/15165061?hl=en "YouTube Music Custom Mix"
[3]: https://www.deezer.com/explore/en-us/features/flow/ "Deezer Flow"
[4]: https://help.soundcloud.com/hc/en-us/articles/115003565208-Stations-and-how-they-work "SoundCloud Stations"
[5]: https://bandcamp.com/fans "Bandcamp for Fans"
[6]: https://support.apple.com/guide/music/welcome/mac "Apple Music User Guide"
[7]: https://support.spotify.com/us/article/lyrics/ "Spotify Lyrics"
