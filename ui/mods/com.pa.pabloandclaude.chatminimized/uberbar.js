// Chat Minimized: PA Chat (pachat) creates every channel window expanded.
// Applies the CHAT tab settings: startup state, open size, opacity, hide.
(function () {
    'use strict';

    var O = ChatMinOpc;
    var LAST = O.G + '.last';            // localStorage: { 'c:' + channel: [minimized 0/1, timestamp] }
    var LAST_DIAS = 30, LAST_MAX = 50;   // prune old private channels
    var tries = 0, TRIES_MAX = 120;      // 120 x 500 ms = 60 s waiting for PA Chat
    var maxOrig = null;                  // pachat MaxWindowHeight before we raise it
    var maxPuesto = null;                // value this mod set; restore only while it is still in place
    var aplicado = {};                   // last applied values, to act only on change
    var chat = null;

    // Keys are prefixed so a channel named '__proto__' or 'constructor' stays a plain own key.
    var ultimos = {};
    function clave(name) { return 'c:' + name; }
    // Not _.has/_.pick: lodash 4 reads '.' and '[' in channel names as paths.
    function tiene(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

    function leerUltimos() {
        var leido;
        try { leido = JSON.parse(localStorage[LAST] || '{}'); } catch (e) { leido = null; }
        ultimos = {};
        _.forEach(_.isPlainObject(leido) ? _.keys(leido) : [], function (k) {
            var v = leido[k];
            if (k.indexOf('c:') === 0 && _.isArray(v) && _.isNumber(v[1])) ultimos[k] = v;
        });
        // 1.0.0 used one key per channel ('<id>.last.<channel>'): migrate, then remove only if saved.
        var viejas = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf(LAST + '.') === 0) viejas.push(k);
            }
        } catch (e) {}
        _.forEach(viejas, function (k) {
            var n = clave(k.substr(LAST.length + 1));
            if (!tiene(ultimos, n)) ultimos[n] = [localStorage[k] === '0' ? 0 : 1, _.now()];
        });
        var limite = _.now() - LAST_DIAS * 864e5;
        var nombres = _.filter(_.keys(ultimos), function (n) { return ultimos[n][1] >= limite; });
        nombres = _.sortBy(nombres, function (n) { return -ultimos[n][1]; }).slice(0, LAST_MAX);
        var quedan = {};
        _.forEach(nombres, function (n) { quedan[n] = ultimos[n]; });
        ultimos = quedan;
        if (escribirUltimos())
            _.forEach(viejas, function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    }

    function escribirUltimos() {
        try { localStorage[LAST] = JSON.stringify(ultimos); return true; } catch (e) { return false; }
    }

    function guardarEstado(channel, value) {
        ultimos[clave(channel.Name)] = [value ? 1 : 0, _.now()];
        escribirUltimos();
    }

    function estadoInicial(channel) {
        var modo = O.valor('inicio');
        if (modo === 'open') return false;
        if (modo === 'last') {
            var v = tiene(ultimos, clave(channel.Name)) ? ultimos[clave(channel.Name)] : null;
            return !(v && v[0] === 0);
        }
        return true;
    }

    function aplicarTamano(channel) {
        var t = O.tamano(), w = t.ancho, h = t.alto;
        if (w !== null && ko.isObservable(channel.WindowWidth)) channel.WindowWidth(w);
        if (h !== null && ko.isObservable(channel.WindowHeight)) {
            // pachat caps the open height with its own MaxWindowHeight (default 560).
            if (ko.isObservable(chat.MaxWindowHeight) && chat.MaxWindowHeight() < h) {
                var actual = chat.MaxWindowHeight();
                if (maxPuesto === null || actual !== maxPuesto) maxOrig = actual;  // pachat's own value
                chat.MaxWindowHeight(h);
                maxPuesto = h;
            }
            channel.WindowHeight(h);
        }
    }

    // Back to pachat's own cap when no larger height is requested.
    function restaurarMax() {
        if (maxPuesto === null) return;
        var h = O.tamano().alto;
        if (h !== null && h > maxOrig) return;
        // Only undo our own raise: if pachat changed the cap since, its value wins.
        if (chat.MaxWindowHeight() === maxPuesto) chat.MaxWindowHeight(maxOrig);
        maxPuesto = null;
    }

    function aplicarTamanos() {
        restaurarMax();
        _.forEach(chat.Channels(), aplicarTamano);
    }

    function prepararCanal(channel) {
        if (!channel || !ko.isObservable(channel.minimized)) return;
        channel.minimized(estadoInicial(channel));
        // Seen this session: refresh its date so a channel kept open without clicks does not expire.
        var k = clave(channel.Name);
        if (tiene(ultimos, k)) { ultimos[k][1] = _.now(); escribirUltimos(); }
        channel.minimized.subscribe(function (value) { guardarEstado(channel, value); });
        aplicarTamano(channel);
    }

    function aplicarCss() {
        var op = O.medida('opacidad', 30, 100);
        var css = '.pachat-window-anchor{opacity:' + (op === null ? 1 : op / 100) + ';}' +
            (O.valor('ocultar') === 'on' ? '.pachat-window-anchor{display:none !important;}' : '');
        var $s = $('#chatmin-style');
        if (!$s.length) $s = $('<style id="chatmin-style"></style>').appendTo('head');
        $s.text(css);
    }

    // Settings are saved from the settings scene, which sends 'chatmin_reload' (see settings.js).
    function recargar() {
        if (!chat) return;
        try { api.settings.loadLocalData(); } catch (e) {}
        var actual = {
            ancho: O.valor('ancho'), alto: O.valor('alto'),
            opacidad: O.valor('opacidad'), ocultar: O.valor('ocultar')
        };
        if (actual.opacidad !== aplicado.opacidad || actual.ocultar !== aplicado.ocultar) aplicarCss();
        if (actual.ancho !== aplicado.ancho || actual.alto !== aplicado.alto) aplicarTamanos();
        aplicado = actual;
    }

    function hook() {
        chat = window.model && model.chatbox;
        if (!chat || !ko.isObservable(chat.Channels)) {
            // PA Chat missing or not ready yet (slow login): retry for ~60 s.
            if (++tries < TRIES_MAX)
                setTimeout(hook, 500);
            else
                console.log('[Chat Minimized] PA Chat (model.chatbox) not found after 60 s; mod inactive.');
            chat = null;
            return;
        }
        // A SAVE sent while we were still waiting for PA Chat was dropped: read settings fresh.
        try { api.settings.loadLocalData(); } catch (e) {}
        leerUltimos();

        _.forEach(chat.Channels(), prepararCanal);
        chat.Channels.subscribe(function (changes) {
            _.forEach(changes, function (change) {
                if (change.status === 'added')
                    prepararCanal(change.value);
            });
        }, null, 'arrayChange');

        aplicado = { ancho: O.valor('ancho'), alto: O.valor('alto') };
        aplicarCss();
        aplicado.opacidad = O.valor('opacidad');
        aplicado.ocultar = O.valor('ocultar');
        // Sizes are a percentage of the screen: recompute when the game window changes size.
        $(window).on('resize', _.debounce(aplicarTamanos, 300));
    }

    // Registered before app.registerWithCoherent (mods load first), so the panel accepts it.
    handlers.chatmin_reload = recargar;

    hook();
})();
