"use strict";
/**
 * Injection script
 */

(() => {
  console.debug(Date.now() + ' Override WebSocket.onmessage.');
  window.onmessagegetter = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'onmessage').get;
  window.onmessagesetter = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'onmessage').set;

  Object.defineProperty(window.WebSocket.prototype, 'onmessage', {
    get() {
      return window.onmessagegetter.apply(this);
    },
    set() {
      // onmessageに追加しようとしているイベントハンドラをOverrideする
      const func = arguments[0];
      arguments[0] = (m) => {
        if (m.data) {
          const data = JSON.parse(m.data);
// -----------------------------------------------------------
//          console.debug(data);
// -----------------------------------------------------------
          if (data.type && data.type === 'message' && data.subtype && data.subtype === 'bot_message') {
            if (data.text.match(/課題.*([^再]提出|レビュー中)/)) {
              window.postMessage({ SlackMessageData: m.data }, "*");
            }
          }
        }
        // もともとのイベントハンドラを実行
        return func(m);
      };

      return window.onmessagesetter.apply(this, arguments);
    }
  });
})();
