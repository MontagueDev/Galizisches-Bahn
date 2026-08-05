# Publicación de Galizische Bahn v0.8.0

## GitHub Pages

1. Descomprime `Galizische-Bahn-v0.8.0.zip`.
2. Sustituye **todos** los archivos de la raíz del repositorio por los de la carpeta descomprimida.
3. Conserva `.nojekyll` y la carpeta `icons`.
4. No subas el ZIP dentro del repositorio: sube su contenido.
5. Haz commit en `main`.
6. Espera a que GitHub Actions termine la publicación.

Commit sugerido:

```text
Release Galizische Bahn v0.8.0
```

## Netlify conectado a GitHub

1. Confirma que el repositorio conectado apunta a `main`.
2. Publica el commit anterior.
3. En Netlify abre **Deploys**.
4. Selecciona **Trigger deploy → Clear cache and deploy site**.
5. Comprueba que el deploy nuevo aparece como **Published**.

## Netlify con subida manual

1. Descomprime el ZIP.
2. Sube la carpeta completa o todos sus archivos al área de deploy manual.
3. No subas únicamente `index.html`; los módulos, iconos, manifiesto y Service Worker también son necesarios.
4. Ejecuta un despliegue con caché limpia.

## Comprobación

- Abre la URL en una pestaña privada.
- Entra a **Mehr** y verifica `v0.8.0` y el build `redesign-live3`.
- Comprueba la fecha local, el selector de idioma y una búsqueda.
- Después abre la PWA instalada.

La versión utiliza recursos `0.8.0-r3` y la caché `galizische-bahn-v0.8.0-redesign3` para evitar que Safari o Netlify reutilicen módulos antiguos.
