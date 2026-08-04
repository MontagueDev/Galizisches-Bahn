# Galizisches Bahn v0.6.0

PWA ferroviaria ficticia y acumulativa para la Bundesrepublik Galizien.

## Novedades principales

- **In der Stadt** con redes U-Bahn y S-Bahn separadas para 10 áreas metropolitanas.
- Salidas simuladas, líneas, frecuencias y planificador urbano con transbordos.
- **Galizien-Ticket** Jugend, Standard, Plus y Business.
- Boletos urbanos sencillos y diarios.
- Portal universal de pago de demostración para boletos y suscripciones.
- Selección gráfica de asiento, cabinas NightJet, extras y datos del pasajero.
- Motor de rutas nacional basado en un grafo de estaciones y tramos.
- Estados `Anschluss gesichert`, `gefährdet` y `verpasst`.
- Centro de operaciones **Betriebslage**.
- EC International y NightJet a Ciudad de México Buenavista.
- Avisos de Bundespolizei y controles migratorios en rutas a México.
- Billetes digitales, suscripciones, historial de compras y seguimiento simulado.
- Alemán, español e inglés; tema claro, oscuro y automático.
- PWA offline para GitHub Pages y Netlify.

## Pago de demostración

La aplicación **no procesa pagos reales**. No introduzcas información real.

Tarjetas de prueba:

- `4242 4242 4242 4242` — Visa aprobada
- `5555 5555 5555 4444` — Mastercard aprobada
- `4000 0027 6000 3184` — simulación 3-D Secure aprobada
- `4000 0000 0000 0002` — pago rechazado

Usa cualquier fecha futura con formato `MM/AA` y un CVV ficticio de 3 o 4 dígitos.

## Publicación

Sube todos los archivos a la raíz del repositorio. GitHub Pages debe publicar desde `main` y `/ (root)`. En Netlify no se necesita comando de compilación y el directorio de publicación es `.`.
