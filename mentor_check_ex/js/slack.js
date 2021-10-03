"use strict";
/**
 * Injection script
 */

(() => {
  if (document.title.split(' | ').pop().toLowerCase() == 'techacademy mentor') {
    return;
  }

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
          window.postMessage({ SlackMessageData: m.data }, "*");
        }
        // もともとのイベントハンドラを実行
        return func(m);
      };

      return window.onmessagesetter.apply(this, arguments);
    }
  });
})();
