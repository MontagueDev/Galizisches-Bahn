# Galizische Bahn v0.9.3 — Major Refresh & Core Optimization

Esta entrega optimiza la PWA completa sin ampliar artificialmente la red ferroviaria. Conserva la operación de v0.9.2.1 —ICE, IC, RE, RB, NightJet, U-Bahn/S-Bahn, GB Konto y cronología Live— y reorganiza su arquitectura, búsqueda, persistencia, navegación y caché.

El alemán sigue siendo el idioma fuente. Español e inglés son traducciones de la misma terminología ferroviaria.

## Acceso de prueba

La edición de demostración abre el login con las credenciales ya rellenadas:

- E-mail: `test@galizischebahn.de`
- Passwort: `GBTest092!`

La contraseña es pública y exclusivamente de prueba. No debe reutilizarse en una cuenta real.

## Cambios principales

### Arquitectura

- Nuevos módulos `core.js`, `selectors.js` y `persistence.js`.
- Estado ferroviario, derivaciones de UI y persistencia separados.
- Selectores puros para viaje activo, grupos de viajes, notificaciones y estación favorita.
- Una única tabla de traducciones en tiempo de ejecución.
- Error boundary de interfaz con reintento y recarga segura.
- Restauración de posición de scroll por sección.

### Rendimiento

- Índice de búsqueda de estaciones construido una sola vez.
- Autocompletado con debounce y navegación por teclado.
- Actualizaciones Live limitadas al contenido sensible al reloj.
- Las actualizaciones se pausan cuando la pestaña está oculta o hay un modal abierto.
- Renderizado parcial del viaje activo en Inicio.
- Hora de búsqueda inicial calculada automáticamente en el futuro; ya no se crean accidentalmente boletos inmediatamente finalizados.

### Búsqueda

- Búsqueda tolerante a diacríticos: `loewen` encuentra `Löwenstadt`.
- Sinónimos ferroviarios en alemán, español e inglés:
  - `universidad` → `Universität`
  - `airport` → `Flughafen`
  - `frontera` → `Grenzbahnhof`
  - `estación principal` → `Hbf`
- Favoritos y estaciones recientes influyen en el orden.
- Soporte de teclado: flechas, Enter y Escape.

### Persistencia y offline

- `localStorage` conserva compatibilidad con todas las versiones anteriores.
- IndexedDB mantiene una copia de seguridad adicional del estado.
- Migración automática al esquema 13.
- Tickets, cuenta local, preferencias, favoritos, búsquedas y simulaciones se conservan entre actualizaciones.
- Service Worker dividido en caché principal, datos ferroviarios y recursos en tiempo de ejecución.
- Navegación `network-first`; datos y módulos `stale-while-revalidate`; iconos `cache-first`.

### UX

- Inicio reorganizado alrededor del viaje activo y la búsqueda.
- Login de pruebas precargado.
- Menús y modales con foco inicial, focus trap, Escape y restauración de foco.
- Cinco tabs con geometría estable.
- Nuevo centro de simulación: reloj, retrasos, cambio de andén, cancelación de tren y estado fronterizo.
- Estado fronterizo `Geöffnet / Eingeschränkt / Geschlossen` integrado en la búsqueda hacia México.

## Estructura

```text
index.html                 shell de la PWA
app.css                    sistema visual GB
app.js                     composición de pantallas y eventos
data.js                    estaciones, redes, tarifas y datos base
rail-services.js           corredores ICE/IC/RE/RB/NightJet
routing.js                 motor de itinerarios
live.js                    cronología y estados Live
auth.js                    GB Konto local y cuenta de prueba
payment.js                 pagos simulados
store.js                   estado central y migraciones
persistence.js             espejo de seguridad en IndexedDB
core.js                    búsqueda, debounce y utilidades de accesibilidad
selectors.js               estado derivado puro
i18n.js                    traducciones base
sw.js                      estrategia offline/versionada
```

## Ejecutar

No requiere npm ni compilación. Sirve la carpeta por HTTP:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`.

Para una inspección rápida sin servidor, abre `preview-standalone.html`. En esa edición autónoma la instalación PWA queda desactivada.

## Publicación

Compatible con GitHub Pages y Netlify. Consulta `UPLOAD-GITHUB.md`.

## Seguridad y alcance

- No existe backend remoto en esta entrega.
- GB Konto es local al dispositivo.
- No se guarda la contraseña en texto plano; las cuentas locales usan PBKDF2-SHA-256 con salt.
- Los pagos, horarios Live, incidencias y controles fronterizos son simulados.
- Nunca introduzcas datos bancarios reales.
