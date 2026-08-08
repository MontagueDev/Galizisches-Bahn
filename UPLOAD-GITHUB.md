# Upload to GitHub / Netlify

Replace **every file** in the repository root and the complete `icons` directory.

New required v0.9.2 modules:

- `auth.js`
- `live.js`

Keep `rail-services.js` from the v0.9.1 operating-plan system.

Recommended commit:

`Release Galizische Bahn v0.9.2`

After the GitHub commit finishes, in Netlify use **Clear cache and deploy site**. If an installed Safari PWA still displays an older build, close it completely and reopen it after the new service worker activates; reinstall only if Safari continues to retain the old installation.

The GB Konto in this release is local to the device. No Supabase credentials are included in the repository.
