# v0.9.3.1 — Apple HIG / iPhone Duo audit

This is a **PWA**, not a SwiftUI/UIKit app. Apple's native automatic tab/sidebar, Dynamic Type and reserved-region APIs do not apply automatically to custom HTML. This release implements responsive web analogues and **does not claim native HIG certification**.

## Implemented
- Flexible viewport-based navigation: five labeled tabs on tall compact screens, five labeled items in a vertical rail for wide and short screens.
- Responsive changes are pure CSS, so opening/closing a foldable preserves JS state and does not reload the app.
- Respect `env(safe-area-inset-*)` in header, navigation, content and modals.
- Focus-visible rings, reduced-motion support, scrollable content and 16px text entry fields.
- No user-agent / specific device resolution detection; supports other resizable screens.
- Preserved the existing train, route, account and ticket logic; data schema remains 13.

## Known limitations
- Actual iPhone Duo hardware, Safari PWA safe-area behavior and screen poses **not tested** here.
- Native iOS vertical system controls, reserved regions and true Dynamic Type require a native app; CSS is an approximation.
- Full accessibility audit (VoiceOver, text zoom, contrast) and end-to-end browser interactions still need device testing.
- No split list/detail pane in this patch; vertical navigation and wider content are the safe incremental step.

## Official Apple guidance consulted
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/design/human-interface-guidelines/tab-bars
- https://developer.apple.com/videos/play/tech-talks/111461/

## Device acceptance checklist
1. Outer display portrait/landscape and inner display portrait/landscape.
2. Partially folded and Split View with live resize.
3. Open search, login, results, ticket, modal, and city routes in each pose.
4. Confirm no control overlaps camera, hinge/reserved areas, or home indicator.
5. Confirm 200% text zoom, VoiceOver tab order and touch targets.
6. Confirm active ticket and form values survive resize.
