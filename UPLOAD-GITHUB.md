# Publicación de Galizische Bahn v0.7.1

## GitHub Pages

1. Descomprime el ZIP.
2. Sustituye todos los archivos de la raíz del repositorio por los de esta carpeta.
3. Conserva `.nojekyll` y la carpeta `icons`.
4. Haz commit en `main`.
5. Espera a que GitHub Pages termine el despliegue.
6. Abre `version.json` desde el sitio publicado y confirma que muestra `0.7.1`.
7. Cierra y vuelve a abrir la PWA para cargar la caché nueva.

Commit sugerido:

`Release Galizische Bahn v0.7.1`

## Netlify

El proyecto incluye `netlify.toml` para impedir que el navegador conserve archivos críticos antiguos.

1. Publica la carpeta raíz completa, no una carpeta contenedora adicional.
2. En **Deploys**, ejecuta un despliegue limpio sin caché si la versión antigua continúa visible.
3. Confirma que el deploy aparece como **Published**.
4. Abre `version.json` en el dominio de Netlify y verifica `0.7.1`.
5. En Safari, cierra la pestaña y la PWA instalada antes de volver a abrirlas.
