"use strict";

const ME = new MentorCheckEx();

(async () => {
  // 設定を同期的に読み込み
  await ME.getSettings();
  // 「自動でCloud9を開く」ボタンを設置
  ME.setting_cloud9();
})();
