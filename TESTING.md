# Testing — v0.9.2

## Automated logic/static QA

Run from the release root:

```bash
node qa-v092.mjs
```

The final internal run passed **55 / 55** checks covering:

- v0.9.2 build/schema and required files
- station, metropolitan and official rail-service catalogues
- ICE 1 Puerto Vallarta → San Juan del Río continuity
- PBKDF2 local credential creation and verification
- rejection of incorrect passwords and weak passwords
- no plaintext password in stored credential data
- all Live Journey lifecycle states
- journey progress and developer time jumps
- delay and platform overrides
- Mexico border-control chronology
- urban access to long-distance routes
- official ICE alternatives
- Mexico outbound/inbound RB ordering
- PWA caching of the new authentication and Live modules
- synchronized `index.html` / `404.html`
- authentication screen navigation suppression
- automatic refresh of clock-sensitive surfaces
- matching v0.9.2 translation keys in German, Spanish and English

## Browser smoke QA

A Chromium smoke run passed **20 / 20** UI/runtime checks covering:

- home rendering
- GB Konto login and registration
- persistent account state in the test store
- no plaintext password in saved state
- sign-out and sign-in
- real-clock active journey rendering
- journey chronology and no-GPS disclosure
- developer clock controls and finishing a journey
- completed-journey grouping
- San Juan del Río border-control chronology
- responsive layouts at 320, 375, 393 and 430 px
- zero page/console errors in the tested flow

The execution environment blocks Chromium navigation to localhost and `file://`, so the browser smoke test loads the autonomous build with `set_content` and substitutes in-memory Web Storage/WebCrypto APIs. The actual PBKDF2 implementation is tested separately with Node Web Crypto in the 55-check logic suite.

## Manual Safari checks recommended before deployment

1. Create a local GB Konto, close the PWA, reopen it and confirm the session remains active.
2. Sign out and sign in again.
3. Buy a demo ticket scheduled near the current time and follow it through boarding/underway/completed states.
4. Open Entwickleroptionen and test each demo-time control.
5. Test a journey to and from Ciudad de México Buenavista and confirm the San Juan del Río control stage.
6. Check Start, Reisen, Tickets and Meine Reisen after the journey finishes.
7. Test German, Spanish and English at 320–430 px.
8. Verify dark mode and PWA update behavior.

All railway status and payment data are simulated.
