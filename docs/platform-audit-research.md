# Auditoría comparativa de plataformas de música

## Hallazgos verificados

### Spotify

La documentación oficial describe **Spotify Radio** como una colección de canciones basada en cualquier artista, álbum o canción, que se actualiza para mantenerse fresca y ayudar a continuar el estado de ánimo. También permite guardar una radio de artista, álbum o canción en la biblioteca como playlist. Fuente: [Spotify Radio](https://support.spotify.com/us/article/spotify-radio/).

Spotify también documenta letras para usuarios gratuitos y Premium, aunque aclara que la disponibilidad depende del mercado, dispositivo, acuerdos con titulares de derechos y cobertura de cada canción. Fuente: [Spotify Lyrics](https://support.spotify.com/us/article/lyrics/).

**Patrón transferible a nowarfy:** cualquier pista, estación o resultado debería poder convertirse en una sesión persistente; la cola debe anticipar la continuidad; la UI debe distinguir entre metadata disponible, audio reproducible y letras disponibles.

### YouTube Music

La ayuda oficial describe mixes personalizados generados a partir de artistas y canciones recientes, con actualización diaria. También permite crear mixes seleccionando artistas y ajustar variedad de artistas, nivel de descubrimiento y filtros como BPM, popularidad y estado de ánimo. Durante la reproducción, el usuario puede modificar la cola mediante categorías desde “Up Next”. Fuente: [YouTube Music Custom Mix](https://support.google.com/youtubemusic/answer/15165061?hl=en).

**Patrón transferible a nowarfy:** reemplazar filtros rígidos por controles de intención de radio: familiaridad frente a descubrimiento, variedad de artistas, energía/BPM aproximado y mood, aplicados solamente a pistas verificadas.

## Restricciones importantes

Las plataformas comerciales combinan catálogos licenciados, algoritmos propietarios, cuentas sincronizadas y acuerdos de derechos. nowarfy puede adoptar patrones de interacción —radio desde una semilla, cola anticipada, historial local, favoritos, letras sincronizadas, visualizador y navegación por filas— pero no debe reutilizar logos, código, contenido protegido ni hacer pasar catálogos externos como propios.

## Próximas fuentes a revisar

- Deezer Flow: https://www.deezer.com/explore/en-us/features/flow/
- SoundCloud Stations: https://help.soundcloud.com/hc/en-us/articles/115003565208-Stations-and-how-they-work
- Bandcamp Fans: https://bandcamp.com/fans
- Apple Music Radio: https://support.apple.com/guide/music/listen-to-radio-stations-in-music-mus0456fe22/mac
- Openverse API: https://api.openverse.org/

## Criterios de auditoría para nowarfy

Se evaluarán búsqueda instantánea y ranking, radio desde cualquier semilla, cola y reproducción continua, historial y biblioteca, letras y carátulas, estados de disponibilidad, resiliencia ante fuentes caídas, accesibilidad, responsive, rendimiento, despliegue Manus/Vercel y trazabilidad de licencia/atribución.

### Deezer Flow

Deezer presenta Flow como una mezcla infinita de favoritos y descubrimientos, con modos por estado de ánimo o género. Su documentación de producto indica que analiza historial, favoritos y señales negativas como saltos o bloqueos para construir recomendaciones, y que el usuario puede ajustar sus preferencias y el nivel de descubrimiento. Fuente: [Deezer Flow](https://www.deezer.com/explore/en-us/features/flow/).

**Patrón transferible a nowarfy:** incorporar señales positivas y negativas explícitas en la persistencia local —favorito, “no volver a sugerir”, skip y energía preferida— y usar esos datos para ordenar la cola, sin necesidad de un modelo propietario.

### YouTube Music

YouTube Music permite crear mixes personalizados a partir de artistas elegidos y ajustar variedad de artistas, nivel de descubrimiento y filtros como BPM, popularidad y estado de ánimo. También permite cambiar categorías de la cola desde “Up Next”. Fuente: [YouTube Music Custom Mix](https://support.google.com/youtubemusic/answer/15165061?hl=en).

**Patrón transferible a nowarfy:** la radio debe ofrecer un panel “Afinar señal” no invasivo, con controles de variedad, descubrimiento y mood, y recalcular solamente sobre candidatos legales y reproducibles.

### SoundCloud Stations

SoundCloud describe Stations como un flujo largo de audio relacionado con una pista favorita. La estación puede iniciarse desde cualquier pista, término de búsqueda o biblioteca, y las estaciones recientes quedan disponibles en la biblioteca junto a Likes y playlists. Fuente: [SoundCloud Stations](https://help.soundcloud.com/hc/en-us/articles/115003565208-Stations-and-how-they-work).

**Patrón transferible a nowarfy:** ofrecer “Iniciar señal” desde cada tarjeta, búsqueda y pista en reproducción; guardar las señales recientes localmente y permitir retomarlas desde “Seguí vos”.

### Bandcamp

Bandcamp destaca streaming móvil de compras, colas y playlists para escucha continua, wishlist, seguimiento de artistas y un feed con actividad de artistas y fans seguidos. También enfatiza la relación directa entre fans y artistas. Fuente: [Bandcamp for Fans](https://bandcamp.com/fans).

**Patrón transferible a nowarfy:** separar claramente favoritos, cola, “guardado para después” y estaciones seguidas; mostrar atribución y enlace de origen, pero mantener Play como acción primaria dentro del sitio. Para contenido no reproducible no se debe crear una falsa tarjeta de audio: debe aparecer como metadata o quedar fuera de las filas reproducibles.

### Apple Music

La guía oficial de Apple Music destaca playlists personalizadas, letras sincronizadas, fijar canciones en la biblioteca, búsqueda por canción/artista/álbum/letras y biblioteca accesible entre dispositivos. También documenta escucha sincronizada mediante SharePlay. Fuente: [Apple Music User Guide](https://support.apple.com/guide/music/welcome/mac).

**Patrón transferible a nowarfy:** ampliar la búsqueda para aceptar letras como intención futura, diferenciar “fijar” de favorito, conservar una biblioteca local coherente y hacer que el reproductor sea el centro de continuidad; la sincronización multiusuario queda fuera del primer alcance porque requiere cuentas y un backend persistente.
