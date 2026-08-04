# QA Report — Galizische Bahn v0.7.0

## Resultado

- **53/53 comprobaciones aprobadas**
- Errores de JavaScript de página: **0**
- Errores de consola: **0**
- Viewports comprobados: **320, 375, 393 y 430 px**

## Frontera y México

- Todas las conexiones ferroviarias entre cualquier estación disponible de Galizia y México pasan por **San Juan del Río Grenzbahnhof**.
- El único tramo que entra o sale de Ciudad de México Buenavista es **RB México** entre San Juan del Río y Buenavista.
- No existen enlaces ICE, IC, EC o NightJet directos a México.
- Se comprobó el orden Galizia → tren nacional → San Juan del Río → control → RB → Buenavista.
- Se comprobó el orden Buenavista → RB → San Juan del Río → control → tren nacional → Galizia.
- La advertencia del **Auswärtiges Amt** aparece antes de mostrar resultados y exige cancelar o continuar.

## Navegación y experiencia

- Cinco áreas principales: Start, Reisen, Stadt, Tickets y Mehr.
- Red, operación, frontera, perfil y ajustes agrupados dentro de Mehr.
- Cancelar, volver y cerrar funcionan durante la compra.
- Asiento, documento y extras permanecen al retroceder.
- Compra aprobada genera boleto.
- Tarjeta rechazada conserva el proceso y reactiva el botón de pago.
- Descartar compra cierra el proceso correctamente.

## Transporte urbano y mapas

- Los diez sistemas metropolitanos incluidos generan un mapa esquemático U-Bahn/S-Bahn.
- Los detalles de línea se abren desde el mapa.
- El mapa nacional contiene una única línea RB México y marca San Juan del Río como nodo fronterizo.

## Idiomas, apariencia y responsive

- Alemán, español e inglés disponibles.
- Cambio de idioma aplicado a la navegación y pantallas principales.
- Modo oscuro comprobado.
- Sin desbordamiento horizontal en 320, 375, 393 ni 430 px.

## Validación técnica

- Sintaxis comprobada en `app.js`, `data.js`, `routing.js`, `store.js`, `payment.js` y `sw.js`.
- `manifest.webmanifest` y `version.json` son JSON válidos.
- Todos los recursos declarados en el Service Worker existen.
- Caché: `galizische-bahn-v0.7.0-border1`.
- Se mantiene la clave local de v0.6 para conservar boletos y preferencias existentes.

## Limitaciones

- Horarios, ocupación, posición, incidencias y pagos son simulados.
- No deben utilizarse datos bancarios reales.
- La instalación y actualización final de la PWA deben comprobarse también en Safari real.
