# Galizisches Bahn v0.4.0 — reconstrucción completa

PWA ferroviaria estática, acumulativa y lista para GitHub Pages o Netlify.

Esta reconstrucción no usa React, npm ni dependencias externas: todos los archivos que necesita la aplicación ya están incluidos. Se puede publicar directamente desde la raíz del repositorio.

## Funciones

### Planificador de viajes

- Autocompletado real por estación, ciudad, región o código
- Origen, destino, fecha, hora, pasajeros y clase
- Resultados deterministas ICE, IC y RE
- Filtros de viajes directos, rápidos y económicos
- Duración, andén, retrasos, transbordos y precio en GM
- Detalle completo con paradas intermedias
- Tarifas flexible y ahorro

### Billetes

- Compra simulada
- Billetes guardados en `localStorage`
- Coche, asiento, clase, andén y precio
- Código de seguridad visual único
- Compartir y eliminar boletos
- Viaje activo en la pantalla de inicio

### Red y estaciones

- Mapa SVG interactivo
- Líneas ICE, IC, RE, S-Bahn y costeras
- Más de 60 estaciones ficticias
- Filtros por tipo de línea
- Fichas de estaciones con próximas salidas y servicios
- Estaciones favoritas

### Seguimiento en vivo

- Posición simulada sobre la ruta
- Velocidad dinámica
- Barra de progreso
- Próxima estación y hora de llegada
- Animación consistente entre recargas

### Aplicación

- Alemán, español e inglés
- Modo claro, oscuro o automático
- Diseño adaptado a iPhone y áreas seguras de iOS
- Iconos y pantallas de inicio
- PWA instalable
- Service Worker con caché offline y aviso de actualización
- Compatibilidad con GitHub Pages y Netlify
- Navegación por hash, sin errores 404 por rutas internas
- Controles accesibles y navegación por teclado

## Archivos que deben estar en la raíz del repositorio

```text
index.html
404.html
app.css
app.js
data.js
store.js
sw.js
manifest.webmanifest
netlify.toml
version.json
.nojekyll
icons/
```

## Actualizar tu repositorio desde iPhone

1. Descarga y descomprime el ZIP.
2. Entra al repositorio `Galizisches-Bahn` desde Safari.
3. Pulsa `Add file` → `Upload files`.
4. Sube todos los archivos de la raíz.
5. Entra a la carpeta `icons` y reemplaza los archivos PNG.
6. Haz el commit con el mensaje:

```text
Rebuild Galizisches Bahn v0.4.0
```

GitHub Pages o Netlify volverán a publicar el sitio automáticamente.

## Evitar que Safari conserve la versión anterior

El nombre de la caché cambió a:

```text
galizisches-bahn-v0.4.0-r2
```

Después de publicar:

1. Abre la app en Safari.
2. Recarga una vez.
3. Cierra y vuelve a abrir la app instalada.
4. Si todavía aparece la versión vieja, elimina el icono de la pantalla de inicio y vuelve a añadirlo.

## Desarrollo local

No requiere instalación. Desde la carpeta del proyecto puedes iniciar un servidor con:

```bash
python3 -m http.server 8080
```

Después abre:

```text
http://localhost:8080
```

Abrir `index.html` directamente como archivo no permite registrar el Service Worker; usa un servidor web para probar la PWA.

## Aviso

La red, horarios, precios, billetes y datos en vivo son ficticios y forman parte del universo alternativo de la Bundesrepublik Galizien.
