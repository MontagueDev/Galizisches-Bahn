# Testing — Galizische Bahn v0.8.0

## Tarjetas de prueba

- `4242 4242 4242 4242` — pago aprobado.
- `5555 5555 5555 4444` — pago aprobado.
- `4000 0027 6000 3184` — 3-D Secure simulado.
- `4000 0000 0000 0002` — pago rechazado.

Usa una fecha como `12/30`, CVV `123` y una dirección ficticia. **Nunca introduzcas datos bancarios reales.**

## Recorrido recomendado

1. Buscar Guadalajara Hbf → Löwenstadt Hbf en Segunda Clase.
2. Elegir asiento, activar el upgrade y comprobar que solo suma una vez.
3. Retroceder y confirmar que asiento y extras permanecen.
4. Pagar con una tarjeta aprobada.
5. Abrir el boleto, el QR, el PDF y el asistente Live.
6. Cancelar el boleto y comprobar QR inválido, reembolso e historial.
7. Repetir en Primera Clase y comprobar que no aparece el upgrade.
8. Buscar Ciudad de México Buenavista y revisar la advertencia del Auswärtiges Amt.
9. Confirmar el itinerario por San Juan del Río en ambos sentidos.
10. Abrir Stadt, cambiar entre las diez ciudades y revisar sus mapas.
11. Comprar un boleto urbano y un Galizien-Ticket.
12. Cambiar alemán → español → inglés y revisar textos largos.
13. Probar apariencia clara, oscura y automática.

## Actualización PWA

Después de publicar:

1. Abrir el sitio en una pestaña privada para comprobar la versión nueva.
2. Revisar que Mehr muestre `v0.8.0 · 2026.08.05-redesign-live3`.
3. Si una PWA instalada conserva la versión anterior, cerrarla, abrir Safari, recargar el sitio y aceptar la actualización.
4. Como último recurso, eliminar la PWA de la pantalla de inicio y añadirla de nuevo.
