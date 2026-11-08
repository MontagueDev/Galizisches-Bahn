# Arquitectura v0.9.3

## Principios

1. Una sola fuente de verdad para cuenta, búsqueda, tickets, viajes, operación y preferencias.
2. Las pantallas no calculan su propio estado ferroviario.
3. La UI recibe datos ya derivados mediante selectores.
4. Los datos persistidos se migran; nunca se sobrescriben silenciosamente por una actualización.
5. La caché contiene archivos de aplicación, no contraseñas ni datos bancarios.

## Flujo de datos

```text
STATIONS / RAIL_SERVICES
          ↓
      routing.js
          ↓
        store.js ← auth.js / payment.js / live.js
          ↓
     selectors.js
          ↓
        app.js
```

`persistence.js` refleja el estado de `store.js` en IndexedDB como red de seguridad. El formato histórico de localStorage sigue siendo compatible.

## Estrategia de renderizado

- Navegación completa: render de la vista solicitada.
- Reloj Live: actualización parcial cuando es posible.
- Página oculta: sin actualizaciones periódicas.
- Modal abierto: sin repintado del contenido subyacente.
- Mapas y contenido pesado se crean únicamente al abrir su sección.

## Búsqueda de estaciones

`core.js` crea un índice normalizado al arrancar. La consulta puntúa:

- coincidencia exacta;
- prefijo del nombre o ciudad;
- palabras parciales;
- subsecuencia tolerante;
- favoritos y recientes;
- prioridad de Hbf/Fernverkehr.

## Próximo paso hacia backend

La interfaz `auth.js` ya separa la cuenta del resto de la UI. Para sincronización real, el siguiente paso sería reemplazar el adaptador local por Supabase/Firebase/Node sin reescribir las pantallas.
