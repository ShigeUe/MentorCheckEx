(async () => {
  let port: chrome.runtime.Port;
  // 同期的にプラグインの設定を取得する
  const config: {[key: string]: any} = await chrome.storage.local.get({ new_version: false, watchSlack: false, chime: false });

  // review.jsから接続を待ち受け
  if (config.watchSlack) {
    chrome.runtime.onConnect.addListener((p: chrome.runtime.Port) => {
      if (p.name === 'SlackToBg') {
        port = p;
      }
    });
  }

  // 「更新あり」などの通知を表示する
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse();

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
      console.debug((new Date).toLocaleString() + ' Receive the message from Slack.');
      console.debug(message);

      const data: any = message.data;
      let [desc, url]: string = data.text.split('\n\n');
      url = url.replace('URL: <', '').replace('>\n', '');
      const title: string = message.title;

      // Slackで受けた課題レビューを通知一覧ページに送信する
      if (port) {
        port.postMessage({ type: 'addReview', desc, url, title });
      }
      if (desc.match(/課題.*レビュー中/)) {
        return;
      }
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


  // バージョン情報
  let version: number;

  // バージョン文字列を数字に変換
  const version2num = (ver: string): number => {
    const vers: string[] = ver.split('.');
    return Number(vers[0]) * 65536 + Number(vers[1]) * 256 + Number(vers[2]);
  };

  // GitHub上のマニフェストファイルを取得し、その中のバージョン情報を得る
  const resp: Response = await fetch('https://raw.githubusercontent.com/ShigeUe/MentorCheckEx/main/mentor_check_ex/manifest.json');
  const data = await resp.json();
  const local: chrome.runtime.Manifest = chrome.runtime.getManifest();

  version = version2num(local.version);
  const isUp: boolean = (version < version2num(data.version));

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
