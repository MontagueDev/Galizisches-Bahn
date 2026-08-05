# Changelog

## 0.8.0 — Redesign & Live Network Update

### Rediseño integral
- Nuevo sistema visual compartido para tarjetas, botones, pestañas, formularios, alertas y modales.
- Menor uso del rojo, jerarquía tipográfica más clara y espaciado uniforme.
- Cartera de boletos rediseñada con pestañas compactas y tarjetas más equilibradas.
- Inicio, resultados, compra, mapas, estaciones, perfil y frontera rediseñados.
- Barra inferior con cinco secciones definitivas.

### Organización y eliminación de redundancias
- Una función vive en un único lugar y las acciones secundarias se agrupan en menús contextuales.
- Un solo estado central conserva conexión, clase, asiento, pasajero, extras, precio y pago.
- Un único motor calcula tarifas y suplementos.
- Flujos específicos para viajes, boletos urbanos y suscripciones.
- Información progresiva: lo esencial primero y los detalles bajo demanda.
- Botones Atrás, Cancelar y Continuar con comportamiento consistente.

### Compra y tarifas
- Flujo de cinco pasos con resumen antes del pago.
- Primera Clase ya seleccionada elimina el upgrade redundante de Extras.
- El upgrade desde Segunda Clase se aplica una sola vez.
- Estado conservado al retroceder, guardar o reanudar una compra.
- Tarjetas Flexpreis, Sparpreis, Super Sparpreis, Business Flex e International Flex.
- Pagos aprobados, rechazados y 3-D Secure simulados.

### Gestión de boletos
- Boleto digital con QR y modo de viaje.
- Cancelación, invalidación del QR y comprobante.
- Reembolso completo, parcial o nulo según tarifa.
- PDF, compartir, repetir viaje y cambiar asiento cuando procede.
- Secciones Activos, Abonos, Cancelados e Historial.

### Viaje y operación
- Inicio adaptativo con viaje actual.
- Asistente de viaje con progreso, velocidad, próxima parada, tiempo restante y andén.
- Centro de notificaciones.
- Operación simulada con incidencias, ocupación y cambios de andén.
- Salidas y llegadas por estación.

### Ciudad y mapas
- Diez redes metropolitanas U-Bahn/S-Bahn.
- Planificador urbano, salidas y mapas esquemáticos.
- Centro unificado de mapas: red nacional, red urbana y viaje actual.
- Estaciones interactivas con servicios, accesibilidad y plano de andenes.

### México y San Juan del Río
- San Juan del Río es el único nodo ferroviario fronterizo.
- Transbordo obligatorio entre tren nacional y RB México.
- Control migratorio y aduanero en ambos sentidos.
- Advertencia oficial del Auswärtiges Amt antes de buscar viajes a México.
- Estado, tiempo de espera y procedimiento fronterizo visibles.

### Idiomas y accesibilidad
- Alemán como fuente principal; traducción completa al español y al inglés.
- Catálogo central con 461 claves por idioma.
- Sin claves faltantes en los textos utilizados.
- Modo claro, oscuro y automático.
- Reducción de movimiento y diseño entre 320 y 430 px.

### PWA y despliegue
- Caché `galizische-bahn-v0.8.0-redesign3`.
- Módulos y estilos versionados con `0.8.0-r3`.
- Navegaciones, `index.html`, `404.html`, Service Worker y versión con política no-cache en Netlify.
- Conservación y migración de datos de v0.6–v0.7.1.
- Aviso interno cuando hay una actualización disponible.
