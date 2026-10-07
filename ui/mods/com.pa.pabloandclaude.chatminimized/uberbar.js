// Chat Minimized: PA Chat (pachat) creates every channel window expanded.
// Applies the CHAT tab settings: startup state, open size, opacity, hide.
(function () {
    'use strict';

    var O = ChatMinOpc;
    var LAST = O.G + '.last.';           // localStorage: last minimized state per channel
    var tries = 0;
    var aplicado = {};                   // last applied values, to act only on change
    var chat = null;

    function guardarEstado(channel, value) {
        try { localStorage[LAST + channel.Name] = value ? '1' : '0'; } catch (e) {}
    }

    function estadoInicial(channel) {
        var modo = O.valor('inicio');
        if (modo === 'open') return false;
        if (modo === 'last') {
            var v;
            try { v = localStorage[LAST + channel.Name]; } catch (e) { v = undefined; }
            return v !== '0';
        }
        return true;
    }

    function aplicarTamano(channel) {
        var t = O.tamano(), w = t.ancho, h = t.alto;
        if (w !== null && ko.isObservable(channel.WindowWidth)) channel.WindowWidth(w);
        if (h !== null && ko.isObservable(channel.WindowHeight)) {
            // pachat caps the open height with its own MaxWindowHeight (default 560).
            if (chat && ko.isObservable(chat.MaxWindowHeight) && chat.MaxWindowHeight() < h)
                chat.MaxWindowHeight(h);
            channel.WindowHeight(h);
        }
    }

    function prepararCanal(channel) {
        if (!channel || !ko.isObservable(channel.minimized)) return;
        channel.minimized(estadoInicial(channel));
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

    // Settings are saved from the settings scene; re-read them at most every 2 s.
    function sondear() {
        try { api.settings.loadLocalData(); } catch (e) {}
        var actual = {
            ancho: O.valor('ancho'), alto: O.valor('alto'),
            opacidad: O.valor('opacidad'), ocultar: O.valor('ocultar')
        };
        if (actual.opacidad !== aplicado.opacidad || actual.ocultar !== aplicado.ocultar) aplicarCss();
        if (actual.ancho !== aplicado.ancho || actual.alto !== aplicado.alto) _.forEach(chat.Channels(), aplicarTamano);
        aplicado = actual;
    }

    function hook() {
        chat = window.model && model.chatbox;
        if (!chat || !ko.isObservable(chat.Channels)) {
            // PA Chat missing or not ready yet: retry for ~10 s, then give up quietly.
            if (++tries < 20)
                setTimeout(hook, 500);
            return;
        }

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
        setInterval(sondear, 2000);
        // Sizes are a percentage of the screen: recompute when the game window changes size.
        $(window).on('resize', _.debounce(function () { _.forEach(chat.Channels(), aplicarTamano); }, 300));
    }

    hook();
})();
