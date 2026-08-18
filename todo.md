
# Project TODO

- [x] Implementar búsqueda de canciones mediante Spotify Web API con Client Credentials exclusivamente en el backend
- [x] Gestionar credenciales de Spotify y Genius mediante variables de entorno sin exponer secretos al cliente
- [x] Crear grilla responsiva de resultados con carátula, tema, artista, álbum y año
- [x] Crear vista de detalle con carátula grande, duración, popularidad, mercados, enlace oficial y letras
- [x] Integrar consulta de letras mediante Genius desde el backend
- [x] Implementar paginación incremental con botón «Ver más»
- [x] Aplicar estética cyberpunk/HUD oscura con rosa neón, cian eléctrico, tipografía geométrica y corchetes técnicos
- [x] Añadir microanimaciones sutiles y respetuosas con prefers-reduced-motion
- [x] Verificar responsividad, estados de carga, vacíos y errores
- [x] Escribir y ejecutar pruebas Vitest para las rutas de búsqueda y letras
- [x] Ejecutar verificación visual y guardar checkpoint final
- [x] Investigar una ruta alternativa cuando el dashboard de Spotify o Genius no cargue y documentar el modo degradado permitido
- [x] Mantener la aplicación operativa sin credenciales mediante estados claros de configuración faltante, sin inventar datos ni claves
- [x] Diagnosticar el fallo de carga del dashboard de Spotify sin solicitar ni usar la contraseña del usuario
- [x] Ajustar el alcance de letras para indicar claramente que la app enlaza a Genius y no reproduce texto completo sin licencia
- [x] Mostrar mercados disponibles reales en el detalle de la canción
- [x] Agregar estados explícitos de error para búsqueda y letras
- [x] Añadir pruebas Vitest para procedimientos tRPC de búsqueda y letras
- [x] Guardar checkpoint final después de estas correcciones
- [x] Adaptar búsqueda y carátulas a MusicBrainz y Cover Art Archive como fuente gratuita alternativa
- [x] Añadir etiquetas de fuente y estados de disponibilidad para distinguir MusicBrainz de Spotify
- [x] Actualizar pruebas, verificación visual y checkpoint de la adaptación alternativa
- [x] Corregir mensajes de error y vacío para que distingan MusicBrainz de Spotify, y mostrar la fuente en cada resultado o detalle
- [x] Guardar un nuevo checkpoint después de la adaptación MusicBrainz/Cover Art Archive validada
- [x] Activar Spotify con las credenciales nuevas cargadas mediante el formulario seguro
- [x] Verificar la aplicación con Spotify activo y guardar un checkpoint actualizado
- [x] Verificar de extremo a extremo una búsqueda real con Spotify activo y confirmar fallback seguro cuando el endpoint Spotify responde 403
- [x] Guardar el checkpoint final después de la verificación end-to-end de Spotify
- [x] Guardar un checkpoint posterior a la verificación final y al manejo de respuestas 401/403/429 de Spotify
- [x] Priorizar artista exacto y sus releases/álbumes para consultas como «Shakira»
- [x] Mantener búsqueda libre como fallback y evitar falsos positivos por coincidencia textual
- [x] Agregar pruebas de relevancia para artista, álbum y búsqueda libre
- [x] Verificar visualmente y guardar checkpoint de la corrección
- [x] Hacer la búsqueda tolerante a consultas naturales como «álbumes de Shakira» y «canciones de Shakira»
- [x] Priorizar artista exacto, álbum exacto y canción exacta antes de coincidencias textuales amplias
- [x] Añadir corrección de mayúsculas, acentos, signos y variantes simples sin exigir filtros
- [x] Mostrar una etiqueta de intención o fuente de resultados sin hacer la interfaz más compleja
- [x] Agregar pruebas de ranking para artistas, álbumes, canciones y consultas ambiguas
- [x] Verificar visualmente el flujo tipo YouTube y guardar checkpoint
- [x] Rediseñar la app como experiencia de streaming con navegación lateral y área principal
- [x] Crear secciones Inicio, Buscar, Biblioteca y álbum/artista
- [x] Añadir reproductor persistente inferior con controles preparados para preview o playback autorizado
- [x] Integrar biblioteca local de favoritos sin inventar contenido de usuario
- [x] Mantener búsqueda tipo YouTube dentro del nuevo layout
- [x] Verificar responsividad, accesibilidad, pruebas y checkpoint del rediseño
- [x] Implementar una capa de persistencia local desacoplada de la futura integración Supabase
- [x] Persistir favoritos, biblioteca, cola y preferencias únicamente en localStorage durante esta etapa
- [x] Documentar los límites de localStorage y el punto de migración posterior a Supabase
- [x] Restaurar fallback real a búsqueda libre cuando no haya artista exacto
- [x] Añadir ranking y pruebas para artista, álbum, canción y consultas ambiguas
- [x] Ajustar el alcance a detalle musical unificado para álbumes, canciones y artistas resueltos
- [x] Documentar límites de localStorage y migración futura a Supabase en un archivo del proyecto
- [x] Validar accesibilidad básica y guardar checkpoint posterior al rediseño final
- [x] Añadir pruebas Vitest específicas de ranking para artista exacto, álbum exacto, canción exacta y consulta ambigua
- [x] Validar teclado, foco visible, labels aria y contraste de controles clave
- [x] Guardar checkpoint después de las pruebas finales y la validación de accesibilidad
- [x] Crear manifest PWA con identidad Sonic//Void e instalación opcional
- [x] Añadir service worker para ciclo de vida PWA sin prometer audio no autorizado
- [x] Integrar Media Session API para controles de lock screen y notificación
- [x] Evaluar permisos de notificación: no se solicitan porque Media Session no los necesita
- [x] Mantener reproducción en segundo plano limitada a previews autorizadas
- [x] Verificar controles multimedia, pruebas y checkpoint de la experiencia PWA
- [x] Convertir el reproductor inferior en una línea Winamp persistente y siempre visible
- [x] Añadir controles Play/Pause, anterior, siguiente, progreso y volumen
- [x] Conectar la cola local con navegación entre pistas y estado actual
- [x] Integrar metadatos Media Session y reproducción en segundo plano para previews autorizadas
- [x] Verificar la barra en escritorio y móvil, ejecutar pruebas y guardar checkpoint
- [x] Reparar la firma del componente Player y recuperar compilación limpia
- [x] Completar controles de reproductor estilo Winamp con progreso, volumen, anterior y siguiente
- [x] Añadir patrones propios de streaming: cola visible, estados de reproducción y acciones de biblioteca
- [x] Mantener identidad Sonic//Void sin copiar código, logos, assets ni textos de Spotify
- [x] Ejecutar pruebas, verificación visual y checkpoint después de la ampliación
- [x] Hacer visible la barra del reproductor incluso en estado idle sin pista activa
- [x] Unificar library.queue y playQueue y mostrar una cola visible en la interfaz
- [x] Verificar la barra final en escritorio y móvil después de los cambios
- [x] Documentar la verificación funcional de Media Session con preview autorizada y guardar checkpoint final
- [x] Usar una única fuente de verdad persistida para la cola del reproductor y evitar divergencias
- [x] Verificar Media Session con una preview real disponible o registrar claramente que no hay preview en las fuentes activas
- [x] Guardar checkpoint posterior a estas correcciones finales
- [x] Investigar fuentes gratuitas y legales de audio reproducible
- [x] Investigar fuentes de metadatos, carátulas y letras con licencias compatibles
- [x] Clasificar cada fuente por reproducción, atribución, límites y necesidad de API key
- [x] Diseñar un adaptador unificado de fuentes y derechos para Sonic//Void
- [x] Ampliar playlists locales y búsqueda inteligente sobre el catálogo agregado
- [x] Documentar claramente qué contenido se puede reproducir y guardar checkpoint del mapa de integración
- [x] Activar búsqueda automática mientras el usuario escribe después de un debounce breve
- [x] Evitar consultas para entradas vacías o demasiado cortas y cancelar resultados obsoletos
- [x] Mostrar indicador y estados de sugerencias en vivo sin saturar las fuentes externas
- [x] Mantener Enter como acción manual y verificar escritorio y móvil
- [x] Agregar pruebas y guardar checkpoint de la búsqueda instantánea
- [x] Descartar explícitamente respuestas obsoletas de consultas anteriores mientras se escribe
- [x] Añadir una experiencia visible de sugerencias o estado live separado de los resultados finales
- [x] Crear una prueba determinista de la lógica de activación de búsqueda instantánea
- [x] Guardar checkpoint posterior a estas correcciones de búsqueda en vivo
- [x] Diagnosticar el 503 de tRPC en logs y reproducirlo con una búsqueda real
- [x] Corregir la causa para que una fuente externa caída no rompa la consulta
- [x] Añadir o ajustar pruebas para errores 503, timeout y fallback
- [x] Verificar visualmente y guardar checkpoint de la corrección
- [x] Agregar una prueba Vitest que simule 503 o timeout de una fuente y confirme fallback seguro sin propagar error
- [x] Guardar un checkpoint posterior a las correcciones finales de búsqueda en vivo y 503
- [x] Guardar un nuevo checkpoint después de las correcciones finales del 503 y de la búsqueda en vivo
- [x] Documentar explícitamente el estado de Media Session cuando no existe una preview reproducible en las fuentes activas
- [x] Implementar o verificar playlists locales reales en la capa de persistencia y UI
- [x] Cubrir playlists locales y cola con pruebas y preparar checkpoint posterior al mapa de fuentes
- [x] Integrar consulta backend a LRCLIB con User-Agent identificable y límites responsables
- [x] Parsear letras sincronizadas y validar coincidencia por artista, canción, álbum y duración
- [x] Conectar la línea activa de la letra con el progreso del reproductor
- [x] Añadir estados para letra no encontrada, instrumental, sin preview y rate limit
- [x] Agregar pruebas de parsing, matching y estados LRCLIB
- [x] Verificar visualmente y guardar checkpoint de la integración de letras
- [x] Mostrar el texto de letras LRCLIB en el detalle y la línea activa durante playback
- [x] Añadir estados visibles de LRCLIB: disponible, no encontrada, instrumental, rate limit y sin preview
- [x] Mejorar la vista de álbum con jerarquía de portada, metadatos, acciones y lista de pistas inspirada en la referencia compartida
- [x] Mantener una identidad propia y no copiar logos, assets ni contenido protegido de Spotify
- [x] Probar LRCLIB, playback y vista de álbum; verificar visualmente y guardar checkpoint
- [x] Validar metadatos devueltos por LRCLIB y aplicar tolerancia de duración antes de aceptar una coincidencia
- [x] Mostrar estados UI diferenciados para letras disponibles, no encontradas, instrumentales, rate limit y ausencia de preview
- [x] Añadir una tracklist visible cuando el resultado represente un álbum o un conjunto de pistas
- [x] Guardar checkpoint posterior a las correcciones finales de LRCLIB y vista de álbum
- [x] Ajustar el alcance al detalle musical actual; la tracklist queda pendiente de un endpoint real de releases y no se inventan pistas
- [x] Verificar la integración final y guardar un checkpoint posterior a LRCLIB
- [x] Guardar un nuevo checkpoint después de la integración LRCLIB y la verificación visual final
- [x] Diagnosticar por qué Play no inicia audio en la versión publicada
- [x] Corregir el flujo de audio para previews autorizadas y errores del navegador
- [x] Mostrar un estado inequívoco cuando la pista no tiene preview reproducible
- [x] Agregar pruebas del reproductor y verificar escritorio y móvil
- [x] Agregar pruebas del Player con Vitest/RTL para preview, sin preview, Play/Pause y error HTMLAudioElement
- [x] Agregar pruebas del componente Player para reproducción exitosa, pista sin preview y error del HTMLAudioElement
- [x] Guardar checkpoint posterior a la corrección de Play
- [x] Guardar un checkpoint real después de la integración Audius y la corrección de Play
- [x] Endurecer el matching de audio por artista y título, sin aceptar el artista dentro del título
- [x] Cubrir falsos positivos reales y matching por duración en pruebas
- [x] Agregar prueba regresiva para artista distinto con término buscado dentro del título
- [x] Eliminar casts `as LocalQueueItem` compartiendo un tipo común de pista
- [x] Auditar Audius, Jamendo y otras fuentes legales con audio reproducible
- [x] Integrar una estrategia de fallback de audio por coincidencia de artista y título
- [x] Implementar matching real del fallback comparando artista y título por separado contra el resultado primario
- [x] Agregar pruebas deterministas para falsos positivos y coincidencias correctas entre resultado primario y fallback
- [x] Mostrar la fuente de audio activa y su enlace oficial
- [x] Agregar pruebas del componente Player para play exitoso, sin preview y error de reproducción
- [x] Implementar matching real entre resultados primarios y fallback de audio por artista, título y duración
- [x] Mostrar en el reproductor la fuente activa de audio y su enlace oficial
- [x] Actualizar los tipos de persistencia local para soportar Audius sin casts inseguros
- [x] Confirmar contrato oficial de Jamendo y documentar licencia, atribución, límites y campos de audio
- [x] Configurar la credencial de Jamendo mediante secretos seguros, sin exponerla al cliente
- [x] Implementar búsqueda Jamendo con preview/stream reproducible y fuente oficial
- [x] Integrar Jamendo en el fallback con matching estricto y persistencia local
- [x] Reflejar correctamente que Jamendo usa matching estricto cuando hay equivalente y modo descubrimiento semántico solo en consultas libres
- [x] Añadir etiqueta verificable de modo descubrimiento Jamendo en resultados y reproductor
- [x] Renombrar y documentar explícitamente el fallback Jamendo semántico para consultas libres cuando los resultados primarios no son equivalentes
- [x] Probar la regla exacta: matching estricto si existe equivalente primario y descubrimiento semántico solo en consulta libre
- [x] Documentar el fallback semántico Jamendo únicamente para consultas libres sin equivalente primario reproducible
- [x] Agregar pruebas Jamendo de falsos positivos, respuesta inválida y Player con source jamendo
- [x] Agregar pruebas deterministas de mapeo, matching, errores y reproducción Jamendo
- [x] Verificar la UI de fuente Jamendo en escritorio y móvil y guardar checkpoint
- [x] Verificar automáticamente el renderizado de resultados Jamendo con prueba RTL y guardar checkpoint real posterior
- [x] Agregar prueba RTL de renderizado de tarjeta Jamendo con etiqueta `Jamendo · descubrimiento` y registrar evidencia textual
- [x] Optimizar consultas libres para mostrar Jamendo rápidamente cuando la cadena primaria está lenta
- [x] Estabilizar los inputs de búsqueda y letras para evitar refetches infinitos en la vista por URL
- [x] Auditar el modelo actual de cola y los campos de licencia/atribución
- [x] Revisar music.youtube.com como referencia pública de navegación, cola y controles
- [x] Adaptar patrones de YouTube Music sin copiar marca, código, assets ni contenido
- [x] Filtrar la cola para mostrar únicamente pistas con previewUrl reproducible
- [x] Garantizar una selección inicial visible cuando la cola esté vacía
- [x] Mostrar licencia, atribución y enlace oficial en cada elemento de la cola
- [x] Añadir controles visibles de cola y pruebas de filtrado/persistencia/responsive
- [x] Probar que localStorage conserva licencia, atribución y enlace legal de cada pista reproducible
- [x] Probar en RTL la estructura responsive de la cola sin depender de screenshots no auditables
- [x] Guardar checkpoint de la nueva cola visible
- [x] Auditar el reproductor y elegir una arquitectura visualizadora original y eficiente
- [x] Verificar licencia del código MilkDrop/MilkDrop2 y compatibilidad con Sonic//Void
- [x] Auditar licencias de presets `.milk`, shaders, texturas y packs de terceros
- [x] Comparar integración directa, conversión de presets y recreación propia
- [x] Decidir arquitectura: Canvas original ahora; Butterchurn/projectM quedan como opción futura solo con presets licenciados
- [x] Documentar una recomendación legal/técnica con fuentes oficiales
- [x] Implementar ecualizador visual animado durante playback y estado idle/pausa
- [x] Conectar el visualizador a AudioContext/AnalyserNode cuando el navegador y la fuente lo permitan
- [x] Mantener fallback explícito para streams sin CORS sin prometer análisis real
- [x] Añadir accesibilidad, reduced motion y límites de rendimiento al visualizador
- [x] Desactivar completamente el requestAnimationFrame durante prefers-reduced-motion
- [x] Agregar pruebas del visualizador y verificar reproductor en escritorio/móvil
- [x] Probar transformación de frecuencias a barras y layout responsive del visualizador
- [x] Guardar checkpoint del visualizador tipo MilkDrop original
- [x] Confirmar licencia MIT de Butterchurn y licencia explícita de presets seleccionados
- [x] Instalar Butterchurn y su paquete de presets compatible
- [x] Integrar el motor WebGL con AudioContext y fallback Canvas
- [x] Mostrar nombre, licencia y atribución del preset activo
- [x] Añadir pruebas de carga, selección, WebGL ausente y reduced motion
- [x] Guardar checkpoint de la integración Butterchurn
- [x] Inspeccionar remotos GitHub existentes y estado del repositorio local
- [x] Confirmar que secretos y archivos `.env` no entren al repositorio
- [x] Crear o conectar un repositorio privado de Sonic//Void en GitHub
- [x] Verificar el push y entregar el enlace del repositorio privado

