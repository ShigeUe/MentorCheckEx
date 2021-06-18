"use strict";

// 変数MEは open-cloud9.js で定義済み

// 固定サイドメニューの「メモ」を新規タブに変更
const memo = ME.query('.sidemenu-fixed a[href$="memos"]');
if (memo) {
  memo.target = '_blank';
}
