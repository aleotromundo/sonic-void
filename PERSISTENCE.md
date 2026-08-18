# Persistencia actual

Music Finder funciona en esta etapa con persistencia local en el navegador. Favoritos, elementos de la cola y preferencias se guardan en `localStorage` bajo la clave `sonic-void-library-v1`.

Este modo es deliberadamente personal y por dispositivo: los datos no se sincronizan entre navegadores, no están disponibles en otros dispositivos, pueden desaparecer si el usuario borra los datos del sitio y no deben considerarse un almacenamiento seguro para información sensible. La aplicación no guarda secretos de Spotify en `localStorage`; esas credenciales permanecen en variables de entorno del backend.

## Migración futura a Supabase

La interfaz consume `libraryRepository` desde `client/src/lib/localPersistence.ts`. Para migrar a Supabase, se puede reemplazar `load` y `save` por procedimientos autenticados del backend sin cambiar la forma en que la interfaz administra favoritos, cola y preferencias. La migración deberá agregar autenticación, tablas por usuario, reglas RLS y una estrategia de sincronización entre el estado local existente y la base remota.
