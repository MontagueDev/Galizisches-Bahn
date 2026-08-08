# QA Report — Galizische Bahn v0.9.1

**Result: 49 / 49 checks passed**

## Coverage

- ✅ Version is 0.9.1 — 0.9.1
- ✅ Build is rail operations — 2026.08.05-rail-operations1
- ✅ Station database retained — 152
- ✅ Ten metropolitan networks retained — 10
- ✅ Official service catalogue has at least 40 lines — 46
- ✅ ICE network exists — 6
- ✅ IC network exists — 6
- ✅ RE network exists — 18
- ✅ RB network exists — 13
- ✅ NJ network exists — 3
- ✅ ICE 1 starts in Puerto Vallarta
- ✅ ICE 1 reaches the border
- ✅ RB México is separate
- ✅ Every corridor station exists
- ✅ Guadalajara board uses official services
- ✅ Puerto Vallarta to border returns journeys — 6
- ✅ Puerto Vallarta to border has valid times
- ✅ Puerto Vallarta to border has positive price
- ✅ Urban access to long-distance returns journeys — 6
- ✅ Urban access to long-distance has valid times
- ✅ Urban access to long-distance has positive price
- ✅ Major hub variety returns journeys — 6
- ✅ Major hub variety has valid times
- ✅ Major hub variety has positive price
- ✅ South to financial coast returns journeys — 6
- ✅ South to financial coast has valid times
- ✅ South to financial coast has positive price
- ✅ Regional transfer returns journeys — 6
- ✅ Regional transfer has valid times
- ✅ Regional transfer has positive price
- ✅ Outbound Mexico returns journeys — 3
- ✅ Outbound Mexico has valid times
- ✅ Outbound Mexico has positive price
- ✅ Inbound Mexico returns journeys — 3
- ✅ Inbound Mexico has valid times
- ✅ Inbound Mexico has positive price
- ✅ Urban origin receives U/S access
- ✅ Urban destination receives U/S egress
- ✅ Major route includes ICE option
- ✅ Major route includes IC option
- ✅ Mexico outbound ends with RB México
- ✅ Mexico inbound starts with RB México
- ✅ Route matrix has no empty results — 172 tested; 0 empty
- ✅ index and 404 are synchronized
- ✅ Service worker caches rail service model
- ✅ Application imports service catalogue
- ✅ Station board uses operating plan
- ✅ PDF uses A4 media box
- ✅ PDF includes GB corporate blue

## Browser smoke test

- Chromium loaded the standalone build with zero console or page errors.
- Puerto Vallarta Hbf → San Juan del Río returned six connections.
- The first direct ICE result displayed matching list and detail times.
- Corridor, platform, rolling-stock and frequency elements rendered in the detail sheet.

Safari remains the final reference browser for the Liquid Glass presentation.
