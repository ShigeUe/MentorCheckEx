"use strict";

(() => {

  /* ----------------------------------------------------------------------- */
  /* Variables
  -------------------------------------------------------------------------- */
  // クラス
  const ME = new MentorCheckEx();
  const ME2 = new MentorCheckEx();

  // 設定
  let interval = 15;         // リロード間隔
  let chime = false;         // チャイム有無
  let smartIfSimple = false; // 詳細画面割愛
  let new_version = false;   // 新しいバージョンの有無

  // チャイムの準備
  const audio = new Audio(chrome.runtime.getURL("resources/chime.mp3"));
  audio.volume = 0.5; // ボリュームは半分

  // タイマー用ハンドル
  let handle = 0;
  // 変更判断
  let saveAr = '';
  // もともとのタイトル
  const title = document.title;
  /* ----------------------------------------------------------------------- */


  /* ----------------------------------------------------------------------- */
  /* Utility functions
  -------------------------------------------------------------------------- */
  // const query = (s, d) => {
  //   if (d === undefined) {
  //     d = document;
  //   }
  //   return d.querySelector(s);
  // }

  // const queryAll = s => document.querySelectorAll(s);
  // const queryId = id => document.getElementById(id);
  // const createElement = p => document.createElement(p);
  /* ----------------------------------------------------------------------- */

  const setStyle = (selector, styles) => {
    const ele = ME.query(selector);
    Object.keys(styles).forEach(key => {
      ele.style[key] = styles[key];
    });
  }

  const createMenuElement = () => {
    const li = ME.create('li');
    li.classList.add('sidemenu-li');
    li.classList.add('mentorChangeEx');
    return li;
  }

  const createSwitchElement = (num, text) => {
    const li = createMenuElement();
    li.innerHTML =
      '<div class="pluginSwitchArea">' +
        '<input type="checkbox" id="pluginSwitchButton' + num + '">' +
        '<label for="pluginSwitchButton' + num + '"><span></span></label>' +
        '<div class="swImg"></div>' +
      '</div>' +
      '<span style="color:white;">　' + text + '</span>';
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
    if (!ele) return false;
    return ele.checked;
  };

  const checkReload = () => ME.queryId('pluginSwitchButton1').checked;
  const checkChime  = () => ME.queryId('pluginSwitchButton4').checked;

  const getChallengesAndSimplify = simple => {
    const ar = [];
    const s = '.container-fluid .row .col-lg-12 table tr td:first-of-type a';
    const t = ME.queryAll(s);

    // パンくず非表示＆ナビゲーションタブ＆タイトル部分のマージン削除
    setStyle('ol.breadcrumb', { display: simple ? 'none' : '' });
    setStyle('ul.nav-tabs', { display: simple ? 'none' : '' });
    setStyle('#page-content-wrapper h2', { padding: simple ? '0' : '' });

    t.forEach(e => {
      let h = e.href;
      e.target = '_blank';

      if (simple && smartIfSimple) {
        e.dataset.method = 'post';
        e.href = h + '/start_review';
        e.innerText = '開始';
      }
      else {
        if (h.indexOf('/start_review') > 0) {
          h = h.replace('/start_review', '');
          e.dataset.method = '';
          e.href = h;
          e.innerText = '詳細';
        }
      }
      ar.push(h);
    });

    [3, 4, 6, 7, 9].forEach(i => {
      ME.queryAll('table tr th:nth-of-type(' + i + '),table tr td:nth-of-type(' + i + ')')
        .forEach(e => {
          e.style.display = simple ? 'none' : '';
        });
    });

    return ar;
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
    if (checkReload()) {
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
          target.outerHTML = element.outerHTML;

          const ar = JSON.stringify(getChallengesAndSimplify(checkSimple()));

          if (saveAr != '' && ar != saveAr) {
            if (checkChime()) {
              audio.play();
            }
            document.title = '!!変更あり!! ' + title;
            notify();
            console.info('A change has been detected. ' + formatedTime());
          }
          else {
            document.title = '監視中... ' + title;
          }

          saveAr = ar;
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
    const sidebarNavMenter = ME.query('#sidebar-wrapper ul:last-of-type');

    // シンプル化が出来るのは「レビュー待ち」のみ。
    if (location.pathname == '/mentor/all/reports') {
      // 「シンプル化」ボタンの生成
      const li2 = createSwitchElement(2, 'シンプル化');
      sidebarNavMenter.appendChild(li2);
      li2.addEventListener('change', e => {
        getChallengesAndSimplify(e.target.checked);
      });
      console.log()
    }

    // 「チャイムの有無」ボタンの生成
    const li4 = createSwitchElement(4, 'チャイムの有無');
    sidebarNavMenter.appendChild(li4);
    ME.queryId('pluginSwitchButton4').checked = chime;

    // 「定期リロード」ボタンの生成
    const li1 = createSwitchElement(1, '定期リロード');
    sidebarNavMenter.appendChild(li1);
    // 「定期リロード」の変更イベント
    li1.addEventListener('change', e => {
      if (e.target.checked) {
        reloadFunc();
        handle = setInterval(reloadFunc, interval * 1000);
      }
      else {
        ME.queryId('pluginSwitchMessage').innerText = '';
        clearInterval(handle);
        handle = 0;
        document.title = title;
      }
    });

    // 更新時間表示場所生成
    const li3 = createMenuElement();
    li3.innerHTML = '<span style="color:white;" id="pluginSwitchMessage">&nbsp;</span>';
    sidebarNavMenter.appendChild(li3);

    if (new_version) {
      const li5 = createMenuElement();
      li5.innerHTML = '<span id="pluginVersionUpMessage">MentorCheckExの<br>新バージョンあり</span>';
      sidebarNavMenter.appendChild(li5);
    }

    getChallengesAndSimplify(false);
    changeTitle();
  };

  // 設定の取得
  chrome.storage.sync.get({
    interval: 15,
    chime: false,
    smartIfSimple: false,
    new_version: false,
  }, items => {
    interval      = items.interval;
    chime         = items.chime;
    smartIfSimple = items.smartIfSimple;
    new_version   = items.new_version;

    // 初期化の実行
    init();
  });

})();
