import { MCEElement }  from "./mceelement";
import { Util } from "./util";

const UTL = new Util;

document.title = '課題レビューの新着一覧 | TechAcademy mentor';

UTL.query('#sidebar-wrapper').remove();  
UTL.query('#wrapper').style.padding = '0';

UTL.set_document(UTL.query('#page-content-wrapper .container-fluid .row .col-lg-12'));
UTL.query('h2').innerText = '課題レビューの新着一覧';
UTL.query('ul.pagination', true) && UTL.query('ul.pagination').remove();
UTL.query('.breadcrumb', true) && UTL.query('.breadcrumb').remove();
UTL.query('ul.nav.nav-tabs', true) && UTL.query('ul.nav.nav-tabs').remove();
UTL.query('ul.nav.nav-pills', true) && UTL.query('ul.nav.nav-pills').remove();
UTL.query('div').remove();
UTL.query('table', true) && UTL.query('table').remove();
UTL.query('p', true) && UTL.query('p').remove();

UTL.get_document().appendChild(
  MCEElement.create('p').text(
    'このページを開いてSlackをブラウザで開くと、ここに課題レビュー通知が表示されます。\n' +
    'ブックマークしておくと便利です。\n'
  ).get()
);

UTL.get_document().appendChild(
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

const thead = UTL.query('table thead');
const htr = MCEElement.create('tr');
const th1 = MCEElement.create('th');
const th2 = MCEElement.create('th').text('ワークスペース');
const th3 = MCEElement.create('th').text('メッセージ');
const th4 = MCEElement.create('th').text('通知日時');
htr.appendChild(th1).appendChild(th2).appendChild(th3).appendChild(th4);
thead.appendChild(htr.get());

const addReview = async (url: string, title: string) => {
  // レビューページを取得し、タイトルを得る
  const response = await fetch(url);
  const review = await response.text();
  const doc = document.implementation.createHTMLDocument("").documentElement as HTMLElement;
  doc.innerHTML = review;
  
  const [reviewTitle,] = (doc.querySelector('title') as HTMLElement).innerText.split('|');

  const id = 'review' + Date.now();
  const tbody = UTL.query('table tbody');
  const btr = MCEElement.create('tr').prop('id', id);
  const atg = MCEElement.create('a')
    .addClass(['btn', 'btn-default', 'btn-sm'])
    .prop({ target: '_blank', dataset: { method: 'post' } })
    .prop('href', url + '/start_review')
    .text('開始');
  atg.get().addEventListener('click', () => {
    UTL.queryId(id).remove();
  });
  const atg2 = MCEElement.create('a')
    .addClass(['btn', 'btn-default', 'btn-sm', 'add-margin-left-10'])
    .prop({ target: '_blank' })
    .prop('href', url)
    .text('詳細');
  const td1 = MCEElement.create('td').appendChild(atg).appendChild(atg2);
  const td2 = MCEElement.create('td').text(title);
  const td3 = MCEElement.create('td').text(reviewTitle);
  const td4 = MCEElement.create('td').text((new Date).toLocaleString());
  btr.appendChild(td1).appendChild(td2).appendChild(td3).appendChild(td4);
  if (tbody) {
    tbody.appendChild(btr.get());
  }
};

const removeReview = (url: string) => {
  const target = UTL.query<HTMLAnchorElement>(`a[href^='${url}']`);
  if (target.parentElement && target.parentElement.parentElement) {
    target.parentElement.parentElement.remove();
  }
};

// background.jsとの通信ポートを開く
let port = null;
const connectToBg = () => {
  console.debug((new Date).toLocaleString() + ' Connect to the background.');
  port = chrome.runtime.connect('', { name: 'SlackToBg' });
  port.onDisconnect.addListener(() => {
    console.debug((new Date).toLocaleString() + ' Disconnected from the background.');
    setTimeout(connectToBg, 1000);
  });
  port.onMessage.addListener((data, sender) => {
    if (sender.name === 'SlackToBg' && data?.type === 'addReview') {
      if (data.desc.match(/課題.+提出/)) {
        addReview(data.url, data.title);
      }
      else {
        removeReview(data.url);
      }
    }
  });
};
connectToBg();
