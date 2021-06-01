"use strict";

(function () {
  if (window.opener) {
    window.opener.postMessage('loaded', 'https://techacademy.jp');

    window.addEventListener('message', function (event) {
      if (event.origin === 'https://techacademy.jp' && event.data.username) {
        // usernameに値を入れる
        const username = document.getElementById('username');
        username.value = event.data.username;
        // dispatchEventでchangeを発火すると確定する
        username.dispatchEvent(new Event('change'));

        // passwordに値を入れる
        const password = document.getElementById('password');
        password.value = event.data.password;
        password.dispatchEvent(new Event('change'));

        // 次にCloud9を開かせるために、メッセージを送信
        window.opener.postMessage('processed', event.origin);
        // 遅れてサインインボタンを押す
        setTimeout(function () {
          document.getElementById('signin_button').click();
        }, 100);
      }
    });
  }
})();
