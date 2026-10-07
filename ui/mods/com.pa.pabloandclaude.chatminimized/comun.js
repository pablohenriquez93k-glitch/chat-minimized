// Chat Minimized: shared settings, defaults and translations (scenes settings and uberbar).
var ChatMinOpc = (function () {
    'use strict';
    // The TEST build rewrites this path, so TEST and release keep separate settings.
    var G = 'ui/mods/com.pa.pabloandclaude.chatminimized/'.split('/')[2];

    var DEF = { inicio: 'min', ancho: 'keep', alto: 'keep', opacidad: '100', ocultar: 'off' };
    // Open size: 'min' = PA Chat's own minimum (minWindowWidth/minWindowHeight in pa-chat/channel.js),
    // a number = percent of the screen, 'max' = 71.15 % x 71.11 % (1366x768 on 1920x1080).
    var TAMANOS = ['min', '30', '40', '50', '60', 'max'];
    var LIM = { anchoMin: 420, altoMin: 240, anchoMaxPct: 71.15, altoMaxPct: 71.11 };

    function valor(k) {
        var v;
        try { v = api.settings.value(G, k); } catch (e) { v = undefined; }
        return (v === undefined || v === null || v === '') ? DEF[k] : String(v);
    }

    function opcion(k, pantalla, minPx, maxPct) {
        var v = valor(k), maxPx = Math.floor(pantalla * maxPct / 100);
        if (v === 'keep') return null;
        if (v === 'min') return minPx;
        if (v === 'max') return Math.max(minPx, maxPx);
        var pct = parseFloat(v);
        if (isNaN(pct)) return null;
        return Math.max(minPx, Math.min(maxPx, Math.round(pantalla * pct / 100)));
    }

    // Pixel size for the open window on the current screen, or null = leave PA Chat's size alone.
    function tamano() {
        var w = $(window).width(), h = $(window).height();
        return {
            ancho: opcion('ancho', w, LIM.anchoMin, LIM.anchoMaxPct),
            alto: opcion('alto', h, LIM.altoMin, LIM.altoMaxPct)
        };
    }

    function medida(k, min, max) {
        var n = parseInt(valor(k), 10);
        return isNaN(n) ? null : Math.max(min, Math.min(max, n));
    }

    // Key = English text (loc). Values in the same order as KEYS.
    var KEYS = ['CHAT', 'PA CHAT WINDOW', 'On startup', 'Minimized', 'Open', 'Remember last state',
        'Open window width', 'Open window height', 'Do not change', 'Window opacity',
        'Hide the chat completely',
        'Changes apply after SAVE. Requires the PA Chat mod.',
        'Translations are automatic and may contain errors.',
        'Minimum', 'Maximum', 'Sizes are a percentage of the screen.'];
    var TRAD = {
        es: ['CHAT', 'VENTANA DE PA CHAT', 'Al iniciar', 'Minimizado', 'Abierto', 'Recordar el último estado', 'Ancho de la ventana abierta', 'Alto de la ventana abierta', 'No cambiar', 'Opacidad de la ventana', 'Ocultar el chat por completo', 'Los cambios se aplican al GUARDAR. Requiere el mod PA Chat.', 'Las traducciones son automáticas y pueden contener errores.', 'Mínimo', 'Máximo', 'Los tamaños son un porcentaje de la pantalla.'],
        fr: ['CHAT', 'FENÊTRE PA CHAT', 'Au démarrage', 'Réduit', 'Ouvert', 'Mémoriser le dernier état', 'Largeur de la fenêtre ouverte', 'Hauteur de la fenêtre ouverte', 'Ne pas changer', 'Opacité de la fenêtre', 'Masquer complètement le chat', 'Les changements s\'appliquent après ENREGISTRER. Nécessite le mod PA Chat.', 'Les traductions sont automatiques et peuvent contenir des erreurs.', 'Minimum', 'Maximum', 'Les tailles sont un pourcentage de l’écran.'],
        de: ['CHAT', 'PA-CHAT-FENSTER', 'Beim Start', 'Minimiert', 'Geöffnet', 'Letzten Zustand merken', 'Breite des offenen Fensters', 'Höhe des offenen Fensters', 'Nicht ändern', 'Fensterdeckkraft', 'Chat vollständig ausblenden', 'Änderungen gelten nach SPEICHERN. Benötigt die Mod PA Chat.', 'Übersetzungen sind automatisch und können Fehler enthalten.', 'Minimum', 'Maximum', 'Größen sind ein Prozentsatz des Bildschirms.'],
        it: ['CHAT', 'FINESTRA PA CHAT', 'All\'avvio', 'Ridotta', 'Aperta', 'Ricorda l\'ultimo stato', 'Larghezza della finestra aperta', 'Altezza della finestra aperta', 'Non cambiare', 'Opacità della finestra', 'Nascondi completamente la chat', 'Le modifiche si applicano dopo SALVA. Richiede la mod PA Chat.', 'Le traduzioni sono automatiche e possono contenere errori.', 'Minimo', 'Massimo', 'Le dimensioni sono una percentuale dello schermo.'],
        pt: ['CHAT', 'JANELA DO PA CHAT', 'Ao iniciar', 'Minimizado', 'Aberto', 'Lembrar o último estado', 'Largura da janela aberta', 'Altura da janela aberta', 'Não alterar', 'Opacidade da janela', 'Ocultar o chat completamente', 'As alterações valem após SALVAR. Requer o mod PA Chat.', 'As traduções são automáticas e podem conter erros.', 'Mínimo', 'Máximo', 'Os tamanhos são uma porcentagem da tela.'],
        ru: ['ЧАТ', 'ОКНО PA CHAT', 'При запуске', 'Свёрнуто', 'Открыто', 'Запоминать последнее состояние', 'Ширина открытого окна', 'Высота открытого окна', 'Не менять', 'Прозрачность окна', 'Полностью скрыть чат', 'Изменения применяются после СОХРАНИТЬ. Нужен мод PA Chat.', 'Переводы автоматические и могут содержать ошибки.', 'Минимум', 'Максимум', 'Размеры указаны в процентах от экрана.'],
        uk: ['ЧАТ', 'ВІКНО PA CHAT', 'Під час запуску', 'Згорнуто', 'Відкрито', 'Запам\'ятовувати останній стан', 'Ширина відкритого вікна', 'Висота відкритого вікна', 'Не змінювати', 'Прозорість вікна', 'Повністю приховати чат', 'Зміни застосовуються після ЗБЕРЕГТИ. Потрібен мод PA Chat.', 'Переклади автоматичні й можуть містити помилки.', 'Мінімум', 'Максимум', 'Розміри вказано у відсотках від екрана.'],
        pl: ['CZAT', 'OKNO PA CHAT', 'Przy starcie', 'Zminimalizowany', 'Otwarty', 'Pamiętaj ostatni stan', 'Szerokość otwartego okna', 'Wysokość otwartego okna', 'Nie zmieniaj', 'Krycie okna', 'Całkowicie ukryj czat', 'Zmiany działają po ZAPISZ. Wymaga moda PA Chat.', 'Tłumaczenia są automatyczne i mogą zawierać błędy.', 'Minimum', 'Maksimum', 'Rozmiary to procent ekranu.'],
        cs: ['CHAT', 'OKNO PA CHAT', 'Při spuštění', 'Minimalizováno', 'Otevřeno', 'Pamatovat poslední stav', 'Šířka otevřeného okna', 'Výška otevřeného okna', 'Neměnit', 'Krytí okna', 'Úplně skrýt chat', 'Změny platí po ULOŽIT. Vyžaduje mod PA Chat.', 'Překlady jsou automatické a mohou obsahovat chyby.', 'Minimum', 'Maximum', 'Velikosti jsou v procentech obrazovky.'],
        da: ['CHAT', 'PA CHAT-VINDUE', 'Ved start', 'Minimeret', 'Åben', 'Husk sidste tilstand', 'Bredde på åbent vindue', 'Højde på åbent vindue', 'Ændr ikke', 'Vinduets opacitet', 'Skjul chatten helt', 'Ændringer gælder efter GEM. Kræver mod\'en PA Chat.', 'Oversættelserne er automatiske og kan indeholde fejl.', 'Minimum', 'Maksimum', 'Størrelser er en procentdel af skærmen.'],
        fi: ['CHAT', 'PA CHAT -IKKUNA', 'Käynnistettäessä', 'Pienennetty', 'Auki', 'Muista viimeisin tila', 'Avoimen ikkunan leveys', 'Avoimen ikkunan korkeus', 'Älä muuta', 'Ikkunan peittävyys', 'Piilota chat kokonaan', 'Muutokset tulevat voimaan TALLENNA-painalluksen jälkeen. Vaatii PA Chat -modin.', 'Käännökset ovat automaattisia ja voivat sisältää virheitä.', 'Pienin', 'Suurin', 'Koot ovat prosentteja näytöstä.'],
        hu: ['CSEVEGŐ', 'PA CHAT ABLAK', 'Indításkor', 'Kicsinyítve', 'Nyitva', 'Utolsó állapot megjegyzése', 'Nyitott ablak szélessége', 'Nyitott ablak magassága', 'Ne változzon', 'Ablak átlátszatlansága', 'A csevegő teljes elrejtése', 'A változások MENTÉS után lépnek életbe. A PA Chat mod szükséges.', 'A fordítások automatikusak, hibákat tartalmazhatnak.', 'Minimum', 'Maximum', 'A méretek a képernyő százalékában értendők.'],
        nl: ['CHAT', 'PA CHAT-VENSTER', 'Bij opstarten', 'Geminimaliseerd', 'Open', 'Laatste staat onthouden', 'Breedte van open venster', 'Hoogte van open venster', 'Niet wijzigen', 'Dekking van venster', 'Chat volledig verbergen', 'Wijzigingen gelden na OPSLAAN. Vereist de mod PA Chat.', 'Vertalingen zijn automatisch en kunnen fouten bevatten.', 'Minimum', 'Maximum', 'Formaten zijn een percentage van het scherm.'],
        no: ['CHAT', 'PA CHAT-VINDU', 'Ved oppstart', 'Minimert', 'Åpen', 'Husk siste tilstand', 'Bredde på åpent vindu', 'Høyde på åpent vindu', 'Ikke endre', 'Vinduets opasitet', 'Skjul chatten helt', 'Endringer gjelder etter LAGRE. Krever moden PA Chat.', 'Oversettelsene er automatiske og kan inneholde feil.', 'Minimum', 'Maksimum', 'Størrelser er en prosentandel av skjermen.'],
        ro: ['CHAT', 'FEREASTRA PA CHAT', 'La pornire', 'Minimizat', 'Deschis', 'Ține minte ultima stare', 'Lățimea ferestrei deschise', 'Înălțimea ferestrei deschise', 'Nu schimba', 'Opacitatea ferestrei', 'Ascunde complet chatul', 'Modificările se aplică după SALVARE. Necesită modul PA Chat.', 'Traducerile sunt automate și pot conține erori.', 'Minim', 'Maxim', 'Dimensiunile sunt un procent din ecran.'],
        sv: ['CHATT', 'PA CHAT-FÖNSTER', 'Vid start', 'Minimerad', 'Öppen', 'Kom ihåg senaste läget', 'Bredd på öppet fönster', 'Höjd på öppet fönster', 'Ändra inte', 'Fönstrets opacitet', 'Dölj chatten helt', 'Ändringar gäller efter SPARA. Kräver moddet PA Chat.', 'Översättningarna är automatiska och kan innehålla fel.', 'Minimum', 'Maximum', 'Storlekar är en procentandel av skärmen.'],
        tr: ['SOHBET', 'PA CHAT PENCERESİ', 'Başlangıçta', 'Küçültülmüş', 'Açık', 'Son durumu hatırla', 'Açık pencere genişliği', 'Açık pencere yüksekliği', 'Değiştirme', 'Pencere opaklığı', 'Sohbeti tamamen gizle', 'Değişiklikler KAYDET sonrası uygulanır. PA Chat modu gerekir.', 'Çeviriler otomatiktir ve hata içerebilir.', 'En küçük', 'En büyük', 'Boyutlar ekranın yüzdesidir.'],
        ja: ['チャット', 'PA CHAT ウィンドウ', '起動時', '最小化', '開く', '前回の状態を記憶', '開いたウィンドウの幅', '開いたウィンドウの高さ', '変更しない', 'ウィンドウの不透明度', 'チャットを完全に隠す', '変更は保存後に反映されます。PA Chat MOD が必要です。', '翻訳は自動のため誤りを含む場合があります。', '最小', '最大', 'サイズは画面に対する割合です。'],
        ko: ['채팅', 'PA CHAT 창', '시작 시', '최소화', '열림', '마지막 상태 기억', '열린 창 너비', '열린 창 높이', '변경 안 함', '창 불투명도', '채팅 완전히 숨기기', '변경 사항은 저장 후 적용됩니다. PA Chat 모드가 필요합니다.', '번역은 자동이며 오류가 있을 수 있습니다.', '최소', '최대', '크기는 화면 대비 비율입니다.'],
        ar: ['الدردشة', 'نافذة PA Chat', 'عند البدء', 'مصغّرة', 'مفتوحة', 'تذكّر الحالة الأخيرة', 'عرض النافذة المفتوحة', 'ارتفاع النافذة المفتوحة', 'بدون تغيير', 'شفافية النافذة', 'إخفاء الدردشة تمامًا', 'تُطبَّق التغييرات بعد الحفظ. يتطلب تعديل PA Chat.', 'الترجمات آلية وقد تحتوي على أخطاء.', 'الحد الأدنى', 'الحد الأقصى', 'الأحجام نسبة مئوية من الشاشة.'],
        'zh-CN': ['聊天', 'PA CHAT 窗口', '启动时', '最小化', '打开', '记住上次状态', '打开时窗口宽度', '打开时窗口高度', '不更改', '窗口不透明度', '完全隐藏聊天', '更改在保存后生效。需要 PA Chat 模组。', '翻译为自动生成，可能有误。', '最小', '最大', '尺寸为屏幕的百分比。'],
        'zh-TW': ['聊天', 'PA CHAT 視窗', '啟動時', '最小化', '開啟', '記住上次狀態', '開啟時視窗寬度', '開啟時視窗高度', '不變更', '視窗不透明度', '完全隱藏聊天', '變更在儲存後生效。需要 PA Chat 模組。', '翻譯為自動產生，可能有誤。', '最小', '最大', '尺寸為螢幕的百分比。']
    };
    var listo = false;

    function registrarIdiomas() {
        try {
            if (listo || !window.i18n || !i18n.addResourceBundle || !i18n.lng) return;
            var lng = String(i18n.lng());
            var alias = { 'zh-HK': 'zh-TW' };
            var arr = TRAD[lng] || TRAD[alias[lng]] || TRAD[lng.split('-')[0]];
            if (arr && arr.length === KEYS.length) {
                var t = {};
                for (var i = 0; i < KEYS.length; i++) t[KEYS[i]] = arr[i];
                i18n.addResourceBundle(lng, 'translation', t);
            }
            listo = true;
        } catch (e) {}
    }

    return { G: G, DEF: DEF, TAMANOS: TAMANOS, LIM: LIM, valor: valor, medida: medida, tamano: tamano, registrarIdiomas: registrarIdiomas };
})();
