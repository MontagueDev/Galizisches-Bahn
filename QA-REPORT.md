# QA Report — Galizische Bahn v0.8.2

## Scope
UI and UX refinement based on v0.8.1.

## Verified
- JavaScript syntax for all modules.
- Valid PWA manifest and version metadata.
- New cache and versioned resources.
- Payment labels are outside controls and never use floating/overlapping labels.
- Expiry and security-code controls use one visual surface each.
- German source labels: “Gültig bis” and “Sicherheitscode (CVV)”.
- Reviewed Spanish and English equivalents.
- Consistent focus, validation and helper-text states.
- Action bar remains usable at 320–430 px.
- First-class, ticket, border and purchase logic inherited unchanged from v0.8.1.
- Existing local-storage schema remains compatible.

## Known limitation
Live operations and all payments remain simulated. Final visual behaviour of backdrop blur depends on Safari/iOS.
