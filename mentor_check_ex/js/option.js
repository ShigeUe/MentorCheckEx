"use strict";

const queryId = id => document.getElementById(id);
const query = q => document.querySelector(q);
const audio = new Audio(chrome.runtime.getURL("resources/chime.mp3"));
audio.addEventListener('ended', () => {
  queryId('volume').disabled = false;
});
let curriculums = [];
let course_list = [];

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
    const input = query(`input[name="${el.name}"]`);
    el.visible = (!input) ? true : input.checked;
  });
};

const makeCourseList = () => {
  const base = queryId('courseList');
  course_list.forEach(el => {
    base.appendChild(makeListElement(el));
  });
};

const getCourseListFromScreen = () => {
  course_list.forEach(el => {
    const input = query(`input[name="${el.name}"]`);
    el.visible = (!input) ? true : input.checked;
  });
};


document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({
    interval: 30,
    chime: false,
    notify: false,
    smartIfSimple: false,
    curriculumSubMenu: false,
    curriculums: [],
    course_list: [],
    username: '',
    password: '',
    volume: 50,
    watchSlack: false,
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
    audio.volume = items.volume * 0.01;
    curriculums = items.curriculums;
    course_list = items.course_list;
    makeCurriculumsList();
    makeCourseList();
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
    getCurriculumsFromScreen();
    getCourseListFromScreen();
    
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
      course_list,
      username,
      password,
      volume,
      watchSlack
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
