"use strict";

(async () => {
  // 同期的にプラグインの設定を取得する
  const config = await (() => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ new_version: false, watchSlack: false, chime: false }, resolve);
    });
  })();


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

    // Slackからのメッセージを受け取る
    if (config.watchSlack && message.type === 'slack') {
      console.debug(Date.now() + ' Receive the message from Slack.');
      console.debug(message);

      const data = message.data;
      let [desc, url] = data.text.split('\n\n');
      url = url.replace('URL: <', '').replace('>\n', '');

      // 通知の作成
      chrome.notifications.create(
        {
          title: '課題の到着：' + message.title,
          message: desc,
          type: "basic",
          silent: !config.chime,
          iconUrl: "img/light_bulb.png",
          buttons: [{ title: '課題レビュー開始' }, { title: '閉じる' }]
        },
        // 通知が作成されたら、通知IDを変数に格納
        (nId) => {
          chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            if (notificationId === nId) {
              if (buttonIndex === 0) { // 左側のボタンがクリックされた
                chrome.tabs.create({ active: true, url: url + '?open=1' });
              }
            }
          });
        }
      );
    }
  });


  // アイコンを有効・無効で変化させる
  const iconChange = isEnabled => {
    if (isEnabled) {
      chrome.action.enable();
    }
    else {
      chrome.action.disable();
    }
  };

  // バージョン情報
  let version;
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
        // 失敗したら100ms休んでからループ再開
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
        // 失敗したら100ms休んでからループ再開
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
    const vers = ver.split('.');
    return vers[0] * 65536 + vers[1] * 256 + (vers[2] - 0);
  };

  // GitHub上のマニフェストファイルを取得し、その中のバージョン情報を得る
  const resp = await fetch('https://raw.githubusercontent.com/ShigeUe/MentorCheckEx/main/mentor_check_ex/manifest.json');
  const data = await resp.json();
  const local = chrome.runtime.getManifest();

  version = version2num(local.version);
  const isUp = (version < version2num(data.version));

  // 更新あり && 設定の new_version が false 、つまり更新が通知されていなかったら
  if (isUp && !config.new_version) {
    // 通知の作成
    chrome.notifications.create(
      {
        title: 'バージョンアップ',
        message: 'MentorCheckExの新しいバージョンがあります。',
        type: "basic",
        iconUrl: "img/icon-128.png",
        silent: true,
        buttons: [{ title: 'GitHubを開く' }, { title: '閉じる' }]
      },
      // 通知が作成されたら、通知IDを変数に格納
      (nId) => {
        // 更新通知のボタンが押されたときの処理
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
          if (notificationId === nId) {
            if (buttonIndex === 0) { // 左側のボタンがクリックされた
              chrome.tabs.create({ active: true, url: "https://github.com/ShigeUe/MentorCheckEx" });
            }
          }
        });
      }
    );
  }
  // 更新の通知済みを設定に保存
  chrome.storage.local.set({ new_version: isUp });
})();

