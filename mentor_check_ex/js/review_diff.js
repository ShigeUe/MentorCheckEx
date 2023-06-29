"use strict";

(async () => {
  // ステージを作る
  document.querySelector('#page-content-wrapper > .container-fluid > .row > .col-lg-12').innerHTML =
    `<div id="review-diff-title"></div>
<div class="header flex column-gap-20">
<!--
  <div class="align-self-center">
    <button type="button" id="remove-comments">コメントを削除する</button>
  </div>
  <div class="align-self-center">
    <button type="button" id="strip-emptyline">空行を削除する</button>
  </div>
  <div class="align-self-center">
    <button type="button" id="css-sort">CSSのプロパティを並べ替える</button>
  </div>
-->
  <div class="height-full">
    <div>
      <label><input type="checkbox" id="ignorews" checked> 空白を無視する</label>
      <label><input type="checkbox" id="wrap_lines"> 折り返す</label>
      <label><input type="checkbox" id="line_numbers"> 行番号</label>
    </div>
    <div>
      <a href="#" id="VALIDATOR-LINK" style="display: none">Validator</a>
    </div>
  </div>
  <div class="controller">
    <a href="#" class="prev" title="prev">▲</a>
    <span class="numChanges">No diffs</span>
    <a href="#" class="next" title="next">▼</a>
  </div>
  <div class="labels">
    <div class="student">受講生</div>
    <div class="review">課題レビュー基準</div>
  </div>
  <div class="message_area"></div>
</div>
<div class="mergely-area">
  <div class="mergely-full-screen-8">
    <div class="mergely-resizer">
      <div id="mergely"><p style="font-size:2em" id="NOW-LOADING">Loading...</p></div>
    </div>
  </div>
</div>
<div style="display: none">
  <form action="https://validator.w3.org/nu/" method="POST" target="_blank" enctype="multipart/form-data" id="HTML-VALIDATOR-FORM">
    <textarea name="content"></textarea>
    <input type="hidden" name="prefill" value="0">
    <input type="hidden" name="doctype" value="Inline">
    <input type="hidden" name="prefill_doctype" value="html401">
    <input type="hidden" name="group" value="0">
  </form>

  <form action="https://jigsaw.w3.org/css-validator/validator" method="POST" enctype="multipart/form-data" target="_blank" id="CSS-VALIDATOR-FORM">
    <textarea name="text"></textarea>
    <input type="hidden" name="profile" value="css3svg">
    <input type="hidden" name="usermedium" value="all">
    <input type="hidden" name="type" value="none">
    <input type="hidden" name="warning" value="1">
    <input type="hidden" name="vextwarning" value="">
    <input type="hidden" name="lang" value="ja">
  </form>
  
  <form action="https://a7.sakuratan.com/final-lp-checker/index2.php" method="POST" target="_blank" id="FINAL-EXAM-CHECKER">
    <textarea name="html"></textarea>
    <textarea name="css"></textarea>
    <textarea name="js"></textarea>
  </form>
</div>
`;

  document.title = '課題レビューDIFF';
  
  const addScript = (path, onload) => {
    const source = chrome.runtime.getURL(path);
    const script = document.createElement('script');
    script.src = source;
    script.onload = onload;
    document.body.appendChild(script);
  };

  // addScript("js/review_diff/codes.js");
  // setTimeout(() => {
  //   addScript("js/review_diff/libraries.js");
  //   setTimeout(() => {
  //     addScript("js/review_diff/css_sorter.js");
  //     setTimeout(() => {
  //       addScript("js/review_diff/main.js");
  //     }, 1000);
  //   }, 100);
  // }, 100);

  addScript("js/review_diff/codes.js", () => {
    addScript("js/review_diff/libraries.js", () => {
      addScript("js/review_diff/css_sorter.js", () => {
        addScript("js/review_diff/main.js");
      });
    });  
  });
})();
