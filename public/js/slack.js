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
          // console.debug(data);
          if (data.type == 'user_typing') {
            // console.debug(data.channel);
            setTimeout(() => {
              const e = document.querySelector('.p-channel_sidebar__channel[data-qa-channel-sidebar-channel-id="' + data.channel + '"]');
              const sw = document.querySelector('.p-ia4_top_nav__native_ui_spacer');
              sw.style.transition = 'background-color 0.3s';

              if (e) {
                e.style.backgroundColor = 'rgba(0,255,0,0.2)';
                sw.style.backgroundColor = 'rgba(0,255,0,0.2)';
                setTimeout(() => {
                  e.style.backgroundColor = '';
                  sw.style.backgroundColor = '';
                }, 500);
              }
            }, 0);
          }
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