- [x] Diagnosticar y corregir el error del despliegue externo en Vercel para Sonic//Void, verificando build, variables de entorno y rutas del servidor.

- [x] Preparar configuración Vercel con `vercel.json`, entrypoint serverless y rutas para SPA/tRPC.
- [x] Documentar variables de entorno y pasos de despliegue en Vercel.
- [x] Validar build, TypeScript y pruebas después de la adaptación Vercel.

- [x] Ocultar de la grilla y resultados finales todas las pistas sin `previewUrl` reproducible.
- [x] Auditar fuentes legales adicionales con API o streams gratuitos y documentar licencia, atribución y límites.
- [x] Añadir pruebas de que la búsqueda solo muestra resultados reproducibles y conserva estados vacíos claros.

- [x] Implementar reproducción continua al finalizar una pista usando solo opciones reproducibles y autorizadas.
- [x] Seleccionar automáticamente una pista similar de la cola o del catálogo disponible sin pedir permiso adicional.
- [x] Priorizar artistas conocidos con preview autorizada y mantener alternativas libres reproducibles visibles.
- [x] Añadir pruebas de finalización de audio, selección de siguiente pista y fallback seguro.

- [x] Preparar la próxima pista reproducible al iniciar la pista actual, sin esperar a `ended`.
- [x] Hacer que `onEnded` consuma la pista anticipada y deje fallback seguro solo si la preparación falló.
- [x] Añadir pruebas de planificación anticipada, cola preparada y transición instantánea.

