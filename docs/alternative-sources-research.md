# Fuentes alternativas evaluadas

## Audius

La documentación oficial actual de Audius describe una API REST para consultar y transmitir tracks, usuarios y playlists. La mayoría de endpoints de lectura funcionan sin credenciales; una API key permite límites más altos. [1] Es una fuente de audio potencialmente útil para nowarfy, pero cada pista debe conservar su licencia/atribución y pasar el probe de stream antes de entrar en la cola.

## Jamendo

La API oficial de Jamendo expone el campo `audio` como URL de stream y documenta campos de licencia, metadata musical y `audiodownload_allowed`. La documentación aclara que la posibilidad de descarga puede estar desactivada por el artista y que el campo de descarga debe tratarse separadamente del stream. [2] Jamendo sigue siendo una fuente prioritaria para música independiente y Creative Commons, siempre que nowarfy conserve atribución y no trate todos los permisos como equivalentes.

## Decisión provisional

Audius y Jamendo son las dos fuentes de audio alternativas prioritarias. Spotify, YouTube y Google quedan fuera del catálogo principal: pueden inspirar navegación o, como máximo, aportar descubrimiento/metadata bajo sus políticas. MusicBrainz, Cover Art Archive y LRCLIB siguen siendo complementos de metadata, carátula y letras, no audio.

## Referencias

[1]: https://docs.audius.co/api/ — Audius API Reference.
[2]: https://developer.jamendo.com/v3.0/tracks — Jamendo API tracks method.

## ccMixter

ccMixter declara que su ccHost Query API es pública y está pensada para sitios web y aplicaciones de terceros; el audio es de artistas individuales y se comparte mediante licencias Creative Commons. [3] La página de uso también advierte que cada envío tiene su propia licencia y que puede haber restricciones distintas entre obras. Por eso ccMixter es un candidato viable para una fase experimental, pero requiere mapear licencia y URL por pista, no solo consumir una búsqueda global.

## Audio Commons

Audio Commons es una iniciativa y ecosistema de herramientas para contenido de audio Creative Commons, incluyendo música, samples, field recordings y efectos. Su propia documentación reconoce que los recursos están repartidos entre repositorios y que la metadata/licencia no siempre está uniformemente estructurada. [4] Es útil como marco de descubrimiento y para futuras integraciones, pero no es por sí misma un endpoint único de streams listo para reemplazar Jamendo o Audius.

[3]: https://ccmixter.org/isitlegal — ccMixter: Permission to Use Query API.
[4]: https://audiocommons.github.io/about/ — Audio Commons: About and ecosystem.
