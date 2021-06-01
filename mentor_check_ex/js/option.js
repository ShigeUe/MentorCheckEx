"use strict";

const queryId = function (id) {
  return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get({
    interval: 15,
    chime: false,
    smartIfSimple: false,
  }, function (items) {
    queryId('interval').value = items.interval;
    queryId('chime').checked = !!(items.chime);
    queryId('smartIfSimple').checked = !!(items.smartIfSimple);
  });

  queryId('save').addEventListener('click', function () {
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
    }, function () {
      queryId('message').innerText = '保存しました';
    });
  });

  queryId('close').addEventListener('click', function () {
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
