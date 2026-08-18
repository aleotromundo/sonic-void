# Investigación de fuentes abierta — 18 de agosto de 2026

## Openverse Audio

La documentación oficial de Openverse describe una API de medios con licencia abierta y afirma que indexa más de 800 millones de obras de imagen y audio. También advierte que Openverse no garantiza la exactitud de la licencia y que cada obra debe verificarse antes de usarla. [1]

La API permite buscar `/v1/audio/` con `q`, `page_size`, `filter_dead`, `extension`, `license` y otros parámetros. La documentación indica que el endpoint puede devolver millones de registros relevantes, pero limita la paginación y prohíbe scraping. Las consultas anónimas tienen límites; el acceso autenticado puede aumentar el tamaño de página bajo evaluación. [2]

Una consulta real a `https://api.openverse.org/v1/audio/?q=music&page_size=20&filter_dead=true&extension=mp3,ogg,wav` devolvió HTTP 200, `result_count: 240` y URLs MP3 directas de proveedores como Freesound. Los resultados incluyen `title`, `url`, `creator`, `license`, `license_url`, `attribution`, `duration`, `foreign_landing_url` y `provider`. El primer resultado probado fue CC0 con URL CDN MP3.

La conclusión es que Openverse puede aportar mucho volumen, pero nowarfy debe tratarlo como índice: comprobar licencia, atribución, URL HTTPS, tipo MIME, respuesta real y no contar enlaces muertos. Además, muchos resultados son samples o efectos, no canciones completas; deben mostrarse como audio abierto sin prometer que todos son tracks largos.

## Bandcamp

Bandcamp permite crear reproductores embebidos oficiales desde Share/Embed, pero su API requiere contactar al equipo de Bandcamp y describir el uso. No se debe asumir una API pública anónima para recorrer su catálogo. Bandcamp queda como fuente de descubrimiento o embed oficial futuro, no como extracción de audio para nowarfy.

## Referencias

[1]: https://docs.openverse.org/api/reference/made_with_ov.html — Openverse, Made with Openverse.
[2]: https://api.openverse.org/ — Openverse API y documentación OpenAPI.
[3]: https://bandcamp.com/developer — Bandcamp Developer.
[4]: https://get.bandcamp.help/en/articles/15263071-how-do-i-create-a-bandcamp-embedded-player — Bandcamp Help, embedded player.
