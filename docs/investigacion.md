# Investigación: chat del menú principal (build 124683)

- El chat grande abajo NO es vanilla: es el mod **PA Chat** (`identifier: pachat`, v2.1.4, priority 100), que la escena `community_mods` instala sola a todos (`media/ui/main/game/community_mods/states/main.js:282-286`).
- Se dibuja en la escena **`uberbar`** (`ui/mods/pa-chat/chatbox.js` mete `chatbox.html` en `.chat-wrapper`).
- Estado: cada canal sale de `CreateChannel()` (`pa-chat/channel.js`) con `self.minimized = ko.observable(false)`; el clic en la cabecera llama `toggleMinimized()`. Lista: `model.chatbox.Channels` (observableArray). No se guarda en localStorage.
- Los chats privados vanilla de la uberbar (`ConversationViewModel.minimized`) son otra cosa y no se tocan.

## Vía elegida (única razonable)
Client mod, escena `uberbar`, `priority: 101` (carga después de pachat; menor carga antes, Quitch modinfo-reference). El JS pone `minimized(true)` en los canales existentes y en cada canal que se agregue (`arrayChange`). El toggle manual queda intacto. Sin pachat: reintenta ~10 s y no hace nada.
Decisión: también arrancan minimizados los canales que se unan después (grupos); coherente con "el chat arranca cerrado".
