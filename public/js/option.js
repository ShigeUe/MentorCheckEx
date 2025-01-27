"use strict";

const queryId = id => document.getElementById(id);
const query = q => document.querySelector(q);
const audio = new Audio(chrome.runtime.getURL("resources/chime.mp3"));
audio.addEventListener('ended', () => {
  queryId('volume').disabled = false;
});
let curriculums = [];

const makeListElement = (el) => {
  const label = document.createElement('label');
  const text  = document.createTextNode(el.name);
  const input = document.createElement('input');
  input.type = "checkbox";
  input.name = el.name;
  input.value = 1;
  input.checked = (!('visible' in el)) ? true : el.visible;
  label.appendChild(input);
  label.appendChild(text);
  return label;
};

const makeCurriculumsList = () => {
  const base = queryId('curriculums');
  curriculums.forEach(el => {
    base.appendChild(makeListElement(el));
  });
};

const getCurriculumsFromScreen = () => {
  curriculums.forEach(el => {
    const input = query(`#curriculums input[name="${el.name}"]`);
    el.visible = (!input) ? true : input.checked;
  });
};


document.addEventListener('DOMContentLoaded', async () => {

  // カリキュラムを取得
  const res2 = await fetch('https://techacademy.jp/mentor/curriculums',
    { method: 'GET', mode: 'same-origin', credentials: 'include' });

  if (!res2.ok) {
    throw new Error("HTTP error! status: " + res2.status);
  }

  const text2 = await res2.text();

  const doc2 = document.implementation.createHTMLDocument("").documentElement;
  doc2.innerHTML = text2;
  const curriculum_list = doc2.querySelectorAll('.breadcrumb + h2 + .nav li a');
  curriculum_list.forEach((curriculum) => {
    curriculums.push({ name: curriculum.textContent, url: curriculum.attributes.href.value, visible: false });
  });


  


  chrome.storage.local.get({
    interval: 30,
    chime: false,
    notify: false,
    smartIfSimple: false,
    curriculumSubMenu: false,
    curriculums: [],
    username: '',
    password: '',
    volume: 50,
    watchSlack: false,
    darkmode: false,
    diff: true,
    diffFromGit: false,
    warningChannel: [],
  }, items => {
    queryId('interval').value = items.interval;
    queryId('chime').checked = !!(items.chime);
    queryId('notify').checked = !!(items.notify);
    queryId('smartIfSimple').checked = !!(items.smartIfSimple);
    queryId('curriculumSubMenu').checked = !!(items.curriculumSubMenu);
    queryId('username').value = items.username;
    queryId('password').value = items.password;
    queryId('volume').value = items.volume;
    queryId('volume-text').innerText = items.volume;
    queryId('watchSlack').checked = !!(items.watchSlack);
    queryId('darkmode').checked = !!(items.darkmode);
    queryId('diff').checked = !!(items.diff);
    queryId('diffFromGit').checked = !!(items.diffFromGit);
    queryId('warningChannel').value = items.warningChannel;
    audio.volume = items.volume * 0.01;
    curriculums = curriculums.map((el) => {
      const target = items.curriculums.filter((e) => e.name == el.name);
      if (target.length) {
        el.visible = target[0].visible;
      }
      return el;
    });
    makeCurriculumsList();
  });

  queryId('save').addEventListener('click', () => {
    const interval = queryId('interval').value - 0;
    const chime = queryId('chime').checked;
    const notify = queryId('notify').checked;
    const smartIfSimple = queryId('smartIfSimple').checked;
    const curriculumSubMenu = queryId('curriculumSubMenu').checked;
    const username = queryId('username').value;
    const password = queryId('password').value;
    const volume = queryId('volume').value;
    const watchSlack = queryId('watchSlack').checked;
    const darkmode = queryId('darkmode').checked;
    const diff = queryId('diff').checked;
    const diffFromGit = queryId('diffFromGit').checked;
    const warningChannel = queryId('warningChannel').value.trim();

    getCurriculumsFromScreen();
    
    if (isNaN(interval) || interval < 30 || interval > 300) {
      alert('リロード間隔が範囲外です');
      return;
    }

    chrome.storage.local.set({
      interval,
      chime,
      notify,
      smartIfSimple,
      curriculumSubMenu,
      curriculums,
      username,
      password,
      volume,
      watchSlack,
      darkmode,
      diff,
      diffFromGit,
      warningChannel,
    }, () => {
      queryId('message').innerText = '保存しました';
    });
  });

  queryId('close').addEventListener('click', () => {
    window.close();
  });

  queryId('all-reset').addEventListener('click', () => {
    if (window.confirm('設定をすべて消去します。')) {
      chrome.storage.local.clear();
      window.close();
    }
  });

  queryId('notify_test').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage('', { type: 'notification', title: '通知テスト', body: '通知のテストです。' });
  });

  chrome.storage.local.get('new_version', local => {
    if (local.new_version) {
      const message = queryId('version-up-message');
      message.innerHTML = '<b style="font-weight:bold;color:red;">新しいバージョンがあります</b>';
    }
  });

  const manifest = chrome.runtime.getManifest();
  queryId('version').innerText = manifest.version;

  queryId('volume').addEventListener('change', (e) => {
    const volume = e.target.value;
    queryId('volume-text').innerText = volume;
    e.target.disabled = true;
    audio.volume = volume * 0.01;
    audio.play();
  });
});
