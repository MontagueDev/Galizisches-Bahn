# QA Report — Galizische Bahn v0.9.2

**Automated logic/static result: 55 / 55 passed**  
**Browser smoke result: 20 / 20 passed**  
**Combined tested assertions: 75 / 75 passed**

## Logic and static coverage

- ✅ Version is 0.9.2 — 0.9.2
- ✅ Build is GB Konto Live — 2026.08.08-gb-konto-live1
- ✅ Station database retained — 152
- ✅ Ten metropolitan networks retained — 10
- ✅ Official service catalogue retained — 46
- ✅ ICE 1 still begins at Puerto Vallarta — PVR → PAZ → GUA → LOW → KAR → SJR
- ✅ ICE 1 still reaches border
- ✅ Email normalized — test.user@gb.example
- ✅ Credential verifies correct password
- ✅ Credential rejects wrong password
- ✅ Credential does not store plaintext password
- ✅ Password policy rejects weak password
- ✅ 09:00 is scheduled — scheduled
- ✅ 09:50 is boarding — boarding
- ✅ 10:30 is underway — underway
- ✅ 11:00 reaches intermediate station — atStation
- ✅ 12:01 is completed — completed
- ✅ Underway position has progress — 0.25
- ✅ Completed journey progress is 100% — 1
- ✅ Developer jump advances to future timeline item — 31
- ✅ Delay override propagates
- ✅ Platform override propagates
- ✅ Mexico timeline enters border-control state — borderControl
- ✅ Mexico timeline includes border item
- ✅ Urban origin to long-distance returns journeys — 6
- ✅ Urban access is included
- ✅ Official ICE option remains
- ✅ Mexico outbound returns journeys — 3
- ✅ Mexico outbound ends with RB México
- ✅ Mexico inbound starts with RB México
- ✅ Required file exists: index.html — index.html
- ✅ Required file exists: 404.html — 404.html
- ✅ Required file exists: app.js — app.js
- ✅ Required file exists: app.css — app.css
- ✅ Required file exists: data.js — data.js
- ✅ Required file exists: rail-services.js — rail-services.js
- ✅ Required file exists: routing.js — routing.js
- ✅ Required file exists: store.js — store.js
- ✅ Required file exists: payment.js — payment.js
- ✅ Required file exists: i18n.js — i18n.js
- ✅ Required file exists: auth.js — auth.js
- ✅ Required file exists: live.js — live.js
- ✅ Required file exists: sw.js — sw.js
- ✅ Required file exists: manifest.webmanifest — manifest.webmanifest
- ✅ Required file exists: version.json — version.json
- ✅ index and 404 synchronized
- ✅ Service worker caches auth module
- ✅ Service worker caches live module
- ✅ App imports GB Konto module
- ✅ App imports live chronology module
- ✅ App has developer clock controls
- ✅ App has journey groups
- ✅ App refreshes clock-sensitive surfaces while open
- ✅ Authentication flow hides bottom navigation
- ✅ v0.9.2 German/Spanish/English translation keys match — 76/76/76

## Browser smoke coverage

- ✅ Home renders
- ✅ GB Konto login screen opens
- ✅ Authentication screen hides the bottom navigation
- ✅ Local account registration completes
- ✅ Account session is persisted in application state
- ✅ Plaintext password is absent from saved state
- ✅ Sign-out and subsequent sign-in complete
- ✅ Persisted state synchronizes into the running app store
- ✅ Real-clock active journey appears on Start
- ✅ Live chronology appears in Reisebegleiter
- ✅ Live view explicitly discloses that position is not GPS tracking
- ✅ Developer time controls open
- ✅ Finished journey moves to Abgeschlossen
- ✅ Mexico journey enters Grenzkontrolle state
- ✅ San Juan del Río appears in border chronology
- ✅ No horizontal overflow at 320 px
- ✅ No horizontal overflow at 375 px
- ✅ No horizontal overflow at 393 px
- ✅ No horizontal overflow at 430 px
- ✅ No console/page errors in the exercised flows

## Browser-environment note

The sandbox blocks Chromium navigation to localhost and `file://`. The autonomous HTML was therefore exercised through Chromium `set_content`; in-memory Web Storage/WebCrypto substitutes were used only for the browser harness. The production PBKDF2 credential code is separately executed against Node Web Crypto by the logic QA.

## Remaining manual reference checks

Safari on iPhone remains the visual reference for PWA safe areas, blur/material effects, keyboard behavior and persistence after a real browser/PWA restart.

All railway Live data and payments are simulated.
