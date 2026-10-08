# PA mod review — Chat Minimized 1.1.0

- Árbol local sin commit; diff contra `origin/main` (1.0.0). Revisor: pa-mod-review-beta (tarea rev-chat-02).
- CLI: **Loads cleanly**, 0 Blocker, 0 Bug; QUA-002 (`docs/diff_1.0.0_1.1.0.patch` sin referencia: está en `docs`, export-ignore, no se publica) y UNV-001 (pachat en `download\pachat.zip`, resuelto en 0.2.1).
- **Veredicto: 0 Blocker, 0 Bug.**

## Verificado contra el juego base (build 124683)
- `handlers.chatmin_reload` en uberbar: `uberbar.js` crea `handlers = {}` (l. 1228) ANTES de `loadMods` (l. 1289) y registra con `app.registerWithCoherent(model, handlers)` después (l. 1292). El handler queda registrado. OK.
- `api.Panel.message('uberbar', ...)`: mismo patrón que `connect_to_game.js:619`. OK.
- Envoltura de `api.settings.save`: el original escribe `localStorage` de forma SÍNCRONA antes de devolver la promesa (`api/settings.js:151-170`), así que cuando uberbar recibe el mensaje y llama `loadLocalData()` los datos ya están. Sin carrera.
- Lodash 3.9.3: `_.now`, `_.pick(obj, array)`, `_.sortBy`, `_.filter`, `_.keys` existen.
- Migración de localStorage: junta las claves `<id>.last.<canal>` antes de borrar (no muta durante el recorrido); la clave nueva `<id>.last` no coincide con el prefijo `<id>.last.`. Poda: 30 días y máximo 50, ordena por fecha descendente. Correcto.
- `hook()`: 120 x 500 ms = 60 s y log en consola al rendirse; `recargar()` sale si `chat` es null. Correcto.
- `MaxWindowHeight`: guarda el original al enganchar, sube solo si hace falta y `restaurarMax()` vuelve al original cuando el alto pedido cabe o es "No cambiar".

## Hallazgos
| ID | Severidad | Hallazgo |
|---|---|---|
| MAI-001 | Maintenance Risk | Sigue: depende de internos de PA Chat 2.1.4 (`model.chatbox`, `Channels`, `MaxWindowHeight`, `.pachat-window-anchor`). Degrada sin romper. |
| MAI-002 | Maintenance Risk | Nuevo: envuelve `api.settings.save` de la escena settings y depende de que `settings.js` del juego lo llame (l. 402) y de que escriba `localStorage` antes de resolver. Si un parche lo hace asíncrono, los cambios llegarían a uberbar un guardado tarde. |
| QUA-001 | Code Quality | `CHANGELOG.md` (nuevo, sin seguimiento) no está en `.gitattributes` → entrará en `main.zip`. Inofensivo; añadir `CHANGELOG.md export-ignore` si no se quiere en el zip. |
| — | Resueltos | CON-001 (rendirse a los 10 s), Q-001 (sondeo cada 2 s) y Q-002 (MaxWindowHeight sin restaurar) de 0.2.0. |

## Unverified
- Sin prueba en juego en esta revisión (mensaje settings→uberbar y migración de claves 1.0.0).
- No se comprobó que la escena settings dentro de partida comparta el mismo panel `uberbar` (el patrón del juego indica que sí).

## Delta tras corrección de Codex (rev-chat-03, 2026-10-08)
Mi pasada anterior NO vio los 2 Bug de Codex (`Codex-Trabajador\salida\revision_codex_chatmin_1.1.0.md`). Revisado el `uberbar.js` corregido:
- **Bug 1 (MaxWindowHeight) — corregido.** `maxPuesto` guarda lo que puso el mod; `maxOrig` se toma justo antes de subir (y se renueva si PA Chat cambió el tope). `restaurarMax()` solo restaura si el valor actual sigue siendo `maxPuesto`; si PA Chat lo cambió, gana el suyo. Correcto en subir→subir, subir→keep, y PA Chat cambiando entre medias.
- **Bug 2 (migración) — corregido.** Las claves 1.0.0 se borran solo si `escribirUltimos()` devuelve true. Si falla, siguen y se re-migran al próximo arranque.
- **Menor 1 (`__proto__`) — corregido.** Claves `'c:' + canal`, `hasOwnProperty`, y al parsear solo se aceptan claves `c:` con `[n, número]`. Sin `_.has`/`_.pick` (lodash 4 trata `.`/`[` como rutas). `_.isPlainObject`, `_.isNumber`, `_.now` existen en lodash 3 y 4.
- **Menor 2 (60 s sin recuperar) — se mantiene, aceptado.** Documentado en CHANGELOG; solo `console.log`.
- `settings.js` sin cambios desde mi pasada. CLI: Loads cleanly (QUA sobre docs y UNV-001 pachat, ya resuelto).
- **Veredicto delta: 0 Blocker, 0 Bug.** Re-sellado.

## Delta 2 (rev-chat-03b, 2026-10-08): cambios tras code-reviewer y silent-failure-hunter
- `prepararCanal`: renueva la fecha del canal ya guardado (`ultimos[k][1] = _.now()` + `escribirUltimos()`). Se ejecuta después de `estadoInicial`, así que no altera el estado elegido; solo afecta canales con registro previo. Una escritura de localStorage por canal al enganchar: coste despreciable. Correcto.
- `hook()`: `api.settings.loadLocalData()` antes de `leerUltimos()` y antes de fijar `aplicado`. Cubre el SAVE perdido mientras se esperaba a PA Chat (el handler `recargar` sale si `chat` es null). Envuelto en `try`. Correcto.
- CLI: Loads cleanly (QUA docs, UNV-001 pachat ya resuelto).
- **Veredicto delta 2: 0 Blocker, 0 Bug.** Re-sellado.

- Delta 3: `CHANGELOG.md` añade "Known limit" (ajustes guardados en el menú Settings dentro de partida se aplican al volver al menú principal). Solo texto; aclara el Unverified sobre settings en partida. Re-sellado.
