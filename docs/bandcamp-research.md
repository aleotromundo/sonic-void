# Evaluación de Bandcamp para nowarfy

## Conclusión

Bandcamp tiene un catálogo enorme de artistas independientes y permite que los propios artistas publiquen reproductores embebidos mediante el control Share/Embed. La integración oficial viable para nowarfy sería un embed autorizado por álbum o pista, no una extracción de URLs de audio ni una copia del catálogo.

La página oficial de desarrolladores existe, pero el acceso a API requiere contactar a Bandcamp y describir el uso previsto. No debe asumirse que existe una API pública anónima para buscar todo el catálogo. Tampoco conviene usar endpoints no documentados o scraping.

## Qué puede aportar

Bandcamp puede servir como fuente de descubrimiento y como reproductor oficial embebido cuando exista una URL de artista/álbum/pista autorizada. El audio seguiría siendo servido por Bandcamp dentro de su propio reproductor y el artista conservaría el contexto, la atribución y las condiciones de escucha.

## Qué no debe hacer nowarfy

Nowarfy no debe descargar, cachear, proxyficar ni extraer archivos de audio de Bandcamp. Tampoco debe convertir una página de Bandcamp en un `previewUrl` propio sin autorización. Eso rompería la regla del proyecto de mantener Play interno con fuentes permitidas y podría incumplir las condiciones de la plataforma.

## Decisión técnica

Bandcamp no entra por ahora como proveedor de audio directo del catálogo interno. Queda como candidato para una integración futura de embeds oficiales o para una capa separada de descubrimiento con enlaces de atribución. Las fuentes internas de audio siguen siendo Jamendo, Audius y, si supera la validación, Openverse/Freesound mediante sus URLs autorizadas y licencias por obra.

## Referencias

1. Bandcamp Developer: https://bandcamp.com/developer
2. Bandcamp Help, embedded player: https://get.bandcamp.help/en/articles/15263071-how-do-i-create-a-bandcamp-embedded-player
3. Bandcamp Terms of Use: https://bandcamp.com/terms_of_use
