'use strict';

const ME = new MentorCheckEx();

// 設定を同期的に読み込み
(async () => {
  await ME.getSettings();
  ME.setting_cloud9();
})();
