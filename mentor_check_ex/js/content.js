"use strict";

/* ----------------------------------------------------------------------- */
/* Variables
-------------------------------------------------------------------------- */
// クラス
const ME = new MentorCheckEx();
const ME2 = new MentorCheckEx();

// 設定
let interval = 30;         // リロード間隔
let chime = false;         // チャイム有無
let isNotify = false;         // 通知有無
let smartIfSimple = false; // 詳細画面割愛
let new_version = false;   // 新しいバージョンの有無

// チャイムの準備
const audio = new Audio(chrome.runtime.getURL("resources/chime.mp3"));
audio.volume = 0.5; // ボリュームは半分

// タイマー用ハンドル
let handle = 0;
// 変更判断
let save_time = '9999/99/99 99:99:99';
// もともとのタイトル
const title = document.title;
/* ----------------------------------------------------------------------- */


const setStyle = (selector, styles) => {
  const ele = ME.query(selector);
  Object.keys(styles).forEach(key => {
    ele.style[key] = styles[key];
  });
}

const createMenuElement = () =>
  MCEElement.create('li').addClass('sidemenu-li').addClass('mentorChangeEx');

const createSwitchElement = (num, text) => {
  const li = createMenuElement().appendChild(
    MCEElement.create('div').addClass('pluginSwitchArea').appendChild(
      MCEElement.create('input').prop({ id: 'pluginSwitchButton' + num, type: 'checkbox', })
    ).appendChild(
      MCEElement.create('label').prop({ htmlFor: 'pluginSwitchButton' + num }).appendChild(
        MCEElement.create('span')
      )
    )
    .appendChild(
      MCEElement.create('div').addClass('swImg'))
    )
    .appendChild(
      MCEElement.create('span').prop({ style: { color: 'white' } }).text(text)
    );
  return li;
}

const formatedTime = () => {
  const now = new Date;
  return  ('0' + now.getHours()).slice(-2) + ':' +
          ('0' + now.getMinutes()).slice(-2) + ':' +
          ('0' + now.getSeconds()).slice(-2);
};

const checkSimple = () => {
  const ele = ME.queryId('pluginSwitchButton2');
  return ele ? ele.checked : false;
};

const getChallengesAndSimplify = simple => {
  const s = '.container-fluid .row .col-lg-12 table tr td:first-of-type a';
  const t = ME.queryAll(s);

  // パンくず非表示＆ナビゲーションタブ＆タイトル部分のマージン削除
  setStyle('ol.breadcrumb', { display: simple ? 'none' : '' });
  setStyle('ul.nav-tabs', { display: simple ? 'none' : '' });
  setStyle('#page-content-wrapper h2', { padding: simple ? '0' : '' });

  t.forEach(e => {
    const el = MCEElement.create(e);
    let h = el.prop('href');
    el.prop('target', '_blank');

    if (simple && smartIfSimple) {
      el.prop({
        dataset: { method: 'post' },
        href: h + '/start_review',
      })
      .text('開始')
    }
    else {
      if (h.indexOf('/start_review') > 0) {
        h = h.replace('/start_review', '');
        el.prop({
          dataset: { method: '' },
          href: h,
        })
        .text('詳細')
      }
    }
  });

  [3, 4, 6, 7, 9].forEach(i => {
    ME.queryAll('table tr th:nth-of-type(' + i + '),table tr td:nth-of-type(' + i + ')')
      .forEach(e => {
        e.style.display = simple ? 'none' : '';
      });
  });
};

const emphasisBlink = () => {
  const style = ME.query('#page-content-wrapper h2').style;
  style.backgroundColor = (style.backgroundColor) ? "" : "#0f7378";
  style.color = (style.color) ? "" : "white";

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('timeout');
    }, 500);
  });
}

const notify = async () => {
  for (let i = 0; i < 6; i++) {
    await emphasisBlink();
  }
};

const changeTitle = () => {
  ME.query('.container-fluid h2').innerText = ME.query('#courseDropdown').innerText + 'レビュー一覧';
};

