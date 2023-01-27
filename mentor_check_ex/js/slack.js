"use strict";
/**
 * Injection script
 */

(() => {
  console.debug(Date.now() + ' Override WebSocket.onmessage.');
  window.onmessagegetter = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'onmessage').get;
  window.onmessagesetter = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'onmessage').set;

  /*
  const hajifuku_id = 'T02CXU5S59P';
  let hajifuku = false;
  let u_id = null;

  // はじ副かどうか
  // Techacademy Mentorは除外する
  if (window.location.href.match(/https:\/\/app.slack.com\/client\/T02CXU5S59P\//)) {
    hajifuku = true;
  }

  if (hajifuku) {
    // slackのindexeddbからデータを取得する
    window.indexedDB.open("reduxPersistence").onsuccess = (event) => {
      let db = event.target.result;
      let tr = db.transaction('reduxPersistenceStore', 'readonly');
      let st = tr.objectStore('reduxPersistenceStore');
      console.debug(st);
  
      st.getAllKeys().onsuccess = (e) => {
        if (e.target.result.length) {
          console.debug(e.target.result);

          let key = null;
          e.target.result.forEach((k) => {
            if (k.indexOf(hajifuku_id) < 0) {
              return;
            }
            key = k;
          });
          if (!key) {
            return;
          }
          console.debug(key);
          st.get(key).onsuccess = (e) => {
            console.debug(e.target.result.bootData);
            u_id = e.target.result.bootData.user_id;
          };
        }
      }
      db.close();
    };
  }
  */

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
              if (e) {
                e.style.backgroundColor = 'rgba(0,255,0,0.2)';
                setTimeout(() => {
                  e.style.backgroundColor = '';
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
