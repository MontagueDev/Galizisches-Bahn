# Informe QA — Galizische Bahn v0.9.3

## Resultado

**118/118 comprobaciones superadas.**

| Suite | Resultado |
|---|---:|
| Lógica y estructura | 84/84 |
| Navegador móvil y responsive | 24/24 |
| Compra y emisión de ticket | 5/5 |
| Idioma y tema | 5/5 |

## Cobertura principal

- 152 estaciones y 10 redes metropolitanas conservadas.
- 46 corredores oficiales conservados.
- ICE 1 continúa desde Puerto Vallarta hasta San Juan del Río.
- Búsqueda fuzzy con diacríticos y sinónimos DE/ES/EN.
- Acceso urbano automático y alternativas ICE/IC/RE/RB.
- RB México obligatorio en ambos sentidos.
- Cronología `Geplant → Einstieg → Unterwegs → Am Bahnhof/Grenzkontrolle → Beendet`.
- PBKDF2 para cuentas locales; contraseña de usuario no almacenada en texto claro.
- Login de pruebas precargado y autenticación correcta.
- Compra simulada completa y ticket activo emitido.
- Cambio a español y modo oscuro.
- Sin desbordamiento horizontal en 320, 375, 393 y 430 px.
- Sin errores de consola en los recorridos automatizados.
- `index.html` y `404.html` sincronizados y no vacíos.
- Recursos del Service Worker presentes y versionados.

## Corrección descubierta durante QA

La búsqueda inicial heredaba `09:15`. Al comprar después de esa hora, un boleto nuevo podía clasificarse inmediatamente como finalizado. La v0.9.3 calcula una hora futura redondeada y migra búsquedas antiguas que ya estén en el pasado.

## Límites

- La cuenta todavía es local; no hay backend remoto desplegado.
- Los pagos y datos Live son simulados.
- El HTML autónomo usa almacenamiento temporal en memoria; la PWA publicada usa localStorage + IndexedDB.
- La instalación y el comportamiento final del Service Worker deben verificarse en Safari real.
