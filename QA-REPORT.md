# QA Report — Galizische Bahn v0.8.0

## Resultado final

- **86/86 comprobaciones automatizadas aprobadas.**
- Errores de JavaScript o consola detectados en los recorridos: **0**.
- Viewports comprobados: **320, 375, 393 y 430 px**.
- Idiomas comprobados en interfaz: alemán, español e inglés.
- Catálogo de traducción: **461 claves por idioma**, sin ausencias frente al alemán.
- Recursos declarados por HTML, manifiesto y Service Worker: presentes.

## Áreas verificadas

### Interfaz y arquitectura
- Nueva navegación de cinco pestañas.
- Inicio adaptativo y menú Mehr en una columna en iPhone.
- Fecha calculada con el día local de México, no con UTC.
- Ausencia de desbordamiento horizontal en las cinco secciones principales.
- Modales de compra ajustados a todos los anchos probados.

### Compra
- Primera y Segunda Clase.
- Upgrade único de 24 GM desde Segunda Clase.
- Ausencia del upgrade cuando Primera Clase ya está seleccionada.
- Persistencia de asiento y extras al retroceder.
- Guardar, reanudar y descartar compras incompletas.
- Resumen previo al pago.
- Pago aprobado y tarjeta rechazada.
- Botón de pago recuperado tras un rechazo.

### Boletos y abonos
- Emisión de boleto y viaje activo.
- Asistente Live del viaje.
- Menú único de acciones del boleto.
- Generación de PDF.
- Cancelación, QR inválido, reembolso e historial.
- Cuatro productos Galizien-Ticket.
- Compra y cancelación de suscripción.
- Flujo urbano directo sin pasos ferroviarios innecesarios.

### México
- Advertencia exacta: `Das Auswärtige Amt rät von Reisen nach Mexiko ab.`
- Confirmación explícita antes de continuar.
- Galizia → tren nacional → San Juan del Río → migración → RB México.
- Buenavista → RB México → San Juan del Río → migración → tren nacional.
- Ausencia de ICE directo a Ciudad de México.

### Ciudad, mapas y operación
- Diez redes metropolitanas y sus mapas.
- Planificador urbano y detalle de línea.
- Tres modos del centro de mapas.
- Estaciones interactivas con tablero, andenes y accesibilidad.
- Panel operativo sin duplicación al actualizar.
- Centro de notificaciones y marcado de mensajes como leídos.

### Traducciones
- Alemán como interfaz inicial.
- Cambio global a español e inglés.
- Traducción de elementos del plano de asientos, incluidos Vagón/Mesa.
- Auditoría estática de todas las claves usadas por `t()`.

## Limitaciones conocidas

- Horarios, velocidades, retrasos, posiciones, incidencias, pagos y reembolsos son simulados.
- Las notificaciones del sistema dependen del soporte PWA del navegador; la bandeja interna sí funciona.
- No existe backend, sincronización, Apple Wallet ni pago real.
- La instalación y actualización final deben comprobarse en un Safari real después del despliegue.

Los resultados detallados están en `QA-RESULTS.json`.
