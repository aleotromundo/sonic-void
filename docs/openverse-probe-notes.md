# Notas de validación Openverse

La consulta `https://api.openverse.org/v1/audio/?q=music&page_size=12&filter_dead=true&extension=mp3,ogg,wav,m4a&mature=false` devuelve 240 resultados indexados, pero el lote observado estuvo compuesto principalmente por previews de Freesound como `https://cdn.freesound.org/previews/369/369147_5121236-hq.mp3`, que responden 403 desde el entorno de servidor.

Una URL Jamendo indexada por Openverse, `https://prod-1.storage.jamendo.com/?trackid=345141&format=mp32`, respondió `200 audio/mpeg` por HEAD y `206 audio/mpeg` por GET Range. El probe directo tardó aproximadamente 2,1 segundos.

La validación anterior de Openverse usaba 2.500 ms por pista y podía descartar streams legales lentos. Se ajustó solamente Openverse a 5.000 ms, conservando HTTPS obligatorio, MIME de audio, HEAD con fallback Range, límites de respuesta y exclusión de errores HTTP. El diagnóstico aislado posterior devolvió 12 pistas validadas en el proceso local, sin relajar el criterio de Play.

El contador sigue representando pistas reproducibles, no los 240 resultados indexados. Freesound no debe mostrarse como audio reproducible cuando su preview responde 403.
