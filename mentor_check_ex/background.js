"use strict";

let thisNotificationId;
let version;

// 「更新あり」などの通知を表示する
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


// 機能拡張のアイコンをクリックした
chrome.action.onClicked.addListener(tab => {
  // chrome.tabs.create({ active: true, url: "https://techacademy.jp/mentor" });
});

// アイコンを有効・無効で変化させる
const iconChange = isEnabled => {
  chrome.action.setIcon({
    path: isEnabled ? 'img/icon-16.png' : 'img/icon-16-disabled.png'
  });
};

// スリープ関数
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//タブが切り替わった時
chrome.tabs.onActivated.addListener(async obj => {
  // chrome.tabs.get が一度では失敗するので、取得されるまでループする
  let tab = false;
  while (!tab) {
    try {
      tab = await chrome.tabs.get(obj.tabId);
    }
    catch (e) {
      await _sleep(100);
      tab = false;
    }
  }
  iconChange(!!(tab && tab.url && tab.url.match(/^https:\/\/techacademy\.jp\/mentor/)));
});

// ウィンドウが切り替わった時
chrome.windows.onFocusChanged.addListener(async winId => {
  // chrome.tabs.query が一度では失敗するので、取得されるまでループする
  let tab = false;
  while (!tab) {
    try {
      [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    }
    catch (e) {
      await _sleep(100);
      tab = false;
    }
  }
  iconChange(!!(tab && tab.url && tab.url.match(/^https:\/\/techacademy\.jp\/mentor/)));
});

// タブが読み込みされたとき
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status && info.status === 'loading') {
    iconChange(!!(tab.url && tab.url.match(/^https:\/\/techacademy\.jp\/mentor/)));
  }
});

// バージョン文字列を数字に変換
const version2num = ver => {
  return ver.replaceAll('.', '') - 0;
};

(async () => {

  // 同期的にプラグインの設定を取得する
  const config = await (async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('new_version', resolve);
    });
  })();

  const resp = await fetch('https://raw.githubusercontent.com/ShigeUe/MentorCheckEx/main/mentor_check_ex/manifest.json');
  const data = await resp.json();
  const local = chrome.runtime.getManifest();
  const isUp = (version2num(local.version) < version2num(data.version));
  version = version2num(local.version);

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

  chrome.storage.local.set({ new_version: isUp });
})();

