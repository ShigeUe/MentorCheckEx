(() => {
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
      .replace(/(?<!https*:)\/\/.+\n/g, '\n')
      .replace(/\n +\n/g, '\n\n');
  };

  const strip_emptyline = (code) => {
    let result = code;
    for (i = 0; i < 10; i++) {
      result = result
        .replace(/^ *\n/g, '')
        .replace(/\n *\n/g, '\n')
        .replace(/\n+/g, '\n')
        ;
    }
    return result;
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

  review_codes.forEach((ele, i) => {
    const { title, file } = ele;
    const o = $('<option>');
    o.text(title + ' の ' + file);
    o.val(i);
    $('#review-code').append(o);
  });

  $('#page-content-wrapper > .container-fluid > .row > .col-lg-12 .header').css({ opacity: 1 });

  $('#review-code').on('change', (e) => {
    const i = e.target.value;
    if (i === '') {
      set_text(null, '');
      $('#review-diff-title').text('');
    }
    else {
      set_text(null, review_codes[i].code);
      console.log($('#review-code :selected').text());
      $('#review-diff-title').text($('#review-code :selected').text());
    }
  });

  $('#mergely').mergely({
    ignorews: true, sidebar: false,
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
