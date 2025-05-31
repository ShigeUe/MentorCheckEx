"use strict";

import { CurriculumIdToData, ReviewCodes } from '../curriculum_codes.js';

(async () => {
  let mergely;

  const comment_strip = (code) => {
    return code
      .replace(/\/\*[\s\S]+?\*\//g, (s) => {
        const lines = s.split('\n').length - 1;
        return '\n'.repeat(lines);
      })
      .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, (s) => {
        const lines = s.split('\n').length - 1;
        return '\n'.repeat(lines);
      })
      .replace(/(?<!https*:)\/\/.+(\r\n|\n|\r})/g, '\n')
      .replace(/\n +\n/g, '\n\n');
  };

  const strip_emptyline = (code) => {
    return code
      .replace(/^ *\n+/g, '')
      .replace(/\n+[\s\n]*\n+/g, '\n')
      .replace(/\n+/g, '\n')
      ;
  };

  const get_text = () => {
    let s_code = mergely.get('lhs');
    let c_code = mergely.get('rhs');

    return { s_code, c_code };
  };

  const set_text = (s_code, c_code) => {
    if (s_code) {
      mergely.lhs(s_code);
    }
    mergely.rhs(c_code);
  };

  const get_type = (name) => {
    return name.split('.').pop();
  }

  const add_suggest = (message, func) => {
    let div = document.createElement('div');
    div.innerHTML = message.replace(/#(\d+)#/g, "<a href='#'>$1</a>").replace(/#do#/,"<button>実行</button>");
    document.querySelector('.header .message_area').append(div);
    div.querySelectorAll("a").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        mergely.scrollTo("lhs", parseInt(e.currentTarget.textContent));
      });
    });
    div.querySelectorAll("button").forEach((el) => {
      el.addEventListener("click", func);
    });
  };

  const diff2text = (diff) => {
    const lines = diff.split('\n');
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].substring(1).trim();
    }
    return lines.join(' ');
  };

  const removeSpaceButword = (s) => {
    return s.replace(/\s+/g, " ").replace(/(?<=^|[\(\)\{\}\<\>,]) | (?=$|[\(\)\{\}\<\>,])/g, "");
  };
  const combZero = (s) => {
    return s.replace(/(?<= )\.(?=\d)/g, "0.");
  }
  const left2right = (diff) => {
    const [diff_l, diff_r] = diff.trim().split('c');
    const { s_code, c_code } = get_text();
    const lhss = s_code.split('\n');
    const rhss = c_code.split('\n');

    let [l_s, l_e] = diff_l.split(',');
    let [r_s, r_e] = diff_r.split(',');
    l_e = (l_e) ?? l_s;
    r_e = (r_e) ?? r_s;
    
    let replaceText = '';
    for (let i = l_s - 1; i < l_e; i++) {
      replaceText += lhss[i] + '\n';
    }
    rhss.splice(r_s - 1, r_e - r_s + 1, replaceText.trimEnd());

    mergely.once('updated', () => {
      mergely.scrollTo('rhs', parseInt(r_s));
      mergely.scrollTo('lhs', parseInt(l_s));
    });
    mergely.rhs(rhss.join('\n'));
  }
  const make_suggest = () => {

    const diff = mergely.diff().trim();

    document.querySelector('.header .message_area').innerHTML = '';
    if (!diff) {
      return;
    }

    let { s_code,  } = get_text();
    
    if(s_code.includes("　")) {
      add_suggest("全角スペースを「□」に置き換える #do#", () => {
        mergely.lhs(s_code.replace(/　/g,"□"));
      });
    }

    const diffs = diff.split(/^(?=\d)|(?<=^\d.*)\n/m);

    for (let i = 0; i < diffs.length; i+=2) {
      if (diffs[i].match(/^[\d,]+c[\d,]+$/)) {
        const num = diffs[i].split(/[,c]/).shift();
        let [lh, rh] = diffs[i + 1].split(/---\n/m);
        lh = removeSpaceButword(diff2text(lh.trim()));
        rh = removeSpaceButword(diff2text(rh.trim()));

        const [diff_l, diff_r] = diffs[i].split('c');
        // どちらか一方が1行 かつ 改行をとっても一致する
        if (
          lh == rh &&
          (!diff_l.includes(',') && diff_r.includes(',') || diff_l.includes(',') && !diff_r.includes(','))
        ) {
          add_suggest(`#${num}#: 1行にすると一致 #do#`, () => {
            left2right(diffs[i]);
          });
        }
        if (lh.match(/ \.\d+/) || rh.match(/ \.\d+/)) {
          if (combZero(lh.trim()) == combZero(rh.trim())) {
            add_suggest(`#${num}#: 値に0を付けると一致 #do#`, () => {
              left2right(diffs[i]);
            });
          }
        }
      }
    }
  };

  const open_HTML_validator = (html) => {
    const form = document.getElementById('HTML-VALIDATOR-FORM');
    form.content.value = html;
    form.submit();
  };
  const open_css_validator = (css) => {
    const form = document.getElementById('CSS-VALIDATOR-FORM');
    form.text.value = css;
    form.submit();
  }
  const open_finalexam_checker = (html, css, js) => {
    const form = document.getElementById('FINAL-EXAM-CHECKER');
    form.html.value = html;
    form.css.value = css;
    form.js.value = js;
    form.submit();
  }



  // -------------------------------------------------------------------------------------------------
  const this_url = new URL(location.href);
  const drive_id = this_url.searchParams.get('id');
  const folder = this_url.searchParams.get('folder');
  const curriculum_id = this_url.searchParams.get('c_id');
  const previewBase = `https://a7.sakuratan.com/gdrive/${drive_id}/${folder}/`;
  const fetchBase = `https://a7.sakuratan.com/7e9a64a25f27ee0397c8b11131328e9b/get.php?p=${drive_id}/${folder}/`;


  // ユーザー情報取得
  let userName;
  let gdrivelink = await (async () => {
    const userRes = await fetch('/mentor/users/' + this_url.searchParams.get('user'));
    const userHTML = await userRes.text();
    const $user = (new DOMParser).parseFromString(userHTML, 'text/html');
    userName = $user.querySelector('h2.heading-users').innerText;
    document.querySelector('.labels .student').innerHTML = `<a href="${previewBase}" target="_blank" title="プレビュー">${userName}さんのプレビュー</a>`;
    return $user.querySelector('[href^="https://drive.google.com/drive/"]:has(i)').href;
  })();

  // 同期
  const syncRes = await fetch(`https://a7.sakuratan.com/7e9a64a25f27ee0397c8b11131328e9b/sync.php?id=${drive_id}&f=${folder}`, {
    credentials: 'include',
    cache: 'no-cache',
    mode: 'cors',
  });
  const syncResult = await syncRes.json();
  if (syncResult.code == '404') {
    document.getElementById('mergely').innerHTML = `<p style="color:red;font-weight:bold">${userName}さんの"${drive_id}/${folder}"フォルダがありません。`;
    return;
  }
  console.log('ProcessingTime:' + syncResult.processingTime);
  console.log('[rclone output]\n' + syncResult.output);

  // 後ほど使う時用のバックアップ
  const code_backup = {};

  // コードの取得元が課題レビュー基準かGitHubか
  const diffFromGit = document.getElementById('diffFromGit').value - 0;

  // レビュー用コードの取得
  if (diffFromGit) {
    document.getElementById('whenDiffFromGit').innerText = '　from GitHub';
    await ReviewCodes.getCodesFromGit();
  }
  else {
    await ReviewCodes.getCodes();
  }
  let reviewCode = '';
  if (ReviewCodes.codes[curriculum_id]) {
    for (let code of ReviewCodes.codes[curriculum_id]) {
      let temp = strip_emptyline(comment_strip(code.code.trim()));
      reviewCode += `### ${code.file}\n${temp}\n\n\n\n\n`;
    }
  }
  
  // 受講生コードの取得
  let studentCode = '';
  for (let fileName of CurriculumIdToData[curriculum_id].files) {
    const fetchUrl = `${fetchBase}${fileName}`;
    let re;
    try {
      re = await fetch(fetchUrl, {
        credentials: 'include',
        cache: 'no-cache',
        mode: 'cors',
      });  
    }
    catch (e) {
      console.log(e);
    }

    const filename = fetchUrl.split('/').pop();

    let tx;
    if (!re) {
      // $('#mergely').html(
      //   `<p>${fileName}の読み込みエラーが発生しました。<br>
      //   ${userName}さんの<a href="${gdrivelink}" target="_blank">Google Drive</a>を確認してみてください。</p>`
      // );
      // return;
      tx = '';
    }
    else {
      tx = await re.text();
    }
    code_backup[get_type(filename)] = tx;
    tx = strip_emptyline(comment_strip(tx.trim()));
    studentCode += `### ${filename}\n${tx}\n\n\n\n\n`;
  }
  
  if (code_backup.html || code_backup.css) {
    document.getElementById('VALIDATOR-LINK').addEventListener('click', (e) => {
      e.preventDefault();
      if (code_backup.html) {
        open_HTML_validator(code_backup.html);
      }
      if (code_backup.css) {
        open_css_validator(code_backup.css);
      }
    });
    document.getElementById('VALIDATOR-LINK').style.display = 'inline';
  }

  // mergelyの高さを30000pxにする（キャプチャ用）
  document.getElementById('MAX-SCREEN').addEventListener('click', (e) => {
    e.preventDefault();

    const lhs_lastLine = mergely.cm('lhs').lastLine();
    const rhs_lastLine = mergely.cm('rhs').lastLine();

    const lastLine = lhs_lastLine > rhs_lastLine ? lhs_lastLine : rhs_lastLine;
    const maxPixel = (lastLine + 10) * 18; // 念のため10行余分に取る

    const element = document.getElementById('mergely');
    e.currentTarget.innerText = (element.style.height) ? 'mergelyの高さを最大化' : 'mergelyの高さを戻す';
    element.style.height = (element.style.height) ? '' : maxPixel + 'px';
    mergely.resize();
    return false;
  });

  document.title = `${userName}さんの課題レビュー`;

  if (!ReviewCodes.codes[curriculum_id]) {
    document.getElementById('mergely').innerHTML = `<h3>${userName}さんの課題</h3><p><strong>「${CurriculumIdToData[curriculum_id].title}」</strong></p>
      <p><code><a href="https://drive.google.com/drive/folders/${drive_id}?usp=drive_link" target="_blank">/${drive_id}</a>/${folder}</code></p>
      <p>この課題はコードの比較は出来ません。<br>直接プレビューしましょう。</p>
      <ul>
      <li><a href="${previewBase}${CurriculumIdToData[curriculum_id]?.files[0]}" target="_blank">プレビューを開く</a></li>
      <li><a href="javascript:document.getElementById('VALIDATOR-LINK').click()">バリデータを開く</a></li>
      ` +
      (curriculum_id == 'kadai-final-exam' ? '<li><a href="#" id="FINAL-EXAM-CHECK-LINK">最終課題チェッカー</a></li>' : '') +
      (curriculum_id == 'kadai-css' ? `<li><a href="${previewBase}style.css" target="_blank">style.cssを開く</a></li>` : '') +
      (curriculum_id.match(/jquery/) ? `<li><a href="${previewBase}main.js" target="_blank">main.jsを開く</a></li>` : '') +
      (CurriculumIdToData[curriculum_id].demo ?
        `<li><a href="${CurriculumIdToData[curriculum_id].demo}" target="_blank">デモページ</a></li>` : '') +
      (CurriculumIdToData[curriculum_id].description ?
        `<li>${CurriculumIdToData[curriculum_id].description}</li>` : '') +
      `</ul>`;

    if (curriculum_id == 'kadai-final-exam') {
      document.getElementById('FINAL-EXAM-CHECK-LINK').addEventListener('click', (e) => {
        e.preventDefault();
        open_finalexam_checker(code_backup?.html,code_backup?.css,code_backup?.js)
      });
    }
    return;
  }

  document.getElementById('NOW-LOADING').remove();
  document.querySelector('#page-content-wrapper > .container-fluid > .row > .col-lg-12 .header').style.visibility = 'visible';

  mergely = new Mergely('#mergely', {
    ignorews: true,
  });
  
  window.G_MERGELY = mergely;

  mergely.once('updated', () => {
    set_text(studentCode, reviewCode);
    setTimeout(() => {
      make_suggest();
      mergely.options({line_numbers: false, sidebar: false})
    }, 500);
  });

  setTimeout(() => {
    document.querySelector('.mergely-splash')?.click();
  }, 2000);
  
  mergely.on('updated', () => {
    const summary = mergely.summary();
    document.querySelector('.header .controller .numChanges').innerText = summary.numChanges ? summary.numChanges + ' diffs' : 'No diffs';
    make_suggest();
  });

  document.querySelectorAll('.header .controller .prev,.header .controller .next').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('next')) {
        mergely.scrollToDiff('next');
      }
      else {
        mergely.scrollToDiff('prev');
      }
      return false;
    });
  });
  
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
    el.addEventListener('change', (e) => {
      const options = {};
      document.querySelectorAll('input[type="checkbox"]').forEach((cb) => options[cb.id] = cb.checked);
      mergely.options(options);
    });
  });

  // インデントを削除する
  document.getElementById('REMOVE-INDENT').addEventListener('click', (e) => {
    e.preventDefault();
    const { s_code, c_code } = get_text();
    const s_lines = s_code.split('\n');
    const c_lines = c_code.split('\n');

    s_lines.forEach((line, i) => s_lines[i] = line.trimStart());
    c_lines.forEach((line, i) => c_lines[i] = line.trimStart());

    set_text(s_lines.join('\n'), c_lines.join('\n'));
    window.setTimeout(() => {
      const ignorews = document.getElementById('ignorews');
      ignorews.checked = false;
      ignorews.dispatchEvent(new Event('change'));
    }, 100);
  });
})();
