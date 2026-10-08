# Estado — Chat Minimized

## PUNTO DE RETOMA (2026-10-08)
- PUBLICADO 1.1.0 (tag v1.1.0, Release) sobre 1.0.0. TAREA rev-chat-01/02/03 de coord cerradas.
- 1.1.0: SAVE avisa a uberbar (api.Panel.message 'chatmin_reload', sin sondeo); hook 60 s + loadLocalData al enganchar; MaxWindowHeight solo deshace su propia subida (maxPuesto); estado por canal en <id>.last {'c:'+canal:[0/1,ts]}, refresco al ver canal, poda 30 días/50, migración 1.0.0 segura.
- Revisiones: /pa-mod-review sello d4b1d23167ec 0/0 (docs/pa_mod_review_1.1.0.md); Codex rev-chat-02 (Codex-Trabajador\salidaevision_codex_chatmin_1.1.0.md); code-reviewer y silent-failure-hunter 0/0 tras arreglos.
- Menor aceptados: sin reintento tras 60 s sin PA Chat; Settings en partida se aplican al volver al menú; escribirUltimos fallido sin log.
- REGLA: lanzar PA solo con turno de coord ("TURNO PA chatmin" / "PA libre"). Zips de Community Mods compartidos: si difieren del respaldo, no pisar y avisar.
- Aviso abierto: internos de pachat 2.1.4; MAI-002 depende de save() síncrono (api/settings.js:151).
- Actualizar = version+date+CHANGELOG en main. TEST en client_mods; perfil chatmin_test, puerto 9993.
