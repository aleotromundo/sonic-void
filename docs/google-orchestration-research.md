# Evaluación de Google/YouTube como orquestador de nowarfy

La YouTube Data API permite buscar recursos de YouTube y recuperar metadata de videos, canales y playlists mediante `search.list`; la documentación oficial indica que la búsqueda identifica recursos y que la consulta tiene un coste de cuota por llamada. [1]

La YouTube IFrame Player API permite incrustar un reproductor oficial, cargar videos por ID, reproducirlos, pausar, controlar volumen y recibir eventos de estado. [2] Esto no equivale a obtener una URL de audio para alimentar el elemento `<audio>` de nowarfy. La integración sería un reproductor embebido separado, con las reglas visuales y funcionales de YouTube.

Las políticas oficiales exigen que los clientes de YouTube sean transparentes, mantengan enlaces a los términos de YouTube, respeten la privacidad y no creen mecanismos que eludan el reproductor oficial o las restricciones del servicio. [3]

## Decisión

Google/YouTube puede evaluarse como **fuente de descubrimiento y metadata**, o como un carril opcional de reproducción mediante el reproductor IFrame oficial. No debe utilizarse como proveedor de URLs de audio, extractor, proxy de streams ni sustituto sin publicidad del reproductor de YouTube.

Para la continuidad principal de nowarfy conviene mantener una orquestación de audio basada en Spotify previews autorizadas, Jamendo y Audius, con `probePlayableStream`, circuit breaker, caché de metadatos y selección anticipada. Si se agrega YouTube, debe estar claramente separado como “Video oficial” y no mezclarse con la cola de audio interna salvo que el usuario acepte el reproductor oficial.

## Referencias

[1]: https://developers.google.com/youtube/v3/docs/search/list — YouTube Data API: search.list.
[2]: https://developers.google.com/youtube/iframe_api_reference — YouTube IFrame Player API.
[3]: https://developers.google.com/youtube/terms/developer-policies — YouTube API Services Developer Policies.