- [x] Sincronizar la versión validada de Sonic//Void con Manus Space y el repositorio privado de GitHub para comparación.

- [x] Añadir botón de silencio y control de volumen deslizable con estado accesible y persistencia local.
- [x] Mostrar una sección visible de “A continuación” con las pistas ya preparadas por autoplay.
- [x] Añadir pruebas RTL para volumen, silencio y lista de próximas pistas.

- [x] Diagnosticar el fallo persistente del despliegue Vercel y reproducirlo en el dominio público.
- [x] Corregir entrypoint, rutas, build o configuración de variables que impidan cargar la SPA y tRPC en Vercel.
- [ ] Validar el despliegue Vercel corregido y documentar cualquier variable que el usuario deba cargar manualmente.

- [x] Reproducir y diagnosticar la regresión que dejó la búsqueda sin resultados en Manus Space.
- [x] Restaurar resultados útiles con fallback tolerante cuando Spotify, MusicBrainz, Audius o Jamendo fallen.
- [x] Validar una búsqueda real y publicar la corrección en Manus Space antes de retomar Vercel.

- [x] Añadir filtros opcionales y combinables por país o mercado, género/movimiento y año o intervalo de fechas.
- [x] Conectar los filtros al backend usando metadatos reales y conservar el filtro de pistas reproducibles.
- [x] Añadir controles accesibles, pruebas de combinaciones y validación de búsqueda simple sin filtros.

