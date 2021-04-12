"use strict";

(function () {
  if (!/^https:\/\/techacademy\.jp\/mentor\/all\/reports/.test(location.href)) return;

  const query = function (s, d) {
    if (d === undefined) {
      d = document;
    }
    return d.querySelector(s);
  }

  const queryAll = function (s) {
    return document.querySelectorAll(s);
  }

  const queryId = function (id) {
    return document.getElementById(id);
  }

  const createElement = function (p) {
    return document.createElement(p);
  }

  const setStyle = function (selector, styles) {
    const ele = query(selector);
    Object.keys(styles).forEach(function (key) {
      ele.style[key] = styles[key];
    });
  }

  const createMenuElement = function () {
    const li = createElement('li');
    li.classList.add('sidemenu-li');
    li.classList.add('mentorChangeEx');
    return li;
  }

  const createSwitchElement = function (num, text) {
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

  const formatedTime = function () {
    const now = new Date;
    return  ('0' + now.getHours()).slice(-2) + ':' +
            ('0' + now.getMinutes()).slice(-2) + ':' +
            ('0' + now.getSeconds()).slice(-2);
  };

  // 設定のデフォルト値
  let interval = 15;         // リロード間隔
  let chime = false;         // チャイム有無
  let smartIfSimple = false; // 詳細画面割愛

  // チャイムの準備
  const audio = new Audio(chrome.extension.getURL("resources/chime.mp3"));
  audio.volume = 0.5; // ボリュームは半分

  // タイマー用ハンドル
  let handle = 0;
  // 変更判断
  let saveAr = '';
  // もともとのタイトル
  const title = document.title;

  // 設定の取得
  chrome.runtime.sendMessage(null, function (response) {
    if (response.chime) {
      chime = true;
      console.log('The chime is ON.');
    }
    else {
      console.log('The chime is OFF.');
    }
    queryId('pluginSwitchButton4').checked = chime;

    if (response.interval) {
      interval = response.interval - 0;
      console.log('The interval is ' + interval + 's.');
    }

    if (response.smartIfSimple) {
      smartIfSimple = true;
    }
  });

  const checkSimple = function () {
    const ele = queryId('pluginSwitchButton2');
    if (!ele) return false;
    return ele.checked;
  };

  const checkReload = function () {
    return queryId('pluginSwitchButton1').checked;
  };

  const checkChime = function () {
    return queryId('pluginSwitchButton4').checked;
  };

  const simplify = function (simple) {
    const ar = [];
    const s = '.container-fluid .row .col-lg-12 table tr td:first-of-type a';
    const t = queryAll(s);

    // パンくず非表示＆ナビゲーションタブ＆タイトル部分のマージン削除
    setStyle('ol.breadcrumb', { display: simple ? 'none' : '' });
    setStyle('ul.nav-tabs', { display: simple ? 'none' : '' });
    setStyle('#page-content-wrapper h2', { padding: simple ? '0' : '' });

    t.forEach(function (e) {
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

    [3, 4, 6, 7, 9].forEach(function (i) {
      queryAll('table tr th:nth-of-type(' + i + '),table tr td:nth-of-type(' + i + ')')
        .forEach(function (e) {
          e.style.display = simple ? 'none' : '';
        });
    });

    return ar;
  };

  const emphasisBlink = function () {
    const style = query('#page-content-wrapper h2').style;
    style.backgroundColor = (style.backgroundColor) ? "" : "#0f7378";
    style.color = (style.color) ? "" : "white";

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve('timeout');
      }, 500);
    });
  }

  const notify = async function () {
    for (let i = 0; i < 6; i++) {
      await emphasisBlink();
    }
  };

  const changeTitle = function () {
    query('.container-fluid h2').innerText = query('#courseDropdown').innerText + 'レビュー一覧';
  };
  
  const reloadFunc = async function () {
    if (checkReload()) {
      fetch(location.href, { method: 'GET', mode: 'same-origin', credentials: 'include' })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
          }
          return response.text();
        })
        .then(function (text) {
          const doc = document.implementation.createHTMLDocument("").documentElement;
          doc.innerHTML = text;

          var s = '#page-content-wrapper';
          const element = query(s, doc);
          const target = query(s);
          target.outerHTML = element.outerHTML;

          const ar = JSON.stringify(simplify(checkSimple()));

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
          queryId('pluginSwitchMessage').innerText = '更新：' + formatedTime();
          
          changeTitle();
        })
        .catch(function (err) {
          throw err;
        });
    }
  };

  /* これ以降初期化部分
  -------------------------------------------------------------------------- */
  (function () {
    const sidebarNavMenter = query('#sidebar-wrapper ul:last-of-type');

    // シンプル化が出来るのは「レビュー待ち」のみ。
    if (location.pathname == '/mentor/all/reports') {
      // 「シンプル化」ボタンの生成
      const li2 = createSwitchElement(2, 'シンプル化');
      sidebarNavMenter.appendChild(li2);
      li2.addEventListener('change', function (e) {
        simplify(e.target.checked);
      });
    }

    // 「チャイムの有無」ボタンの生成
    const li4 = createSwitchElement(4, 'チャイムの有無');
    sidebarNavMenter.appendChild(li4);

    // 「定期リロード」ボタンの生成
    const li1 = createSwitchElement(1, '定期リロード');
    sidebarNavMenter.appendChild(li1);
    // 「定期リロード」の変更イベント
    li1.addEventListener('change', function (e) {
      if (e.target.checked) {
        reloadFunc();
        handle = setInterval(reloadFunc, interval * 1000);
      }
      else {
        queryId('pluginSwitchMessage').innerText = '';
        clearInterval(handle);
        handle = 0;
        document.title = title;
      }
    });

    // 更新時間表示場所生成
    const li3 = createMenuElement();
    li3.innerHTML = '<span style="color:white;" id="pluginSwitchMessage">&nbsp;</span>';
    sidebarNavMenter.appendChild(li3);

    simplify(false);
    changeTitle();
  })();
})();
