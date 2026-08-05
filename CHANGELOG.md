# Changelog

## 0.7.1 — Quality & Journey Update

### Compra coherente
- Nuevo flujo de cinco pasos con resumen antes del pago.
- Un único estado central conserva conexión, clase, asiento, pasajero, extras y datos de prueba.
- Las compras incompletas pueden reanudarse o descartarse desde Inicio.
- Atrás y Cancelar conservan el contexto y evitan duplicar precios.
- Los extras se filtran dinámicamente según clase y tipo de boleto.
- Corregido el error que ofrecía un upgrade de Primera Clase a pasajeros que ya habían elegido 1. Klasse.

### Gestión de boletos
- Nuevo menú de acciones para cada boleto.
- Cancelación con confirmación, QR invalidado y traslado a Cancelados.
- Reembolso simulado según las condiciones de la tarifa.
- QR a pantalla completa, compartir, PDF, repetir viaje y detalles.
- Cambio de asiento disponible únicamente para tarifas modificables.
- Secciones separadas: Activos, Suscripciones, Cancelados e Historial.

### Viajes y personalización
- Rutas, estaciones y ciudades favoritas.
- Paneles de salidas y llegadas en las estaciones.
- Viaje activo con siguiente parada, tiempo restante, retraso y progreso.
- Información de tren, coche, sector y ocupación simulada.
- Perfil con estadísticas locales.
- Control de notificaciones simuladas.

### PWA y despliegue
- Caché renovada: `galizische-bahn-v0.7.1-quality1`.
- Recursos principales con versión 0.7.1.
- `netlify.toml` evita almacenar versiones antiguas de `index.html`, `sw.js`, `version.json` y el manifiesto.
- Se conserva la misma clave de almacenamiento para migrar boletos y preferencias existentes.

### Conservado desde 0.7.0
- Navegación en cinco áreas.
- Frontera obligatoria en San Juan del Río.
- RB México en ambos sentidos.
- Advertencia del Auswärtiges Amt.
- Mapas urbanos y mapa ferroviario nacional.
