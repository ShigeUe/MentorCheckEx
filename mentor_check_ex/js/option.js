const queryId = function (id) {
  return document.getElementById(id);
}

const checkboxToLocalStorage = function (id) {
  if (queryId(id).checked) {
    localStorage.setItem(id, 1);
  }
  else {
    localStorage.removeItem(id);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const l = localStorage;
  queryId('interval').value = l.getItem('interval') ? l.getItem('interval') : '15';
  queryId('chime').checked = !!l.getItem('chime');
  queryId('smartIfSimple').checked = !!l.getItem('smartIfSimple');

  queryId('save').addEventListener('click', function () {
    checkboxToLocalStorage('chime');
    checkboxToLocalStorage('smartIfSimple');

    const v = queryId('interval').value;
    if (v >= 15 && v <= 300) {
      l.setItem('interval', v - 0);
      queryId('message').innerText = '保存しました';
    }
    else {
      alert('リロード間隔が範囲外です');
    }
  });
});
  