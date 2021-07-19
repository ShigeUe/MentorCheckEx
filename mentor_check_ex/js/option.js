"use strict";

const queryId = id=> document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({
    interval: 30,
    chime: false,
    notify: false,
    smartIfSimple: false,
    username: '',
    password: '',
  }, items => {
    queryId('interval').value = items.interval;
    queryId('chime').checked = !!(items.chime);
    queryId('notify').checked = !!(items.notify);
    queryId('smartIfSimple').checked = !!(items.smartIfSimple);
    queryId('username').value = items.username;
    queryId('password').value = items.password;
  });

  queryId('save').addEventListener('click', () => {
    const interval = queryId('interval').value - 0;
    const chime = queryId('chime').checked;
    const notify = queryId('notify').checked;
    const smartIfSimple = queryId('smartIfSimple').checked;
    const username = queryId('username').value;
    const password = queryId('password').value;

    if (isNaN(interval) || interval < 30 || interval > 300) {
      alert('リロード間隔が範囲外です');
      return;
    }

    chrome.storage.local.set({
      interval: interval,
      chime: chime,
      notify: notify,
      smartIfSimple: smartIfSimple,
      username: username,
      password: password,
    }, () => {
      queryId('message').innerText = '保存しました';
    });
  });

  queryId('close').addEventListener('click', () => {
    window.close();
  });

  queryId('notify_test').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: 'notification', title: '通知テスト', body: '通知のテストです。' });
  });

  chrome.storage.local.get('new_version', local => {
    if (local.new_version) {
      const message = queryId('version-up-message');
      message.innerHTML = '<b style="font-weight:bold;color:red;">新しいバージョンがあります</b>';
    }
  });

  const manifest = chrome.runtime.getManifest();
  queryId('version').innerText = manifest.version;
});
