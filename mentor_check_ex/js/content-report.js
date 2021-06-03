"use strict";

(() => {
  // クラス
  const ME = new MentorCheckEx();
  // 自動で開くURL
  let cloud9_url = '#';

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

  // awsのウィンドウを保持する変数
  let win_aws = 0;

  // 固定サイドメニューの「メモ」を新規タブに変更
  const memo = ME.query('.sidemenu-fixed a[href$="memos"]');
  memo.target = '_blank';

  // AWSへのリンク取得
  const aws = ME.query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]');
  if (!aws) {
    return;
  }
  // AWSのログイン情報取得

  // コース名取得
  const course = ME.query('#page-content-wrapper h4 + ul li:nth-of-type(2)').innerText.replace('コース：', '').split(' ')[0];

  // Cloud9の自動ボタンを設定
  ME.setting_cloud9();

})();
