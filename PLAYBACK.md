# Reproducción y segundo plano

Sonic//Void mantiene una línea de reproducción fija en la parte inferior de la pantalla, incluso cuando todavía no hay una pista seleccionada. La barra muestra estado idle, carátula, tema, artista, Play/Pause, anterior, siguiente, progreso y volumen. La cola se conserva junto con los identificadores de biblioteca local y sus elementos visibles se pueden volver a seleccionar desde Biblioteca.

Cuando una pista incluye una `previewUrl` autorizada, el reproductor usa un elemento `audio`, actualiza el progreso y registra metadatos y acciones mediante Media Session API. Esto permite que navegadores compatibles presenten controles multimedia desde la pantalla bloqueada o el área de reproducción del sistema. No se solicita permiso de notificaciones porque Media Session no lo necesita.

MusicBrainz y Cover Art Archive no entregan audio, por lo que sus resultados permanecen en estado «Preview no disponible». La reproducción en segundo plano solo se activa para previews que la fuente entregue legalmente. El catálogo completo de Spotify requerirá OAuth de usuario y Web Playback SDK con una cuenta compatible.

La verificación realizada cubre compilación TypeScript, pruebas Vitest y capturas de escritorio y móvil con la barra idle visible. La prueba práctica de lock screen depende de que el navegador y el dispositivo proporcionen una preview autorizada y soporte Media Session.

## Estado de verificación de preview

En la verificación actual, los resultados observados desde MusicBrainz/Cover Art Archive tienen `previewUrl: null`, por lo que la prueba funcional de pantalla bloqueada no puede ejecutarse con una pista real de esas fuentes. El código queda preparado para activarse automáticamente cuando una fuente de audio autorizada, como una futura integración de Jamendo, entregue una URL de preview. Hasta entonces, el estado visible correcto es «Preview no disponible» y no se intenta reproducir audio sin permiso.
