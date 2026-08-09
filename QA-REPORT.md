# QA Report — Galizische Bahn v0.9.2.1

**Automated logic/static result: 60 / 60 passed**  
**Regression browser smoke result: 20 / 20 passed**  
**Targeted built-in Testkonto browser result: 5 / 5 passed**  
**Executed assertions: 85 / 85 passed**

## Patch-specific coverage

- ✅ Built-in Testkonto is always available without registration.
- ✅ Test email is `test@galizischebahn.de`.
- ✅ Test password is `GBTest092!`.
- ✅ `Testkonto einsetzen` fills both login fields.
- ✅ Testkonto signs in successfully on a fresh app state.
- ✅ A user-created local PBKDF2 account can still coexist with the built-in Testkonto.
- ✅ Testkonto password reset is blocked intentionally.
- ✅ New v0.9.2.1 service-worker/cache identifiers are present.
- ✅ German, Spanish and English patch keys remain synchronized.

## Regression coverage retained

The 20-check Chromium regression run exercised home rendering, GB Konto registration/sign-in/sign-out, persisted test state, Live Journey chronology, developer time controls, completed-journey grouping, the San Juan del Río border-control stage, responsive widths at 320/375/393/430 px, and console/page-error monitoring.

The 60-check Node/static suite additionally covers the station and metropolitan catalogues, all official rail-service data, ICE 1 continuity from Puerto Vallarta to San Juan del Río, PBKDF2 credential behavior, timetable lifecycle states, delays/platform overrides, Mexico RB ordering, required PWA files and cache references.

## Browser-environment note

The sandbox blocks normal Chromium navigation to localhost and `file://`. The autonomous HTML was therefore exercised with Chromium `set_content`; the established regression harness uses in-memory Web Storage/WebCrypto substitutes. The PBKDF2 credential implementation itself is separately executed with Node Web Crypto in the logic suite. The built-in Testkonto does not depend on stored credentials, which is why it remains available on a fresh app state.

## Manual Safari checks recommended

Safari on iPhone remains the final visual reference for PWA safe areas, blur/material effects, keyboard behavior, actual storage persistence and service-worker update behavior.

All railway Live data, payments and the built-in Testkonto are simulated/testing features. Do not enter real banking credentials or reuse a real password in the demo.
