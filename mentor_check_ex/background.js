"use strict";

let thisNotificationId;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'notification') {
    chrome.notifications.create({
      title: message.title,
      message: message.body,
      type: "basic",
      iconUrl: "img/icon-128.png",
      silent: true
    });
  }
});

(async () => {

  // 非同期でプラグインの設定を取得する
  const config = await (async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('new_version', resolve);
    });
  })();
    
  const resp = await fetch('https://raw.githubusercontent.com/ShigeUe/MentorCheckEx/main/mentor_check_ex/manifest.json');
  const data = await resp.json();
  const local = chrome.runtime.getManifest();
  const isUp = (local.version < data.version);

  if (isUp && !config.new_version) {
    chrome.notifications.create(
      {
        title: 'バージョンアップ',
        message: 'MentorCheckExの新しいバージョンがあります。',
        type: "basic",
        iconUrl: "img/icon-128.png",
        silent: true,
        buttons: [{ title: 'GitHubを開く' }, { title: '閉じる' }]
      },
      (notificationId) => {
        thisNotificationId = notificationId;
      }
    );

    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (notificationId === thisNotificationId) {
        if (buttonIndex === 0) {
          chrome.tabs.create({ active: true, url: "https://github.com/ShigeUe/MentorCheckEx" });
        }
      }
    });
  }

  chrome.storage.sync.set({ new_version: isUp });
})();

