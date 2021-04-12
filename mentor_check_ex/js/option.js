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
});