- [ ] Revisar y corregir la conexión del proyecto nowarfy con `aleotromundo/sonic-void`, rama `main` y Root Directory en Vercel.
- [ ] Verificar variables de entorno y activar un redeploy de Vercel sin modificar secretos innecesariamente.
- [ ] Confirmar que `nowarfy.vercel.app` sirva la SPA y que `/api/trpc` responda correctamente.

- [x] Crear favicon original responsivo para nowarfy Sonic//Void Radio.
- [x] Actualizar título, descripción, manifest y referencias de marca de la aplicación.
- [x] Validar la identidad en build, navegador y PWA.

- [x] Mostrar al abrir nowarfy señales, artistas y playlists con pistas reproducibles reales.
- [x] Añadir pruebas de estado inicial, carga de catálogo y disponibilidad de audio.
- [ ] Verificar después de publicar Manus Space, Vercel y `/api/trpc` con una búsqueda real.

- [x] Auditar radios y catálogos con streams o previews legalmente reproducibles dentro de nowarfy.
- [x] Añadir estaciones internas con botón Play y estado de reproducción visible.
- [x] Mantener licencia y atribución dentro del sitio sin mostrar enlaces externos como acción principal.
- [ ] Validar que las estaciones funcionen en Manus Space y Vercel con pruebas reales.

