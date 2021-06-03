"use strict";

const queryId = id=> document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({
    interval: 15,
    chime: false,
    smartIfSimple: false,
  }, items => {
    queryId('interval').value = items.interval;
    queryId('chime').checked = !!(items.chime);
    queryId('smartIfSimple').checked = !!(items.smartIfSimple);
  });

  queryId('save').addEventListener('click', () => {
    const interval = queryId('interval').value - 0;
    const chime = queryId('chime').checked;
    const smartIfSimple = queryId('smartIfSimple').checked;

    if (isNaN(interval) || interval < 15 || interval > 300) {
      alert('リロード間隔が範囲外です');
      return;
    }

    chrome.storage.sync.set({
      interval: interval,
      chime: chime,
      smartIfSimple: smartIfSimple,
    }, () => {
      queryId('message').innerText = '保存しました';
    });
  });

  queryId('close').addEventListener('click', () => {
    window.close();
  });

  // バージョンチェック
  fetch('https://raw.githubusercontent.com/ShigeUe/MentorCheckEx/main/mentor_check_ex/manifest.json')
    .then(response => response.json())
    .then((github) => {
      fetch('../manifest.json')
        .then(response => response.json())
        .then((local) => {
          console.log('Local version:' + local.version);
          console.log('Repos version:' + github.version);
          if (local.version !== github.version) {
            const message = queryId('version-up-message');
            message.innerHTML = '<b style="font-weight:bold;color:red;">新しいバージョンがあります</b>';
          }
        });
    });

});
