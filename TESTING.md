# Testing — Galizische Bahn v0.9.3

## Credenciales QA

- E-mail: `test@galizischebahn.de`
- Passwort: `GBTest092!`

Los campos aparecen ya rellenados en la pantalla de login.

## Suite estática/lógica

Desde la raíz:

```bash
node qa-v093.mjs
```

Resultado verificado: **84/84**.

Cubre estaciones, búsqueda fuzzy, sinónimos, autenticación local, cronología Live, frontera, rutas, selectores, archivos, Service Worker, manifiesto y traducciones nuevas.

## Pruebas de navegador

Ejecutadas en Chromium móvil mediante el HTML autónomo:

- **24/24** navegación, login, búsqueda, resultados, desarrollador y anchos 320/375/393/430 px.
- **5/5** compra completa con tarjeta de prueba y ticket activo.
- **5/5** idioma español y modo oscuro.

Resultado agregado: **118/118**.

Archivos:

- `QA-RESULTS.json`
- `QA-BROWSER.json`
- `QA-PURCHASE.json`
- `QA-PREFERENCES.json`

## Tarjeta de prueba

```text
4242 4242 4242 4242
12/30
123
```

No uses datos reales.

## Revisión manual recomendada en Safari

1. Instalación desde pantalla de inicio.
2. Safe areas y teclado del iPhone.
3. Persistencia después de cerrar la PWA.
4. Actualización desde una versión anterior.
5. Modo offline con un ticket guardado.
6. Desenfoque y materiales en modo claro/oscuro.