- [x] Crear modo Full Signal a pantalla completa sincronizado con la señal de audio.
- [x] Añadir escena 3D/WebGL con fallback Canvas y controles de intensidad, color y salida.
- [x] Cubrir con pruebas el fallback, reduced motion y activación del modo inmersivo.

- [x] Auditar fuentes libres, Creative Commons, radios y grabaciones de artistas conocidos con reproducción autorizada.
- [x] Aplicar una validación de stream/preview antes de mostrar cualquier resultado o estación.
- [x] Clasificar directos, históricos y catálogo conocido según licencia y tipo de audio verificable.
- [x] Probar las fuentes y publicar únicamente opciones con Play funcional.

- [ ] Sincronizar cada bloque validado con GitHub y comprobar el deployment correspondiente en Vercel antes de continuar.

- [x] Hacer visible el botón Full Signal en escritorio y móvil, con indicador claro de que abre las visualizaciones.
- [x] Probar el acceso visual en Manus Space, Vercel y el preview local.

- [ ] Completar auditoría integral de funcionalidades, pruebas, despliegues y documentación.
- [ ] Cerrar o documentar honestamente cualquier pendiente restante antes del informe final.

- [x] Retirar el panel y contrato de filtros de país, género, movimiento y año.
- [x] Reemplazar las señales iniciales por estaciones libres, under, alternativas, experimentales y anarquistas con audio reproducible.
- [x] Mantener fuera de la grilla toda pista sin Play funcional y conservar atribución/licencia dentro del sitio.
- [x] Actualizar pruebas, sincronizar GitHub y verificar Manus Space/Vercel después del cambio.

