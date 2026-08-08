# Galizische Bahn v0.9.2 — GB Konto & Live Journey Update

Galizische Bahn v0.9.2 builds on the complete v0.9.1 operating plan and adds two connected systems: a persistent on-device **GB Konto** and a timetable-driven **Live Journey chronology**.

German remains the canonical source language. Spanish and English are reviewed translations of the same interface concepts.

## Main additions

- Integrated GB Konto sign-in, registration, sign-out and local password reset
- Persistent on-device account session and profile
- PBKDF2-SHA-256 password verifier with per-account salt; plaintext passwords are never stored
- Real-clock journey lifecycle: `Geplant → Einstieg → Unterwegs → Am Bahnhof / Grenzkontrolle → Beendet`
- Timetable-derived position and progress; the app explicitly does **not** claim GPS tracking
- Dynamic next stop, remaining time, platform, delay and connection status
- Clock-sensitive Home/Tickets/My Journeys surfaces refresh automatically while the app remains open
- Journey groups: `Bevorstehend`, `Aktuell`, `Abgeschlossen`
- Completed journeys move automatically into history and tickets become completed/used
- San Juan del Río immigration stage integrated into the live chronology before/after RB México
- Developer controls to advance demo time, jump to the next stop, add delay, simulate a platform change or finish a journey
- Account screens hide the bottom navigation to keep authentication focused and uncluttered
- Existing v0.9.1 ICE, IC, RE, RB, NightJet, U-Bahn and S-Bahn operating model retained

## Account model in v0.9.2

The included GB Konto is a **real local account for this device**, not a cloud account. Its verifier and session are stored in the app's local state. Clearing site data or moving to another device removes the local account unless a future remote backend is configured.

`auth.js` contains the account/security layer and a backend-status hook for a future Supabase deployment, but this release does **not** include deployed Supabase credentials or cross-device synchronization.

## Live-data model

All railway Live data is simulated from the fictional Galizische Bahn timetable and the device clock. Position between stations is estimated from scheduled segment times and any simulated delay. No real train telemetry or GPS feed is used.

All payments remain demo-only. Never enter real banking information.
