"use strict";

const ME = new MentorCheckEx;

document.title = '課題レビューの新着一覧 | TechAcademy mentor';

ME.set_document(ME.query('#page-content-wrapper .container-fluid .row .col-lg-12'));
ME.query('h2').innerText = '課題レビューの新着一覧';
ME.query('ul.pagination')?.remove();
ME.query('.breadcrumb')?.remove();
ME.query('ul.nav.nav-tabs')?.remove();
ME.query('ul.nav.nav-pills')?.remove();
ME.query('div').remove();
if (ME.query('table')) {
  ME.query('table').remove();
}
if (ME.query('p')) {
  ME.query('p').remove();
}

ME.get_document().appendChild(
  MCEElement.create('p').text(
    'このページを開いてSlackをブラウザで開くと、ここに課題レビュー通知が表示されます。\n' +
    'ブックマークしておくと便利です。\n'
  ).get()
);

ME.get_document().appendChild(
  MCEElement.create('table').addClass(['table', 'table-striped'])
    .appendChild(
      MCEElement.create('thead')
    )
    .appendChild(
      MCEElement.create('tbody')
    )
    .get()
);

document.body.style.height = 'calc(100% - 50px)';

const thead = ME.query('table thead');
const htr = MCEElement.create('tr');
const th1 = MCEElement.create('th');
const th2 = MCEElement.create('th').text('ワークスペース');
const th3 = MCEElement.create('th').text('メッセージ');
const th4 = MCEElement.create('th').text('通知日時');
htr.appendChild(th1).appendChild(th2).appendChild(th3).appendChild(th4);
thead.appendChild(htr.get());

const addReview = (url, title, message) => {
  const id = 'review' + Date.now();
  const tbody = ME.query('table tbody');
  const btr = MCEElement.create('tr').prop('id', id);
  const atg = MCEElement.create('a')
    .addClass(['btn', 'btn-default', 'btn-sm'])
    .prop({ target: '_blank', dataset: { method: 'post' } })
    .prop('href', url + '/start_review')
    .text('開始');
  atg.get().addEventListener('click', () => {
    document.getElementById(id).remove();
  });
  const td1 = MCEElement.create('td').appendChild(atg);
  const td2 = MCEElement.create('td').text(title);
  const td3 = MCEElement.create('td').text(message);
  const td4 = MCEElement.create('td').text((new Date).toLocaleString());
  btr.appendChild(td1).appendChild(td2).appendChild(td3).appendChild(td4);
  tbody.appendChild(btr.get());
};

const removeReview = (url) => {
  const target = ME.query(`a[href^='${url}']`);
  if (target) {
    target.parentElement.parentElement.remove();
  }
};

// background.jsとの通信ポートを開く
let port = null;
const connectToBg = () => {
  port = chrome.runtime.connect('', { name: 'SlackToBg' });
  port.onDisconnect.addListener(() => {
    console.debug((new Date).toLocaleString() + ' Disconnected from the background.');
    setTimeout(connectToBg, 1000);
  });
  port.onMessage.addListener((data, sender) => {
    if (sender.name === 'SlackToBg' && data?.type === 'addReview') {
      if (data.desc.match(/課題.+提出/)) {
        addReview(data.url, data.title, data.desc);
      }
      else {
        removeReview(data.url);
      }
    }
  });
};
connectToBg();