- [x] Mover las señales al hero principal en círculos visibles con carátulas.
- [x] Añadir Play directo, nombre y estado reproducible en cada círculo.
- [x] Validar el hero circular en escritorio y móvil y sincronizar el cambio.

- [ ] Definir una actualización periódica controlada para ampliar estaciones con pistas legales reproducibles.
- [x] Evitar búsquedas infinitas, duplicados, streams inválidos y tareas en segundo plano sin límites.
- [x] Añadir estado visible de última actualización y fallos de fuentes.

- [x] Implementar catálogo liviano con URLs de audio autorizadas y metadatos, sin almacenar archivos pesados.
- [x] Deduplicar pistas por fuente/identificador y conservar licencia, atribución y estado reproducible.
- [x] Preparar lotes ampliables por estación y validar que cada referencia tenga Play funcional.

- [x] Retirar definitivamente los filtros decorativos de señal del buscador y del hero.
- [x] Mantener únicamente información verificable de fuentes, audio reproducible, licencia, atribución y acciones Play internas.
- [x] Actualizar pruebas y validar que la búsqueda real siga funcionando sin filtros inventados.
- [x] Guardar checkpoint de la corrección de enfoque musical.

- [x] Auditar latencias, errores y límites de Jamendo y Audius con mediciones separadas por etapa.
- [x] Diseñar timeouts, circuit breaker, caché y validación de streams sin bloquear la búsqueda.
- [ ] Evaluar una fuente de audio adicional con stream directo, licencia verificable y API estable.
- [x] Documentar una estrategia priorizada de implementación y métricas de éxito.

- [x] Implementar `probePlayableStream` server-side con HEAD/Range, timeout y límites de respuesta.
- [x] Conectar la validación a Jamendo y Audius antes de devolver pistas al cliente.
- [x] Añadir pruebas de status, content-type, redirecciones, timeout y fallback HEAD/Range.
- [x] Ejecutar TypeScript y Vitest, y guardar checkpoint de la validación de streams.

- [x] Reemplazar las señales del hero por Relax, Focus, Workout, Energize y Sleep.
- [x] Mostrar una imagen o carátula visualmente distinta en cada círculo sin inventar audio.
- [x] Mantener Play interno y estado claro cuando una estación todavía no tenga pista reproducible.
- [x] Verificar el hero en escritorio y móvil y publicar el cambio.

