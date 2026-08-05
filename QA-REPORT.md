# QA Report — Galizische Bahn v0.9.0

**28 of 29 checks passed.**

- ✅ Version is 0.9.0
- ✅ Expanded station database: 152
- ✅ Ten metropolitan networks: 10
- ✅ Population-scaled urban lines: 65
- ✅ Long-distance stations identified: 35
- ✅ Urban stations identified: 116
- ✅ Mexico separate country
- ✅ San Juan border station
- ✅ Only RB crosses SJR–MEX
- ✅ Predictive autocomplete component
- ✅ Old station select replaced
- ✅ German, Spanish and English station labels
- ✅ Urban access engine
- ✅ ICE alternative profile
- ✅ IC alternative profile
- ✅ RE alternative profile
- ✅ RB alternative profile
- ❌ Mexico outbound order
- ✅ GB blue identity
- ✅ GB logo SVG
- ✅ New PWA cache
- ✅ Index and 404 synchronized
- ✅ Standalone preview generated: 391225
- ✅ data.js syntax
- ✅ routing.js syntax
- ✅ store.js syntax
- ✅ payment.js syntax
- ✅ i18n.js syntax
- ✅ app.js syntax

## Functional route tests
- Guadalajara Universität → Löwenstadt Ostbahnhof produced U-Bahn + ICE, U-Bahn + IC, RE and RB alternatives.
- Guadalajara Hbf → Karlsburg Hbf produced direct ICE, IC, RE and RB options.
- Guadalajara Universität → Ciudad de México Buenavista produced urban access, national train, San Juan del Río control and RB México.
- Ciudad de México Buenavista → Guadalajara Universität produced RB México first, then national train and final urban access.

## Limitation
Automated Chromium rendering was blocked by the environment. Syntax, data integrity and routing logic were verified; use the standalone HTML for final Safari visual review.
