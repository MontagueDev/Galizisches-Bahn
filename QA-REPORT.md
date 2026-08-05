# QA Report — Galizische Bahn v0.8.1

## Alcance

Refinamiento visual Liquid Glass sobre la v0.8.0, sin retirar funciones ni datos.

## Verificación técnica

- Sintaxis JavaScript comprobada en todos los módulos.
- `manifest.webmanifest` y `version.json` válidos.
- Recursos PWA versionados con `0.8.1-lg1`.
- Caché renovada: `galizische-bahn-v0.8.1-liquid-glass1`.
- Conservación del esquema de datos de v0.8.0.
- Pie técnico sustituido por el aviso legal de Galizische Bahn AG.

## Revisión visual

- Superficies adaptativas en modo claro y oscuro.
- Barra inferior flotante con material translúcido.
- Tarjetas, botones, campos, alertas y hojas inferiores unificados.
- Jerarquía tipográfica revisada.
- Estados vacíos e indicadores de progreso refinados.
- Fallback opaco para navegadores sin `backdrop-filter`.
- Ajustes específicos para 320–430 px.

## Limitaciones

- Liquid Glass se aproxima mediante CSS; no es el material nativo de UIKit.
- Pagos, horarios, operación y notificaciones siguen siendo simulados.
- La instalación y actualización final de la PWA deben comprobarse en Safari real.
