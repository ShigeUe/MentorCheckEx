"use strict";

/*
--------------------------------------------------------------------------
 テスト用関数・変数
--------------------------------------------------------------------------
*/
const debug = {
  stage: document.getElementById('resultArea'),
  log: message => {
    debug.stage.innerHTML += '<div>' + (message || '&nbsp;') + '</div>\n';
  },
  text: text => {
    const p = document.createElement('pre');
    const t = document.createTextNode(text);
    p.appendChild(t);
    debug.stage.appendChild(p);
  },
  err: message => {
    debug.stage.innerHTML += '<div class="error">' + message + '</div>\n';
  },
  info: (message, marginTop = false) => {
    debug.stage.innerHTML += '<div class="info' + (marginTop ? ' mt1' : '') + '">' +
      message + '</div>\n';
  }
};
const _chrome = {
  runtime: {
    sendMessage: message => debug.log('chrome.runtime.sendMessage(' + JSON.stringify(message) + ')'),
    getURL: path => '../mentor_check_ex/' + path,
  },
  storage: {
    local: {
      get: (data, func) => {
        debug.log('chrome.storage.local.get(' + JSON.stringify(data) + ')');
        data.chime = true;
        data.notify = true;
        data.smartIfSimple = true;
        data.new_version = false;
        func(data);
      },
      set: (data, func) => {
        debug.log('chrome.storage.local.set(' + JSON.stringify(data) + ')');
        func();
      }
    }
  }
};
const _window = {
  postMessage: (data, origin) =>
    debug.log('window.postMessage(' + JSON.stringify(data) + ',' + JSON.stringify(origin) + ')'),
  open: (url, name) => {
    debug.log('window.open(' + JSON.stringify(url) + ',' + JSON.stringify(name) + ')');
    return _window;
  },
};
let result;
let element;
