# Letras sincronizadas con LRCLIB

Sonic//Void consulta LRCLIB exclusivamente desde el backend mediante `GET /api/get`. La aplicación envía nombre, artista, álbum y duración cuando están disponibles, además de un User-Agent identificable. La duración se convierte de milisegundos del modelo de pista a segundos para mejorar la coincidencia.

El backend convierte `syncedLyrics` en líneas `{ timeMs, text }`, ordenadas por timestamp. La barra Winamp calcula la línea activa con el tiempo actual del elemento `audio` y la muestra encima de los controles mientras se reproduce una preview autorizada. El detalle de la canción muestra el texto completo devuelto por LRCLIB con saltos de línea preservados.

Los estados visibles son `available`, `not_found`, `instrumental`, `rate_limited` y `unavailable`. Si no hay preview de audio, las letras pueden consultarse en el detalle, pero la línea no avanzará porque no existe progreso de reproducción local. Si LRCLIB responde 429, el backend devuelve un estado seguro y la interfaz no repite automáticamente la consulta de forma agresiva.

LRCLIB se usa como fuente independiente de Spotify, MusicBrainz y Cover Art Archive. La disponibilidad de una letra no implica autorización universal para redistribuir cualquier catálogo comercial; el producto debe conservar la atribución y revisar las condiciones aplicables antes de una publicación pública o comercial.

Referencia: [LRCLIB API documentation](https://lrclib.net/docs).
