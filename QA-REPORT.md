# QA Report — Galizische Bahn v0.7.1

## Resultado

- **59/59 comprobaciones aprobadas**
- Suite principal: **42/42**
- Suite de regresión: **17/17**
- Errores de JavaScript detectados durante los recorridos: **0**
- Viewports comprobados: **320, 375, 393 y 430 px**

## Compra y Primera Clase

- El flujo sigue cinco pasos y añade un resumen antes del pago.
- La clase, el asiento, los extras y los campos de prueba permanecen al retroceder.
- Una compra puede guardarse, reanudarse o descartarse.
- En 1. Klasse se asigna un coche de Primera Clase.
- El upgrade a Primera Clase no aparece cuando el pasajero ya eligió 1. Klasse.
- En 2. Klasse el upgrade sí aparece.
- El precio no se duplica al avanzar y retroceder.
- Una tarjeta aprobada genera boleto.
- Una tarjeta rechazada muestra error y vuelve a habilitar el botón de pago.

## Gestión de boletos

- Los boletos nuevos aparecen en Activos con QR válido.
- El menú de gestión abre correctamente.
- El cambio de asiento actualiza el boleto cuando la tarifa lo permite.
- El QR puede abrirse a pantalla completa.
- La descarga genera un archivo PDF local.
- La cancelación muestra las condiciones y el reembolso correspondiente.
- Al cancelar, el boleto cambia de estado, invalida el QR y se mueve a Cancelados.
- El reembolso simulado aparece en Historial.
- Los boletos urbanos no reembolsables muestran reembolso de 0 GM.
- Las suscripciones pueden comprarse y aparecen en su sección.

## Favoritos, estaciones y viaje

- Las rutas favoritas aparecen en Inicio.
- Las estaciones pueden guardarse como favoritas.
- Las ciudades pueden guardarse como favoritas.
- Los paneles de salidas y llegadas cambian correctamente.
- El control de notificaciones simuladas está disponible.

## Frontera y México

- La advertencia del **Auswärtiges Amt** aparece antes de mostrar resultados hacia o desde México.
- Galizia → México utiliza tren nacional hasta San Juan del Río y después RB México.
- México → Galizia comienza en RB México, pasa por San Juan del Río y continúa en tren nacional.
- No se ofrecen trenes ICE, IC, EC o NightJet directos a Buenavista.

## Transporte urbano, idiomas y apariencia

- Los diez sistemas metropolitanos incluidos generan sus mapas esquemáticos.
- Alemán, español e inglés cambian las pantallas comprobadas.
- El modo oscuro se aplica correctamente.
- No hay desbordamiento horizontal en 320, 375, 393 ni 430 px.

## Validación técnica

- Sintaxis comprobada en `app.js`, `data.js`, `routing.js`, `store.js`, `payment.js` y `sw.js`.
- `manifest.webmanifest` y `version.json` son JSON válidos.
- Todos los recursos declarados en el Service Worker existen.
- Caché: `galizische-bahn-v0.7.1-quality1`.
- `netlify.toml` desactiva la caché persistente de los archivos críticos.
- Se conserva la clave local anterior para migrar boletos y preferencias.

## Limitaciones

- Horarios, ocupación, posición, incidencias, notificaciones, reembolsos y pagos son simulados.
- No deben utilizarse datos bancarios reales.
- La instalación y actualización final de la PWA debe comprobarse también en Safari real después del despliegue.
