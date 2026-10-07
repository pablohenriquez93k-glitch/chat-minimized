# PA mod review — Chat Minimized 0.2.0

- Mod: `com.pa.pabloandclaude.chatminimized` v0.2.0, client, priority 101, build 124683 (= `version.txt`)
- Commit revisado: `0e83075` (main local, árbol limpio). Revisor: pa-mod-review-beta, sesión independiente.
- CLI (`review.mjs`): **Clean**, sin hallazgos, 14 archivos.
- **Veredicto: 0 Blocker, 0 Bug.** Apto para publicar.

## Hallazgos (juicio manual)
| ID | Severidad | Hallazgo |
|---|---|---|
| MAI-001 | Maintenance Risk | Acoplado a internos de PA Chat 2.1.4: `model.chatbox`, `Channels` (arrayChange), `channel.minimized/WindowWidth/WindowHeight/Name`, `chatbox.MaxWindowHeight`, clase `.pachat-window-anchor` y los mínimos 420x240. Todo con `ko.isObservable`, así que un cambio de PA Chat degrada a "no hace nada" sin romper. Re-verificar con cada versión de PA Chat. |
| CON-001 | Area of Concern | `hook()` abandona tras ~10 s (20 x 500 ms). Si PA Chat tarda más en crear `model.chatbox` (arranque lento), el mod no hace nada y no lo dice. Confirmar en máquina lenta o subir el límite. |
| Q-001 | Code Quality | `sondear()` llama `api.settings.loadLocalData()` cada 2 s durante toda la sesión, solo para ver cambios de Settings. Barato, pero perpetuo; un evento/handler de guardado sería más limpio. `loadLocalData` no se pudo confirmar estáticamente (va en `try`, sin riesgo). |
| Q-002 | Code Quality | `MaxWindowHeight` de PA Chat solo se sube, nunca se restaura al bajar el tamaño o elegir "No cambiar". Inofensivo (es un tope), pero el valor original no vuelve hasta reiniciar. |

## Verificado OK
- Triángulo identifier ↔ `ui/mods/<id>/` ↔ URLs de `scenes`: coherente; `G` se deriva de la ruta, así la copia TEST guarda ajustes aparte.
- Escenas `uberbar` y `settings` válidas; `comun.js` cargado antes en ambas.
- Pestaña de Settings: HTML inyectado antes de `applyBindings`, `local_only`, defaults coherentes con `DEF`; limpieza del ajuste retirado `global`.
- "Recordar último estado": guarda por canal en `localStorage` con prefijo del identifier; sin registro arranca minimizado (consistente).
- Opacidad acotada 30–100; ocultar con `display:none !important` y reversible.
- 22 tablas de traducción con 16 claves cada una; aviso de traducción automática en `description` y en la pestaña.
- `.gitattributes` excluye docs, README y CHANGELOG del zip. Sin `dependencies` declarado: aceptable (la descripción dice "Requires PA Chat").

## Unverified
- Sin prueba en juego en esta revisión (la del autor está en `docs/revision_pa_mod_review.md`).
- Orden de carga frente a PA Chat (priority 101) no comprobable estáticamente; el reintento lo cubre en la práctica.

## Huecos conocidos
`.papa` no parseados; sin pruebas en vivo.
