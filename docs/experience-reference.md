# Referencia de experiencia de nowarfy

## Principio

nowarfy puede tomar como referencia la claridad de navegación, la reproducción directa, las filas de descubrimiento, la cola persistente y la continuidad de escucha presentes en servicios como Spotify y YouTube Music. La implementación debe conservar una identidad propia: no se copian marcas, logotipos, textos, código, assets, layouts pixel a pixel ni contenido protegido.

## Traducción a nowarfy

| Patrón de experiencia | Implementación propia en nowarfy |
|---|---|
| Entrada visual por colecciones | Cinco estaciones circulares: Relax, Focus, Workout, Energize y Sleep, cada una con arte propio y Play interno. |
| Descubrimiento por filas | Filas “Más escuchado”, “Recomendados” y “Seguí vos”, alimentadas únicamente por pistas reproducibles del catálogo real o por la cola local. |
| Reproducción inmediata | Al seleccionar una estación se inicia la primera pista reproducible disponible; si no existe, la interfaz informa la falta de audio y no inventa un Play. |
| Cola persistente | La cola se guarda localmente, muestra licencia y atribución, y prepara pistas siguientes antes de que termine la actual. |
| Continuidad | `onEnded` consume la cola anticipada y busca una pista similar solo dentro de resultados que tengan audio autorizado. |
| Inmersión | Full Signal y el visualizador Canvas/WebGL son componentes propios, con fallback y reduced motion. |

## Límites de legalidad y datos

MusicBrainz y Cover Art Archive sirven para metadatos y carátulas, no para inventar reproducción. Jamendo y Audius solo entregan pistas al cliente después de que existe una URL de audio y `probePlayableStream` la valida. Spotify se utiliza únicamente para metadatos y previews autorizadas cuando la API las proporciona; no se intenta convertirlo en un reproductor completo ni eludir restricciones.

Las filas pueden quedar vacías cuando las fuentes no responden. Ese estado es preferible a presentar canciones sin stream o crear datos de demostración que parezcan contenido real. La caché local conserva metadatos y URLs, nunca archivos de audio.

## Próxima prioridad técnica

La prioridad siguiente es mejorar la estabilidad de las fuentes y la observabilidad de los streams, no sumar controles decorativos. Deben medirse timeout, proveedor, status, content-type y motivo de descarte. Una fuente nueva solo se incorporará si ofrece stream directo, licencia verificable, atribución y una tasa de disponibilidad suficiente.
