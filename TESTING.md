# Testing v0.7.0

Tarjetas de prueba:

- `4242 4242 4242 4242` — aprobada
- `5555 5555 5555 4444` — aprobada
- `4000 0027 6000 3184` — 3-D Secure simulado
- `4000 0000 0000 0002` — rechazada

Datos auxiliares:

- Vencimiento: `12/30`
- CVV: `123`

Nunca uses datos bancarios reales.

Pruebas recomendadas en Safari:

1. Buscar Guadalajara → Ciudad de México Buenavista.
2. Cancelar y volver a abrir la advertencia del Auswärtiges Amt.
3. Confirmar que el itinerario pasa por San Juan del Río y continúa en RB.
4. Probar el recorrido inverso desde Buenavista.
5. Abrir Stadt → Liniennetz y revisar varias ciudades.
6. Instalar la PWA y comprobar la actualización de caché.
