"use strict";

(async () => {
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
    let s_code = $('#mergely').mergely('get', 'lhs');
    let c_code = $('#mergely').mergely('get', 'rhs');

    return { s_code, c_code };
  };

  const set_text = (s_code, c_code) => {
    if (s_code) {
      $('#mergely').mergely('lhs', s_code);
    }
    $('#mergely').mergely('rhs', c_code);
  };

  const get_type = (name) => {
    return name.split('.').pop();
  }

  const add_suggest = (message, func) => {
    let div = $('<div>');
    div.html(message.replace(/#(\d+)#/g, "<a href='#'>$1</a>").replace(/#do#/,"<button>実行</button>"));
    $('.header .message_area').append(div);
    $(div).find("a").on("click", (e) => {
      e.preventDefault();
      $('#mergely').mergely('scrollTo', "lhs", parseInt(e.currentTarget.textContent));
    });
    $(div).find("button").on("click", func);
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
  const make_suggest = () => {

    const diff = $('#mergely').mergely('diff').trim();

    $('.header .message_area').html('');
    if (!diff) {
      return;
    }

    let codeL = $('#mergely').mergely("get", 'lhs');
    let codeR = $('#mergely').mergely("get", 'rhs');
    
    if(codeL.includes("　")) {
      add_suggest("全角スペースを「□」に置き換える #do#", () => {
        $('#mergely').mergely('lhs',codeL.replace(/　/g,"□"));
      });
    }

    const diffs = diff.split(/^(?=\d)|(?<=^\d.*)\n/m);

    for (let i = 0; i < diffs.length; i+=2) {
      if (diffs[i].match(/^[\d,]+c[\d,]+$/)) {
        const num = diffs[i].split(/[,c]/).shift();
        let [lh, rh] = diffs[i + 1].split(/---\n/m);
        lh = removeSpaceButword(diff2text(lh.trim()));
        rh = removeSpaceButword(diff2text(rh.trim()));

        if (lh == rh) {
          add_suggest(`#${num}#: 1行にすると一致。`);
        }
        if (lh.match(/ \.\d+/) || rh.match(/ \.\d+/)) {
          if (combZero(lh.trim()) == combZero(rh.trim())) {
            add_suggest(`#${num}#: 値に0を付けると一致。`);
          }
        }
      }
    }
  };

  const open_HTML_validator = (html) => {
    const form = $('#HTML-VALIDATOR-FORM').get(0);
    form.content.value = html;
    form.submit();
  };
  const open_css_validator = (css) => {
    const form = $('#CSS-VALIDATOR-FORM').get(0);
    form.text.value = css;
    form.submit();
  }
  const open_finalexam_checker = (html, css, js) => {
    const form = $('#FINAL-EXAM-CHECKER').get(0);
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
    const $user = $(userHTML);
    userName = $user.find('h2.heading-users').text();
    $('.labels .student').html(`<a href="${previewBase}" target="_blank" title="プレビュー">${userName}さんのプレビュー</a>`)  
    return $user.find('[href^="https://drive.google.com/drive/"]:has(i)').get(0).href;
  })();

  // 同期
  const syncRes = await fetch(`https://a7.sakuratan.com/7e9a64a25f27ee0397c8b11131328e9b/sync.php?id=${drive_id}&f=${folder}`, {
    credentials: 'include',
    cache: 'no-cache',
    mode: 'cors',
  });
  const syncResult = await syncRes.json();
  if (syncResult.code == '404') {
    $('#mergely').html(`<p style="color:red;font-weight:bold">${userName}さんの"${drive_id}/${folder}"フォルダがありません。`);
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
    $('#VALIDATOR-LINK').on('click', (e) => {
      e.preventDefault();
      if (code_backup.html) {
        open_HTML_validator(code_backup.html);
      }
      if (code_backup.css) {
        open_css_validator(code_backup.css);
      }
    });
    $('#VALIDATOR-LINK').show();
  }



  if (!ReviewCodes.codes[curriculum_id]) {
    $('#mergely').html(`<h3>${userName}さんの課題</h3><p><strong>「${CurriculumIdToData[curriculum_id].title}」</strong></p>
      <p><code><a href="https://drive.google.com/drive/folders/${drive_id}?usp=drive_link" target="_blank">/${drive_id}</a>/${folder}</code></p>
      <p>この課題はコードの比較は出来ません。<br>直接プレビューしましょう。</p>
      <ul>
      <li><a href="${previewBase}${CurriculumIdToData[curriculum_id]?.files[0]}" target="_blank">プレビューを開く</a></li>
      <li><a href="javascript:$('#VALIDATOR-LINK').click()">バリデータを開く</a></li>
      ` +
      (curriculum_id == 'kadai-final-exam' ? '<li><a href="#" id="FINAL-EXAM-CHECK-LINK">最終課題チェッカー</a></li>' : '') +
      (curriculum_id == 'kadai-css' ? `<li><a href="${previewBase}style.css" target="_blank">style.cssを開く</a></li>` : '') +
      (curriculum_id.match(/jquery/) ? `<li><a href="${previewBase}main.js" target="_blank">main.jsを開く</a></li>` : '') +
      (CurriculumIdToData[curriculum_id].demo ?
        `<li><a href="${CurriculumIdToData[curriculum_id].demo}" target="_blank">デモページ</a></li>` : '') +
      (CurriculumIdToData[curriculum_id].description ?
        `<li>${CurriculumIdToData[curriculum_id].description}</li>` : '') +
      `</ul>`
    );
    if (curriculum_id == 'kadai-final-exam') {
      $('#FINAL-EXAM-CHECK-LINK').on('click', (e) => {
        e.preventDefault();
        open_finalexam_checker(code_backup?.html,code_backup?.css,code_backup?.js)
      });
    }
    return;
  }

  $('#NOW-LOADING').remove();
  $('#page-content-wrapper > .container-fluid > .row > .col-lg-12 .header').css('visibility', 'visible')

  $('#mergely').mergely({
    ignorews: true,
    sidebar: false,
    line_numbers: false,
    loaded: () => {
      // 両方のコードをセット
      set_text(studentCode, reviewCode);
      setTimeout(() => {
        make_suggest();
      }, 500);
    },
  });

  setTimeout(() => {
    $('#mergely-splash').click();
  }, 2000);
  
  $('#mergely').on('updated', () => {
    const summary = $('#mergely').mergely('summary');
    $('.header .controller .numChanges').text(summary.numChanges ? summary.numChanges + ' diffs' : 'No diffs');
    make_suggest();
  });

  $('.header .controller .prev,.header .controller .next').on('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('next')) {
      $('#mergely').mergely('scrollToDiff', 'next');
    }
    else {
      $('#mergely').mergely('scrollToDiff', 'prev');
    }
    return false;
  });

  $('#remove-comments').on('click', () => {
    let { s_code, c_code } = get_text();

    s_code = comment_strip(s_code);
    c_code = comment_strip(c_code);

    set_text(s_code, c_code);
  });

  $('#strip-emptyline').on('click', () => {
    let { s_code, c_code } = get_text();

    s_code = strip_emptyline(s_code);
    c_code = strip_emptyline(c_code);

    set_text(s_code, c_code);
  });

  $('#css-sort').on('click', async () => {
    let { s_code, c_code } = get_text();

    set_text(await CSSSorter(s_code), await CSSSorter(c_code));
  });

  $('input[type="checkbox"]').on('change', (e) => {
    const options = {};
    options[e.target.id] = e.target.checked;
    $('#mergely').mergely('options', options);
  });
})();
