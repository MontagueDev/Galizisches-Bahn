# Publicar v0.9.3 en GitHub Pages / Netlify

## GitHub

Reemplaza todos los archivos del repositorio, incluida la carpeta `icons` y los nuevos módulos:

- `core.js`
- `selectors.js`
- `persistence.js`

Commit recomendado:

```text
Release Galizische Bahn v0.9.3 Major Refresh
```

GitHub Pages seguirá publicando desde `main / (root)`.

## Netlify

La configuración ya está incluida en `netlify.toml`.

1. Sube el commit a GitHub.
2. Abre Netlify → Deploys.
3. Ejecuta `Clear cache and deploy site` una vez al pasar desde 0.9.2.x.
4. En versiones posteriores, el Service Worker debería actualizarse sin limpieza manual gracias a los recursos versionados.

## Safari / PWA

Después del primer deploy:

1. Abre la URL con `?v=093`.
2. Cierra por completo la PWA instalada.
3. Vuelve a abrirla para que el nuevo Service Worker tome control.
4. Comprueba en Mehr que figure `v0.9.3`.

No subas el ZIP como un único archivo: sube su contenido descomprimido a la raíz.
