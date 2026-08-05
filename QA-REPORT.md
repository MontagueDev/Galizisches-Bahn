# QA Report — Galizische Bahn v0.8.5

## Corrected areas

- Bottom navigation geometry and active state.
- SVG icon sizing and alignment.
- Home-screen version label.
- Generic form wrappers.
- Home and long-distance composite search fields.
- Stadt city picker and route planner.
- PWA asset versioning and cache isolation.

## Static verification

- `index.html` and `404.html` are synchronised.
- Every bottom-navigation button uses the same SVG view box and a fixed grid cell.
- The active button cannot exceed its grid column.
- Generic `.field` wrappers no longer render as an additional visual surface.
- Resource query strings and Service Worker cache use v0.8.5.

## Device verification still recommended

Open the standalone preview in Safari and check Start and Stadt at the device's normal page zoom. If an installed PWA still shows an older bar, remove it once and reinstall after the new deployment finishes.
