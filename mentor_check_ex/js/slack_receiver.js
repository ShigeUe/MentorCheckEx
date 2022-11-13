"use strict";

(async () => {
  // Techacademy Mentorは除外する
  if (window.location.href.match(/https:\/\/app.slack.com\/client\/T06LC7QNM\//)) {
    return;
  }
  // 同期的にプラグインの設定を取得する
  const config = await (() => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ chime: false, volume: 50, watchSlack: false }, resolve);
    });
  })();

  if (config.watchSlack) {
    console.debug(Date.now() + ' Injecting the script into Slack.');
    const source = chrome.runtime.getURL('js/slack.js');
    const script = document.createElement('script');
    script.src = source;
    document.head.appendChild(script);
  
    console.debug(Date.now() + ' Add the event listener for MentorCheckEx.');
    window.addEventListener("message", (e) => {
      if (e.origin === 'https://app.slack.com') {
        if (e.data.SlackMessageData) {
          const data = JSON.parse(e.data.SlackMessageData);
          // ボットのメッセージに限定
          // if (data.type && data.type === 'message' && data.subtype && data.subtype === 'bot_message') {
          //   if (data.text.match(/課題.*([^再]提出|レビュー中)/)) {

          console.debug(Date.now() + ' Send the message to MentorCheckEx.');
          console.debug(data);

          // タイトルからワークスペース名を取得
          const title = document.querySelector('.p-ia__sidebar_header__team_name_text').innerText;
          chrome.runtime.sendMessage('', { type: "slack", title, data }).then(()=>{},()=>{});
          //   }
          // }
        }
      }
    }, false);
  }
})();
