"use strict";

(() => {

  /* ----------------------------------------------------------------------- */
  /* Utility functions
  -------------------------------------------------------------------------- */
  const query = s => document.querySelector(s);
  const queryAll = s => document.querySelectorAll(s);
  const createElement = p => document.createElement(p);

  const querySelectorAndContent = (s, c) => {
    const elements = document.querySelectorAll(s);
    let ret = null;
    elements.forEach(e => {
      if (e.innerText.toLowerCase().search(c.toLowerCase()) >= 0) {
        ret = e;
      }
    });
    return ret;
  }

  /* ----------------------------------------------------------------------- */
  /* 実行部分
  -------------------------------------------------------------------------- */
  let selectorBase;
  if (location.href.indexOf('mentor/reports') > 0) {
    selectorBase = '.sidemenu-fixed ';
  }
  else {
    selectorBase = '.table.table-users:first-of-type ';
  }
  let win_aws = 0;

  // 固定サイドメニューの「メモ」を新規タブに変更
  const memo = query('.sidemenu-fixed a[href$="memos"]');
  memo.target = '_blank';

  // AWSへのリンク取得
  const aws = query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]');
  if (!aws) {
    return;
  }
  // AWSのログイン情報取得
  const aws_info = query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"] + div').innerText.split('\n');
  const aws_username = aws_info[1].split(' ')[1];
  const aws_password = aws_info[2].split(' ')[1];

  // コース名取得
  const course = query('#page-content-wrapper h4 + ul li:nth-of-type(2)').innerText.replace('コース：', '').split(' ')[0];
  // コース用Cloud9リンク取得
  const cloud9 = querySelectorAndContent('#page-content-wrapper a[href*="aws.amazon.com/cloud9"]', course);
  if (cloud9) {
    // コース以外のCloud9リンク無効
    queryAll('#page-content-wrapper a[href*="aws.amazon.com/cloud9"]').forEach(function (e) {
      if (e !== cloud9) {
        const innerHTML = e.innerHTML;
        const span = createElement('span');
        span.innerHTML = e.innerHTML;
        e.replaceWith(span);
      }
    });

    // AWSログインからのメッセージの受信
    window.addEventListener('message', function (event) {
      // 目的のページがロードされた
      if (event.origin === 'https://signin.aws.amazon.com') {
        if (event.data === 'loaded') {
          win_aws.postMessage({
            username: aws_username,
            password: aws_password
          }, event.origin);
        }
        // サインインプロセスが開始した
        if (event.data === 'processed') {
          // 少し遅れてCloud9のリンクを開く
          setTimeout(function () {
            cloud9.click();
          }, 1000);
        }
      }
    });


    // 「自動でCloud9を開く」ボタンの設置
    const aws_title = querySelectorAndContent('.add-margin-top-0.display-11.font-weight-bold', 'AWS詳細');
    const button = createElement('button');
    button.innerText = '自動でCloud9を開く';
    button.id = 'auto-open-the-cloud9';
    aws_title.append(button);
    // ボタンの動作
    button.addEventListener('click', (event) => {
      event.preventDefault();
      win_aws = window.open(aws.href);
      return false;
    });
  }

})();
