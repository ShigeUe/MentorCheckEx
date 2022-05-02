"use strict";

(async () => {
  const ME = new MentorCheckEx();
  const memo = ME.query('#page-content-wrapper .col-sm-4 [href^="/mentor/users/"]');
  if (!memo) {
    return;
  }
  const href = memo.attributes.href.value;

  // メモを取得
  const res = await fetch(href,
    { method: 'GET', mode: 'same-origin', credentials: 'include' });

  if (!res.ok) {
    throw new Error("HTTP error! status: " + res.status);
  }

  const text = await res.text();

  const doc = document.implementation.createHTMLDocument("").documentElement;
  doc.innerHTML = text;

  // 取得したメモページをMentorCheckExオブジェクトに
  const ME2 = new MentorCheckEx();
  ME2.set_document(doc);
  
  // メモが存在しなければ終了
  if (!ME2.query('#page-content-wrapper .col-lg-12 .button-bar + div')) {
    return;
  }

  const contents = ME2.query('#page-content-wrapper .col-lg-12').children;
  // メモボタンの先祖要素のliを取得する
  const target_li = ME.query('a[href$="/memos"]')?.closest('li');
  if (!target_li) {
    // なければ終了
    return;
  }
  const target = MCEElement.create(target_li);
  const div = MCEElement.create('div').prop('id', 'metor-check-ex-memo');

  // 最初にhrを入れておく
  div.appendChild(MCEElement.create('hr'));
  // メモは6要素目からスタート
  for (let i = 5; i < contents.length; i++) {
    // 区切り線はそのまま使う
    if (contents[i].tagName === 'HR') {
      div.appendChild(MCEElement.create('hr'));
      continue;
    }
    // 文字が入っていない要素はスキップする
    const text = contents[i].innerText.replace('削除', '');
    if (!text) {
      continue;
    }
    // サイドバーに追加する文字を用意する
    // divだったらメンター情報なので太字にする
    const p = MCEElement.create('p');
    if (contents[i].tagName === 'DIV') {
      const b = MCEElement.create('strong').text(text);
      p.appendChild(b);
    }
    else {
      p.text(text);
    }
    div.appendChild(p);
  }

  // タイトルを作る。クリックされたらdivを表示する
  const h4 = MCEElement.create('a').text('メモ一覧をここに表示').prop({ href, id: 'metor-check-ex-button'});
  h4.addEventListener('click', (e) => {
    e.preventDefault();
    const element = ME.queryId('metor-check-ex-memo');
    element.classList.toggle('opened');
    return false;
  });
  target.appendChild(h4);
  target.appendChild(div);

})();