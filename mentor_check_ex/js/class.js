'use strict';

class MentorCheckEx
{
  doc        = document;
  cloud9_url = '#';
  win_aws    = '';

  constructor() {
    // 空のメッセージを送ることで、Service Workerを起こしてバージョンアップの確認をさせる
    chrome.runtime.sendMessage({});
  }

  set_document(doc) {
    this.doc = doc;
    return this;
  }
  query(s) {
    return this.doc.querySelector(s);
  }

  queryAll(s) {
    return this.doc.querySelectorAll(s);
  }

  queryId(i) {
    return this.doc.getElementById(i);
  }

  create(e) {
    return document.createElement(e);
  }

  querySelectorAndContent(s, c) {
    const elements = document.querySelectorAll(s);
    let ret = null;
    elements.forEach(e => {
      if (e.innerText.toLowerCase().search(c.toLowerCase()) >= 0) {
        ret = e;
      }
    });
    return ret;
  }
  
  setting_cloud9() {
    const self = this;

    const aws = self.query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]');
    if (!aws) {
      return;
    }

    const aws_info = self.query('a[href*="signin.aws.amazon.com/console"] + div').innerText.split('\n');
    const aws_username = aws_info[1].split(' ')[1];
    const aws_password = aws_info[2].split(' ')[1];

    // AWSログインからのメッセージの受信
    window.addEventListener('message', event => {
      // 目的のページがロードされた
      if (
        event.origin === 'https://signin.aws.amazon.com' ||
        event.origin.indexOf('console.aws.amazon.com') > 0
      ) {
        // サインイン画面
        if (event.data === 'loaded' && event.origin === 'https://signin.aws.amazon.com') {
          self.win_aws.postMessage({
            username: aws_username,
            password: aws_password
          }, event.origin);
        }
        // サインインが完了しダッシュボードが開いた
        if (event.data === 'loaded' && event.origin.indexOf('console.aws.amazon.com') > 0) {
          window.open(self.cloud9_url, 'AWSOpenedFromMentorCheckEx');
        }
      }
    });

    // 「自動でCloud9を開く」ボタンの設置
    self.queryAll('a[href*="aws.amazon.com/cloud9"]').forEach(e => {
      const button = new MCEElement('button')
        .text('自動でCloud9を開く')
        .addClass('auto-open-the-cloud9')
        // ボタンの動作
        .addEventListener('click', (event) => {
          self.cloud9_url = e.href;
          event.preventDefault();
          self.win_aws = window.open(aws.href, 'AWSOpenedFromMentorCheckEx');
          return false;
        });
      e.after(button.get());
    });
  }

  static notify(title, body) {
    chrome.runtime.sendMessage({ type: 'notification', title: title, body: body });
  }
}

class MCEElement // MentorCheckExElement
{
  #element = null;

  constructor(tagName) {
    if (typeof tagName === 'string') {
      this.#element = document.createElement(tagName);
    }
    else if (typeof tagName === 'object') {
      this.#element = tagName;
    }
  }

  static create(obj) {
    return new MCEElement(obj);
  }

  addClass(className) {
    if (typeof className === 'string') {
      this.#element.classList.add(className);
    }
    return this;
  }

  removeClass(className) {
    if (typeof className === 'string') {
      this.#element.classList.remove(className);
    }
    return this;
  }

  addEventListener(type, func) {
    this.#element.addEventListener(type, func);
    return this;
  }

  prop(property, value) {
    if (typeof property === 'object') {
      this.#setObjectProp(this.#element, property);
    }
    else {
      if (typeof value === 'undefined') {
        return this.#element[property];
      }
      else {
        this.#element[property] = value;
      }
    }
    return this;
  }

  #setObjectProp(target, obj) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (typeof value === 'object') {
        this.#setObjectProp(target[key], value);
      }
      else {
        target[key] = value;
      }
    }, this);
  }

  get() {
    return this.#element;
  }

  set(tagName) {
    this.constructor(tagName);
    return this;
  }

  appendChild(child) {
    this.#element.appendChild(
      child.constructor.name === 'MCEElement' ?
        child.get() : child
    );
    return this;
  }

  text(text) {
    if (typeof text === 'undefined') {
      return this.#element.innerText;
    }
    else {
      this.#element.innerText = text;
      return this;
    }
  }
}
