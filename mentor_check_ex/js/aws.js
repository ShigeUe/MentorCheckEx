"use strict";

if (window.opener && window.name == 'AWSOpenedFromMentorCheckEx') {
  window.opener.postMessage('loaded', 'https://techacademy.jp');

  window.addEventListener('message', event => {
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

      setTimeout(() => {
        document.getElementById('signin_button').click();
      }, 200);
    }
  });
}
