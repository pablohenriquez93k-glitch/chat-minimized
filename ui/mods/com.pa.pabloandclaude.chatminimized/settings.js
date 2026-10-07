// Chat Minimized: CHAT tab in Settings. HTML is injected synchronously, before ko.applyBindings.
(function () {
    'use strict';
    var O = ChatMinOpc, G = O.G;
    O.registrarIdiomas();
    var L = function (t) { return '!LOC:' + t; };
    var tamTxt = [L('Do not change')].concat(O.TAMANOS.map(function (t) {
        return t === 'min' ? L('Minimum') : t === 'max' ? L('Maximum') : t + '%';
    }));
    var opacidades = ['100', '90', '80', '70', '60', '50', '40', '30'];
    var onOff = { options: ['off', 'on'], optionsText: ['!LOC:OFF', '!LOC:ON'] };

    api.settings.definitions[G] = {
        title: L('CHAT'),
        local_only: true,
        settings: {
            inicio: { title: L('On startup'), type: 'select', options: ['min', 'open', 'last'], optionsText: [L('Minimized'), L('Open'), L('Remember last state')], default: O.DEF.inicio },
            ancho: { title: L('Open window width'), type: 'select', options: ['keep'].concat(O.TAMANOS), optionsText: tamTxt, default: O.DEF.ancho },
            alto: { title: L('Open window height'), type: 'select', options: ['keep'].concat(O.TAMANOS), optionsText: tamTxt, default: O.DEF.alto },
            opacidad: { title: L('Window opacity'), type: 'select', options: opacidades, optionsText: opacidades.map(function (n) { return n + '%'; }), default: O.DEF.opacidad },
            ocultar: { title: L('Hide the chat completely'), type: 'select', options: onOff.options, optionsText: onOff.optionsText, default: O.DEF.ocultar }
        }
    };
    // Drop the removed "mute Global" value from early 0.2.0 test builds; saved on the next SAVE.
    try { if (api.settings.data[G]) delete api.settings.data[G].global; } catch (e) {}

    function opt(k) {
        return '<div class="option" data-bind="template: { name: \'setting-template\', data: $root.settingsItemMap()[\'' + G + '.' + k + '\'] }"></div>';
    }
    function nota(t) {
        return '<div class="option" style="padding:6px 0;font-style:italic" data-bind="text: loc(\'' + L(t) + '\')"></div>';
    }
    var html =
        '<div class="option-list chatmin" style="max-height:100%;overflow-y:auto" data-bind="visible: ($root.settingGroups().indexOf(\'' + G + '\') === $root.activeSettingsGroupIndex())">' +
        '<div class="form-group" style="flex-shrink:0"><div class="sub-group-title" data-bind="text: loc(\'' + L('PA CHAT WINDOW') + '\')"></div>' +
        '<div class="sub-group top">' + ['inicio', 'ancho', 'alto', 'opacidad', 'ocultar'].map(opt).join('') + '</div>' +
        '<div class="sub-group">' + nota('Sizes are a percentage of the screen.') + nota('Changes apply after SAVE. Requires the PA Chat mod.') + nota('Translations are automatic and may contain errors.') + '</div>' +
        '</div></div>';

    if ($('.container_settings').length) $('.container_settings').append(html);
    else $(function () { $('.container_settings').append(html); });
    if (window.model && model.settingDefinitions) {
        model.settingDefinitions(api.settings.definitions);
        model.settingDefinitions.valueHasMutated();
    }
})();
