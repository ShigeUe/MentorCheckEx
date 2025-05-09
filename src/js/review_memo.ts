import { Util } from './util';
import { MCEElement } from './mceelement';

(async () => {
  const memo = Util.query<HTMLAnchorElement>('#page-content-wrapper .list-inline li a[href$="/memos"]', true);
  if (!memo || memo.innerText.substring(0,1) === "0") {
    Util.queryId('page-content-wrapper').style.opacity = "1";
    return;
  }
  const href = memo.attributes.getNamedItem('href')!.value;

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
  const UTL = new Util;
  UTL.set_document(doc);

  // メモが存在しなければ終了
  if (!UTL.query('#page-content-wrapper .col-lg-12 .button-bar + div', true)) {
    Util.queryId('page-content-wrapper').style.opacity = "1";
    return;
  }

  const contents = UTL.query('#page-content-wrapper .col-lg-12').children;
  // メモボタンの先祖要素のliを取得する
  const target_li = Util.query('a[href$="/memos"]')?.closest('li');
  if (!target_li) {
    // なければ終了
    Util.queryId('page-content-wrapper').style.opacity = "1";
    return;
  }
  target_li.style.display = 'block';
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
    const text = (contents[i] as HTMLElement).innerText.replace('削除', '');
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
  h4.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    const element = Util.queryId('metor-check-ex-memo');
    element.classList.toggle('opened');
    return false;
  });
  target.appendChild(h4);
  target.appendChild(div);
  Util.queryId('page-content-wrapper').style.opacity = "1";
})();
