# QA Report — Galizisches Bahn v0.6.0

## Comprobaciones realizadas

### Integridad técnica
- Sintaxis verificada en `app.js`, `data.js`, `store.js`, `routing.js` y `payment.js`.
- Manifiesto PWA validado.
- Iconos del manifiesto confirmados.
- Todos los recursos declarados por el Service Worker existen.
- La caché fue actualizada a `galizisches-bahn-v0.6.0-r2`.

### Pruebas automatizadas en Chromium móvil
Viewport principal: 390 × 844 px.

Flujo verificado:
1. Apertura de la pantalla de inicio.
2. Navegación por las cinco secciones principales.
3. Apertura de `In der Stadt`.
4. Cálculo de una conexión urbana.
5. Selección de Ciudad de México Buenavista.
6. Aparición del aviso de Bundespolizei.
7. Búsqueda nocturna a México.
8. Aparición de una opción NightJet.
9. Apertura de los detalles ferroviarios.
10. Selección de tarifa.
11. Selección gráfica de asiento.
12. Confirmación de documentos internacionales.
13. Selección de suplemento de bicicleta.
14. Pago de prueba aprobado con Visa 4242.
15. Emisión y almacenamiento local del boleto.
16. Compra del Galizien-Ticket Standard.
17. Visualización de la suscripción activa.
18. Simulación de pago rechazado con la tarjeta 4000…0002.
19. Cambio de idioma a español.
20. Apertura de Betriebslage y del mapa nacional.

### Compatibilidad responsive
- Se comprobaron Inicio, Viajes, Ciudad, Tickets y Perfil a 320 px.
- No se detectó desbordamiento horizontal en esas pantallas.

### Consola
- No se detectaron errores de JavaScript durante los flujos automatizados.

## Limitaciones conocidas
- Horarios, retrasos, posiciones y pagos son simulados.
- No se procesan tarjetas reales.
- Las notificaciones, la instalación y las pantallas de inicio deben comprobarse finalmente en Safari real.
- La aplicación no está conectada a servidores ferroviarios ni bancarios.
