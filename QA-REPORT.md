# QA Report — Galizische Bahn v0.6.1

## Alcance

Parche de experiencia de usuario sobre la v0.6.0, centrado en:
- cancelación y navegación en compras;
- persistencia de selecciones al retroceder;
- selector de idioma;
- cambio completo de marca;
- actualización PWA.

## Verificación técnica

- Sintaxis válida: `app.js`, `data.js`, `store.js`, `routing.js`, `payment.js`.
- Manifiesto y `version.json` válidos.
- Todos los recursos declarados por el Service Worker existen.
- Caché renovada: `galizische-bahn-v0.6.1-ux1`.
- Se conserva la clave de almacenamiento `gbahn-v060-state` para migrar boletos y preferencias de v0.6.

## Flujos automatizados comprobados

1. La marca visible es “Galizische Bahn”.
2. La aplicación muestra la versión 0.6.1.
3. El detalle de una conexión incluye Cancelar.
4. La selección de asiento incluye Cancelar.
5. Se puede avanzar a datos del pasajero.
6. El asiento permanece seleccionado al volver.
7. Se puede avanzar a Pago.
8. Los suplementos permanecen al volver desde Pago.
9. El total no se duplica al avanzar y retroceder.
10. El número de tarjeta de prueba permanece al volver.
11. La fecha de vencimiento permanece y conserva su formato.
12. La × durante una compra abre confirmación.
13. “Continuar compra” devuelve al paso correcto.
14. “Descartar compra” cierra el proceso.
15. La compra de boleto urbano incluye Cancelar.
16. Atrás desde el pago urbano vuelve a In der Stadt.
17. El pago de una suscripción se abre correctamente.
18. Atrás desde la suscripción vuelve a los productos.
19. El selector de idioma presenta tres opciones claras.
20. Solo un idioma aparece seleccionado.
21. El cambio a español actualiza Perfil.
22. Perfil muestra “Español” como idioma activo.
23. No existe desbordamiento horizontal a 320 px.
24. Seleccionar México muestra el aviso de Bundespolizei.
25. Un pago aprobado genera un boleto.
26. La marca permanece correcta después de comprar.
27. Una tarjeta rechazada muestra error sin cerrar la compra.
28. El botón de pago se reactiva tras el rechazo.
29. El modo oscuro se aplica correctamente.
30. El modal de compra no se desborda a 320 px.
31. Los controles de Cancelar y Continuar siguen visibles a 320 px.
32. No se detectaron errores de JavaScript durante los flujos.

## Limitaciones

- Pagos, rutas, posiciones y horarios siguen siendo simulados.
- No deben introducirse datos bancarios reales.
- La instalación, actualización del Service Worker y pantallas de inicio deben comprobarse finalmente en Safari real.
