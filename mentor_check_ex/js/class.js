'use strict';

class MentorCheckEx
{
  cloud9_url = '#';
  win_aws    = '';
  settings   = {};

  // 依存性注入用
  static _chrome = chrome;
  static _window = window;
  #chrome = null;
  #window = null;

  #doc = document;
  // デフォルト
  #_settings = {
    interval:      30,
    chime:         false,
    notify:        false,
    smartIfSimple: false,
    new_version:   false,
    username:      '',
    password:      '',
    volume:        50,
    course_list:   [],
    watchSlack:    false,
  };

  constructor() {
    // 空のメッセージを送ることで、Service Workerを起こしてバージョンアップの確認をさせる

    this.#chrome = MentorCheckEx._chrome;
    this.#window = MentorCheckEx._window;
    MentorCheckEx._chrome.runtime.sendMessage({});
  }
  // 設定をクラスに読み込む
  async getSettings() {
    this.settings = await this.#_getSettings();
  }

  // 設定をクラスに読み込むためのプライベートメソッド
  #_getSettings() {
    return new Promise((resolve, reject) => {
      // デフォルト値を付けて設定を所得する
      MentorCheckEx._chrome.storage.local.get(this.#_settings, resolve);
    });
  }

  // クラス内の設定を書き込む
  setSettings() {
    return new Promise((resolve, reject) => {
      this.#chrome.storage.local.set(this.settings, resolve);
    });
  }
  // query系のメソッドの検索元を設定する（通常はdocument）
  set_document(doc) {
    this.#doc = doc;
    return this;
  }
  // 設定されている#docを返す
  get_document() {
    return this.#doc;
  }
  // querySelector
  query(s) {
    return this.#doc.querySelector(s);
  }
  // querySelectorAll
  queryAll(s) {
    return this.#doc.querySelectorAll(s);
  }
  // getElementById
  queryId(i) {
    return this.#doc.getElementById(i);
  }
  // createElement
  create(e) {
    return document.createElement(e);
  }
  // 共通のウィンドウ名で開く
  w_open(url) {
    return this.#window.open(url, 'AWSOpenedFromMentorCheckEx');
  }

  // 画面からusernameとpasswordを取得する
  getUsernameAndPassword() {
    // AWSのリンクの直後のDIVの中にユーザー名とパスワードが入っている
    const aws_info = this.query('a[href*="signin.aws.amazon.com/console"] + div').innerText.split('\n');
    this.settings.username = aws_info[1].split(' ')[1];
    this.settings.password = aws_info[2].split(' ')[1];
  }
  // 「自動でCloud9を開く」ボタンを設置するための設定をする
  setting_cloud9() {
    // AWSのリンクが無ければ終了する
    const aws = this.query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]');
    if (!aws) {
      return;
    }
    // 設定に username が無ければ、画面から取得する
    if (this.settings && (!'username' in this.settings || !this.settings.username)) {
      (async () => {
        this.getUsernameAndPassword();
        await this.setSettings();
      })();
    }

    // AWSログインからのメッセージの受信
    window.addEventListener('message', event => {
      // 目的のページがロードされた
      if (
        event.origin.indexOf('signin.aws.amazon.com') > 0 ||
        event.origin.indexOf('console.aws.amazon.com') > 0
      ) {
        // サインイン画面
        if (event.data === 'loaded' && event.origin.indexOf('signin.aws.amazon.com') > 0) {
          // 開いたwindowにメッセージを送信（ユーザー名とパスワード）
          this.win_aws.postMessage({
            username: this.settings.username,
            password: this.settings.password
          }, event.origin);
        }
        // サインインが完了しダッシュボードが開いた
        if (event.data === 'loaded' && event.origin.indexOf('console.aws.amazon.com') > 0) {
          // Cloud9のリンクを同じwindowで開く
          this.w_open(this.cloud9_url);
        }
      }
    });

    // 「自動でCloud9を開く」ボタンの設置
    this.queryAll('a[href*="aws.amazon.com/cloud9"]').forEach(e => {
      const button = new MCEElement('button')
        .text('自動でCloud9を開く')
        .addClass('auto-open-the-cloud9')
        // ボタンの動作
        .addEventListener('click', event => {
          this.cloud9_url = e.href;
          event.preventDefault();
          // window.name を指定して、リンクを開く
          this.win_aws = this.w_open(aws.href);
          return false;
        });
      e.after(button.get());
    }, this);
  }

  static notify(title, body) {
    MentorCheckEx._chrome.runtime.sendMessage({ type: 'notification', title: title, body: body });
  }
}

// HTML Elementの作成・操作するクラス
class MCEElement // MentorCheckExElement
{
  #element = null;

  constructor(tagNameOrElement) {
    if (typeof tagNameOrElement === 'string') {
      this.#element = document.createElement(tagNameOrElement);
    }
    else if (typeof tagNameOrElement === 'object') {
      this.#element = tagNameOrElement;
    }
  }
  // 新しいインスタンスを作る
  static create(obj) {
    return new MCEElement(obj);
  }
  // クラスの追加
  addClass(className) {
    if (typeof className === 'string') {
      this.#element.classList.add(className);
    }
    else if (className && className.constructor.name === 'Array') {
      className.forEach((c) => this.addClass(c), this);
    }
    return this;
  }
  // クラスの削除
  removeClass(className) {
    if (typeof className === 'string') {
      this.#element.classList.remove(className);
    }
    return this;
  }
  // addEventListenerのラップ
  addEventListener(type, func) {
    this.#element.addEventListener(type, func);
    return this;
  }
  // エレメントのプロパティをセットする
  // valueが省略されている場合は、指定のプロパティを取得する
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
  // エレメントのプロパティをセットする
  // オブジェクトで複数のプロパティがあれば再帰的にセットしていく
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
  // エレメントを取得する
  get() {
    return this.#element;
  }
  // 指定のタグで作り直すか、エレメントをセットする
  set(tagNameOrElement) {
    this.constructor(tagNameOrElement);
    return this;
  }
  // appendChildのラップ
  appendChild(child) {
    this.#element.appendChild(
      child.constructor.name === 'MCEElement' ?
        child.get() : child
    );
    return this;
  }
  // insertBeforeのラップで一番前に挿入する
  insertFirst(child) {
    this.#element.insertBefore(
      child.constructor.name === 'MCEElement' ?
        child.get() : child,
      this.#element.firstChild
    );
    return this;
  }
  // そのエレメントのテキストをセットする or 引数がなければ取得する
  text(text) {
    if (typeof text === 'undefined') {
      return this.#element.innerText;
    }
    else {
      this.#element.innerText = text;
      return this;
    }
  }
  // スタイルを設定する
  style(styles) {
    Object.keys(styles).forEach(key => {
      this.#element.style[key] = styles[key];
    }, this);
    return this;
  }
}
