# Changelog

## v0.9.3 — Major Refresh & Core Optimization

### Arquitectura
- Añadidos `core.js`, `selectors.js` y `persistence.js`.
- Estado derivado eliminado de las pantallas y concentrado en selectores puros.
- Persistencia local con espejo en IndexedDB.
- Esquema de datos actualizado a 13 con migración automática.
- Tabla de traducciones unificada en tiempo de ejecución.
- Error boundary para evitar pantallas en blanco.

### Búsqueda
- Nuevo índice fuzzy de estaciones.
- Coincidencias sin diacríticos y sinónimos DE/ES/EN.
- Ranking por favoritos, recientes, Hbf y Fernverkehr.
- Autocompletado con debounce, ARIA y teclado.
- Historial de estaciones utilizadas recientemente.

### Inicio y navegación
- Inicio reorganizado para priorizar viaje activo, búsqueda y recientes.
- Scroll conservado por sección.
- Renderizado parcial de la tarjeta Live.
- Tabs estables en anchos de 320–430 px.
- Modales con focus trap y restauración del foco.

### Cuenta
- Credenciales de prueba rellenadas automáticamente.
- Login y perfil permanecen locales en esta edición.
- La barra inferior se oculta durante autenticación.

### Operación Live
- Actualizaciones limitadas a pantallas sensibles al reloj.
- Pausa automática al ocultar la página o abrir un modal.
- Nuevos controles de simulación: +15, +60 y +360 min; retrasos +5/+15/+30; cambio de andén; cancelación; finalización y reset.
- Estado fronterizo configurable: abierto, restringido o cerrado.

### PWA
- Nueva estrategia de caché en tres niveles.
- Navegación network-first.
- Datos ferroviarios stale-while-revalidate.
- Recursos gráficos cache-first.
- Nueva caché `0.9.3-major-refresh1`.

### Correcciones
- La búsqueda inicial ya usa una hora futura redondeada, evitando tickets recién comprados que aparecían como finalizados.
- El login de pruebas ya no necesita un botón para completar campos.
- Se añadieron recuperaciones ante IndexedDB no disponible.
- `index.html` y `404.html` se mantienen sincronizados.