- [x] Al seleccionar Relax, Focus, Workout, Energize o Sleep, abrir la sesión correspondiente y reproducir su primera pista reproducible.
- [x] Preparar la cola anticipada de la estación seleccionada y conservar el estado de Full Signal.
- [x] Manejar de forma honesta estaciones sin audio disponible o con fuente temporalmente caída.
- [x] Añadir pruebas del flujo de selección y autoplay de estación.

- [x] Eliminar de la interfaz cualquier filtro visible de país, género, movimiento o año.
- [x] Mostrar directamente los resultados reales disponibles y ordenar primero las pistas reproducibles.
- [x] Mantener fuente, licencia, atribución y estado de audio sin convertirlos en filtros decorativos.
- [x] Añadir o actualizar pruebas para confirmar que la búsqueda simple no renderiza filtros.
- [x] Verificar y publicar la simplificación del catálogo.

- [x] Reordenar la home para abrir con cinco círculos visuales de estaciones.
- [x] Añadir fila tipo Netflix “Más escuchado” con pistas reales reproducibles.
- [x] Añadir fila “Recomendados” basada en catálogo real disponible.
- [x] Añadir fila “Seguí vos” basada en historial, cola o biblioteca local sin inventar datos.
- [x] Mantener Play interno, atribución y estados honestos en las tres filas.
- [x] Validar responsive, autoplay por estación y publicar la nueva home.

- [x] Mantener una identidad visual y técnica propia mientras se incorporan patrones de navegación de Spotify y YouTube Music.
- [x] Priorizar reproducción directa, filas de descubrimiento, cola persistente y navegación contextual como referencias de experiencia.
- [x] Evitar copiar logos, textos, código, assets, marca o contenido protegido de servicios externos.
- [x] Documentar y validar la próxima mejora de nowarfy sobre fuentes legales y pistas reproducibles.

- [x] Auditar coherencia entre la promesa de nowarfy y la música realmente reproducible.
- [x] Auditar que la home mantenga cinco estaciones, filas Más escuchado/Recomendados/Seguí vos y Play interno.
- [x] Auditar que cola, autoplay, letras, Full Signal, licencias y atribuciones no se contradigan.
- [x] Auditar consistencia entre Manus Space, GitHub y Vercel sin asumir que un build en curso ya está publicado.
- [x] Corregir inconsistencias comprobadas y documentar pendientes antes de seguir agregando funciones.

- [x] Reforzar la continuidad para seleccionar y preparar siempre la siguiente pista reproducible disponible.
- [x] Evitar que la radio repita pistas, bloquee la cola o muestre una pista sin stream validado.
- [x] Medir por separado la salud y latencia de Spotify, Jamendo y Audius antes de elegir fallback.
- [x] Evaluar una API de Google solo para descubrimiento o metadata legal, sin extraer ni retransmitir audio restringido.
- [ ] Probar la continuidad en local, Manus Space y Vercel antes de publicar.

- [x] Documentar que Spotify, YouTube y Google son referencias opcionales de experiencia, no fuentes necesarias del catálogo.
- [x] Recopilar rápidamente fuentes alternativas con audio legal, stream verificable, metadata y atribución.
- [x] Separar fuentes de audio, fuentes de metadata, carátulas y letras para no mezclarlas como si fueran reproducción.
- [x] Definir un conjunto prioritario de fuentes alternativas para nowarfy y descartar las que no permitan Play estable.
- [x] Guardar la investigación y actualizar la arquitectura de catálogo sin agregar fuentes no verificadas.

- [x] Auditar los defectos visibles y elegir mejoras de mayor impacto antes de agregar funciones nuevas.
- [x] Pulir reproducción continua, selección anticipada y fallbacks sin repetir ni mostrar streams inválidos.
- [ ] Estabilizar Jamendo/Audius y preparar una integración experimental de ccMixter solo si supera las validaciones.
- [x] Refinar home, player, Full Signal, accesibilidad y responsive.
- [ ] Validar local, Manus Space, GitHub y Vercel, documentando cualquier límite restante.

- [x] Reproducir y aislar `FUNCTION_INVOCATION_FAILED` en `/api/trpc/auth.me` del dominio público.
- [x] Corregir el entrypoint serverless para que Vercel inicialice Express/tRPC sin depender del listener local.
- [ ] Validar `/api/trpc/auth.me`, estado de proveedores y búsqueda real en Vercel después del fix.
