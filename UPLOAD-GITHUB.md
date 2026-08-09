# Upload to GitHub / Netlify — v0.9.2.1

Replace **every file** in the repository root and the complete `icons` directory with this release.

This patch changes `auth.js`, `app.js`, `app.css`, version metadata and the service-worker cache key. The new cache identifier is intentionally different so Safari/Netlify do not keep the older v0.9.2 scripts.

Recommended commit:

`Patch Galizische Bahn v0.9.2.1 Testkonto`

After the GitHub commit finishes, in Netlify use **Clear cache and deploy site**. Then fully close and reopen an installed Safari PWA so the new service worker can take control.

Built-in QA credentials:

- `test@galizischebahn.de`
- `GBTest092!`

These credentials are intentionally public test credentials and must never be reused for a real account.