const reloadFunc = async () => {
  // リロードスイッチがONなら
  if (ME.queryId('pluginSwitchButton1').checked) {
    fetch(location.href, { method: 'GET', mode: 'same-origin', credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        return response.text();
      })
      .then(text => {
        const doc = document.implementation.createHTMLDocument("").documentElement;
        doc.innerHTML = text;

        var s = '#page-content-wrapper';
        const element = ME2.set_document(doc).query(s);
        const target = ME.query(s);
        if (element) {
          target.outerHTML = element.outerHTML;
        }
        // 最新のレビュー提出時間を取得する
        // 「すべてのレビュー」と「レビュー待ち」でレビューの順序が違うので、最大を取得する。
        let time = "";
        ME2.queryAll('#page-content-wrapper table tr td:nth-of-type(8)').forEach(el => {
          time = time < el.innerText ? el.innerText : time;
        });

        getChallengesAndSimplify(checkSimple())

        if ((!save_time && time) || save_time && time && save_time < time) {
          // チャイムの有無スイッチがONなら
          if (ME.queryId('pluginSwitchButton4').checked) {
            audio.play();
          }
          // 通知の有無スイッチがONなら
          if (ME.queryId('pluginSwitchButton5').checked) {
            MentorCheckEx.notify('課題レビュー', '更新があります。');
            document.title = '!!変更あり!! ' + title;
            notify();
          }
          console.info('A change has been detected. ' + formatedTime());
        }
        else {
          document.title = '監視中... ' + title;
        }

        save_time = time;
        ME.queryId('pluginSwitchMessage').innerText = '更新：' + formatedTime();
        
        changeTitle();
      })
      .catch(err => {
        throw err;
      });
  }
};

/* これ以降初期化部分
-------------------------------------------------------------------------- */
const init = () => {
  const sidebarNavMenter = MCEElement.create(ME.query('#sidebar-wrapper ul:last-of-type'));

  // シンプル化が出来るのは「レビュー待ち」のみ。
  if (location.pathname == '/mentor/all/reports') {
    // 「シンプル化」スイッチの生成
    const li2 = createSwitchElement(2, '　シンプル化');
    li2.addEventListener('change', e => {
      getChallengesAndSimplify(e.target.checked);
    });
    sidebarNavMenter.appendChild(li2);
  }

  // 「チャイム」スイッチの生成
  const li4 = createSwitchElement(4, '　チャイム');
  sidebarNavMenter.appendChild(li4);
  ME.queryId('pluginSwitchButton4').checked = chime;

  // 「通知」スイッチの生成
  const li5 = createSwitchElement(5, '　通知');
  sidebarNavMenter.appendChild(li5);
  ME.queryId('pluginSwitchButton5').checked = isNotify;
  
  // 「定期リロード」スイッチの生成
  const li1 = createSwitchElement(1, '　定期リロード');
  sidebarNavMenter.appendChild(li1);
  // 「定期リロード」の変更イベント
  li1.addEventListener('change', e => {
    if (e.target.checked) {
      reloadFunc();
      handle = setInterval(reloadFunc, interval * 1000);
    }
    else {
      ME.queryId('pluginSwitchMessage').innerHTML = '&nbsp;';
      clearInterval(handle);
      handle = 0;
      document.title = title;
    }
  });

  // 更新時間表示場所生成
  const li3 = createMenuElement().appendChild(
    MCEElement.create('span')
      .prop({ id: 'pluginSwitchMessage', style: { color: 'white' } })
      .text('　')
  )
  sidebarNavMenter.appendChild(li3);

  if (new_version) {
    const li5 = createMenuElement().appendChild(
      MCEElement.create('span')
      .prop({ id: 'pluginVersionUpMessage' })
      .text('MentorCheckExの\n新バージョンあり')
    )
    sidebarNavMenter.appendChild(li5);
  }

  getChallengesAndSimplify(false);
  changeTitle();
};

// 設定の取得
(async () => {
  await ME.getSettings();
  interval      = ME.settings.interval <= 30 ? 30 : ME.settings.interval;
  chime         = ME.settings.chime;
  isNotify      = ME.settings.notify;
  smartIfSimple = ME.settings.smartIfSimple;
  new_version   = ME.settings.new_version;

  // 初期化の実行
  init();
})();
