"use strict";

(() => {
    // ステージを作る
  document.querySelector('#page-content-wrapper > .container-fluid > .row > .col-lg-12').innerHTML =
    `<div id="review-diff-title"></div>
<div class="header flex column-gap-20">
  <div class="align-self-center">
    <button type="button" id="remove-comments">コメントを削除する</button>
  </div>
  <div class="align-self-center">
    <button type="button" id="strip-emptyline">空行を削除する</button>
  </div>
  <div class="align-self-center">
    <select id="review-code">
      <option value="">比較するコードを選択してください</option>
    </select>
  </div>
  <div class="flex wrap direction-column column-gap-20 height-full">
    <div>OPTIONS</div>
    <div><label><input type="checkbox" id="ignorews" checked> 空白を無視する</label></div>
    <div><label><input type="checkbox" id="wrap_lines"> 折り返す</label></div>
  </div>
</div>
<div class="mergely-area">
  <div class="mergely-full-screen-8">
    <div class="mergely-resizer">
      <div id="mergely"></div>
    </div>
  </div>
</div>
`;

  document.title = '課題レビューDIFF';
  
  const addScript = (path) => {
    const source = chrome.runtime.getURL(path);
    const script = document.createElement('script');
    script.src = source;
    document.body.appendChild(script);  
  };

  addScript("js/review_diff/codes.js");
  setTimeout(() => {
    addScript("js/review_diff/libraries.js");
    setTimeout(() => {
      addScript("js/review_diff/main.js");
    }, 1000);
  }, 100);
})();
