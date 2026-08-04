# Actualizar GitHub desde iPhone

Esta versión sustituye todos los archivos de la versión anterior.

## 1. Archivos de la raíz

Desde la página principal del repositorio, usa `Add file` → `Upload files` y sube:

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
README.md
CHANGELOG.md
TESTING.md
.nojekyll
```

GitHub reemplazará automáticamente los archivos que tengan el mismo nombre.

## 2. Iconos

Entra a la carpeta `icons` y reemplaza:

```text
favicon-32.png
apple-touch-icon.png
icon-192.png
icon-512.png
maskable-icon-512.png
splash-1179x2556.png
splash-1290x2796.png
```

## 3. Commit

Usa el mensaje:

```text
Rebuild Galizisches Bahn v0.4.0
```

## 4. Publicación

No necesitas volver a configurar GitHub Pages ni Netlify. La publicación se inicia con el commit.
