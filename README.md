# Galizische Bahn v0.7.1

PWA ferroviaria ficticia para la Bundesrepublik Galizien.

## Quality & Journey Update

Esta versión estabiliza la experiencia de compra y añade gestión realista de boletos simulados:

- Flujo unificado de cinco pasos: asiento, pasajero, extras, resumen y pago.
- Estado de compra persistente para volver atrás o reanudar sin perder datos.
- Extras inteligentes según la clase y el producto elegido.
- Corrección de Primera Clase: el upgrade no vuelve a ofrecerse cuando el viaje ya es de 1. Klasse.
- Cancelación de boletos con QR invalidado, historial y reembolso simulado según tarifa.
- Menú del boleto con QR ampliado, PDF, compartir, repetir viaje y cambio de asiento cuando corresponde.
- Boletos organizados en activos, suscripciones, cancelados e historial.
- Favoritos para rutas, estaciones y ciudades.
- Paneles de salidas y llegadas por estación.
- Mejoras del viaje activo, información del tren, perfil y notificaciones simuladas.
- Encabezados de caché para evitar versiones antiguas en Netlify.

## México y frontera

Se conserva el sistema de la v0.7.0:

- San Juan del Río Grenzbahnhof es el enlace fronterizo obligatorio.
- Galizia → tren nacional → San Juan del Río → control migratorio → RB México → Buenavista.
- Buenavista → RB México → San Juan del Río → control migratorio → tren nacional → Galizia.
- Advertencia del Auswärtiges Amt antes de buscar conexiones con México.

## Importante

Los horarios, rutas, posiciones, notificaciones, reembolsos y pagos son simulados. No se deben introducir datos bancarios reales.
