# Revisión /pa-mod-review — Chat Minimized 0.2.0 (build 124683, 2026-10-07)

**Veredicto: carga limpia. 0 Blocker, 0 Bug.** CLI: "Clean. No findings" (`revision_cli.md`).

| ID | Severidad | Hallazgo | Juicio |
|---|---|---|---|
| MNT-002 | Maintenance Risk | Depende de internos de PA Chat 2.1.4: `model.chatbox.Channels`, `channel.minimized`, `WindowWidth/WindowHeight`, `chat.MaxWindowHeight`, clase `.pachat-window-anchor` | Aceptado (no hay API pública). Cada uso tiene guarda (`ko.isObservable`/`_.isFunction`); si pachat cambia, la opción afectada no hace nada, sin errores. Re-probar con cada versión de pachat. |
| CON-003 | Area of Concern | Alto > 560 px sube `MaxWindowHeight` de pachat (su propio ajuste, persistido en su localStorage) | Necesario: pachat recorta el alto con ese tope. Solo sube, nunca baja; el jugador puede bajarlo en el menú de pachat. |
| CON-006 | Area of Concern | Tamaño en % de pantalla: pachat limita el alto abierto a 900 px y el arrastre a 1400 px de ancho | En 4K con escala de UI 1:1, 71,11 % puede superar 900 px y pachat lo recorta. A confirmar en 4K si importa. |
| QUA-005 | Code Quality | Sondeo cada 2 s (`api.settings.loadLocalData`) en uberbar toda la sesión | Patrón de la base (≤1/s permitido); costo: un JSON.parse de localStorage. Actúa solo si cambió un valor. |

Juicio manual: ES5 OK; HTML de la pestaña inyectado síncrono (receta CONF iconos); textos con `!LOC:` y bundle por idioma (23 idiomas + alias zh-HK); grupo de settings derivado de la ruta `ui/mods/<id>/` para que TEST y publicada no compartan ajustes; `local_only: true`.
Descartada la sugerencia 3 ("no abrirse solo con mensaje nuevo"): pachat nunca abre una ventana sola (único `minimized(false)` es `toggleMinimized`, verificado en el código).
Huecos: revisión hecha por la misma sesión que escribió el mod; sello pendiente (otra sesión).
