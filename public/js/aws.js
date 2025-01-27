"use strict";

if (window.opener && window.name == 'AWSOpenedFromMentorCheckEx') {

  if (document.getElementById('awsc-signin-endpoint')) {
    window.opener.postMessage('loaded', 'https://techacademy.jp');
  }
  else {
    function waitForElement(selector, callback) {
      const element = document.getElementById(selector);
      if (element) {
          callback(element);
          return;
      }
  
      const observer = new MutationObserver((mutations, obs) => {
          const element = document.querySelector(selector);
          if (element) {
              callback(element);
              obs.disconnect(); // 監視を停止
          }
      });
  
      observer.observe(document.body, {
          childList: true, // 直接の子要素の変更を監視
          subtree: true    // 子孫ノードも監視
      });
    }
  
    // 使用例
    waitForElement('#username', (element) => {
      window.opener.postMessage('loaded', 'https://techacademy.jp');
  
      window.addEventListener('message', event => {
        if (event.origin === 'https://techacademy.jp' && event.data.username) {
          // usernameに値を入れる
          const username = document.getElementById('username');
          username.value = event.data.username;
          username.dispatchEvent(new Event('input', {bubbles: true}));
    
          // passwordに値を入れる
          const password = document.getElementById('password');
          password.value = event.data.password;
          password.dispatchEvent(new Event('input', {bubbles: true}));
    
          setTimeout(() => {
            document.getElementById('signin_button').click();
          }, 200);
        }
      });
    });
  }
}
