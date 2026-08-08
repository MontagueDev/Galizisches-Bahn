# Changelog

## 0.9.2 — GB Konto & Live Journey Update

- Added integrated GB Konto authentication screens with the blue GB identity.
- Added local registration, sign-in, sign-out and password reset.
- Added PBKDF2-SHA-256 credential verification with random salt; no plaintext password storage.
- Added persistent local account sessions and authenticated profile state.
- Added `auth.js` as the dedicated authentication/security module.
- Added `live.js` as the timetable chronology engine.
- Added real-clock journey lifecycle states: planned, boarding, underway, at station, border control, completed and cancelled.
- Added timetable-derived journey position, progress, next stop, time remaining and estimated speed.
- Added dynamic delay, platform-change and connection-risk propagation.
- Added Bevorstehend / Aktuell / Abgeschlossen journey groups.
- Completed journeys now move out of the active-ticket view and are shown in history.
- Added San Juan del Río border control as a timed stage in Mexico journeys.
- Added developer controls for +15 min, +1 hour, next stop, finish journey, +5 min delay, platform change and clock reset.
- Added an explicit “Keine GPS-Ortung” disclosure to Live Journey views.
- Removed the bottom navigation from the authentication flow so it no longer covers account content.
- Retained the v0.9.1 official ICE, IC, RE, RB, NightJet and RB México operating plan.
- Updated PWA cache, schema, build metadata and standalone test build.
