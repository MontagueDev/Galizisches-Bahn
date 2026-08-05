# Testing v0.7.1

## Tarjetas de prueba

- `4242 4242 4242 4242` — aprobada
- `5555 5555 5555 4444` — aprobada
- `4000 0027 6000 3184` — 3-D Secure simulado
- `4000 0000 0000 0002` — rechazada

Datos auxiliares:

- Vencimiento: `12/30`
- CVV: `123`

Nunca uses datos bancarios reales.

## Recorrido recomendado

1. Buscar una conexión nacional en 1. Klasse.
2. Elegir asiento y comprobar que Extras no ofrece otro upgrade a Primera Clase.
3. Llegar al resumen, volver y confirmar que clase, asiento y extras se conservan.
4. Completar un pago de prueba y abrir el boleto.
5. Probar QR ampliado, PDF, compartir, repetir viaje y cambio de asiento.
6. Cancelar el boleto y comprobar que el QR queda inválido y aparece en Cancelados.
7. Revisar el reembolso simulado en Historial.
8. Comprar un boleto urbano y comprobar sus condiciones de cancelación.
9. Buscar Guadalajara → Ciudad de México Buenavista y confirmar la advertencia del Auswärtiges Amt.
10. Confirmar que ambos sentidos internacionales pasan por San Juan del Río y usan RB México.
11. Abrir varias estaciones, cambiar entre salidas y llegadas y guardar favoritos.
12. Revisar mapas urbanos, español, inglés, modo oscuro y pantallas estrechas.

## PWA

Tras desplegar una actualización, abre el sitio en Safari, recarga y vuelve a abrir la PWA instalada. En Netlify, usa un despliegue limpio cuando el sitio siga mostrando una versión anterior.
