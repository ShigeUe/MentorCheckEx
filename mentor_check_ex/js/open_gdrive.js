"use strict";

(async () => {
  const selectors = [
    // はじ副2
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/html-basic#kadai-html-1",
      folder: "kadai-html",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/css-basic#kadai-html-2",
      folder: "kadai-html",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/css-basic#kadai-css",
      folder: "kadai-css",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/html-css-tutorial1#kadai-portfolio-1",
      folder: "portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/html-css-tutorial1#kadai-portfolio-2",
      folder: "portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/html-css-tutorial2#kadai-portfolio-3",
      folder: "kadai-portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/jquery1#kadai-jquery1",
      folder: "kadai-jquery1",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/jquery2#kadai-jquery2",
      folder: "kadai-jquery2",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/jquery2#kadai-jquery3",
      folder: "kadai-jquery3",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/smartphone#kadai-smartphone-1",
      folder: "smartphone",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/smartphone#kadai-smartphone-2",
      folder: "smartphone",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice1#kadai-recipe-1",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice1#kadai-recipe-2",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice1#kadai-recipe-3",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice2#kadai-corporate-site-1",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice2#kadai-corporate-site-2",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice2#kadai-corporate-site-3",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/webpage-practice2#kadai-corporate-site-4",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons/final-exam#kadai-final-exam",
      folder: "final-exam",
    },

    // ここから「はじ副2-rd」
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/html-basic#kadai-html-1",
      folder: "kadai-html",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/css-basic#kadai-html-2",
      folder: "kadai-html",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/css-basic#kadai-css",
      folder: "kadai-css",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/html-css-tutorial1#kadai-portfolio-1",
      folder: "portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/html-css-tutorial1#kadai-portfolio-2",
      folder: "portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/html-css-tutorial2#kadai-portfolio-3",
      folder: "kadai-portfolio",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/jquery1#kadai-jquery1",
      folder: "kadai-jquery1",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/jquery2#kadai-jquery2",
      folder: "kadai-jquery2",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/jquery2#kadai-jquery3",
      folder: "kadai-jquery3",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/smartphone#kadai-smartphone-1",
      folder: "smartphone",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/smartphone#kadai-smartphone-2",
      folder: "smartphone",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice1#kadai-recipe-1",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice1#kadai-recipe-2",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice1#kadai-recipe-3",
      folder: "recipe",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice2#kadai-corporate-site-1",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice2#kadai-corporate-site-2",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice2#kadai-corporate-site-3",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/webpage-practice2#kadai-corporate-site-4",
      folder: "corporate-site",
    },
    {
      url: "/mentor/courses/first-sidejob/curriculums/first-sidejob-2-rd/lessons/final-exam#kadai-final-exam",
      folder: "final-exam",
    },
  ];

  const ME = new MentorCheckEx();

  let target = "";
  selectors.forEach((e) => {
    if (ME.query(`#page-content-wrapper .col-sm-8 a[href="${e.url}"]`)) {
      target = e.folder;
    }
  });

  if (!target) {
    return;
  }

  const link = ME.query('[href^="https://drive.google.com/drive/"]');
  if (!link) {
    return;
  }

  // 設定を同期的に読み込み
  await ME.getSettings();
  console.log(ME.settings.rclone);
  
  const f_id = link.href.split('/').at(-1).replace(/\?[-a-z=_]*/, "");
  const command = ME.settings.rclone + ` ${f_id} ${target}`;

  const div = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = command;
  input.id = 'rclone-command';
  input.style.width = '100%';
  input.style.display = 'block';
  input.onfocus = function () {
    this.select();
    ME.copyClipboard(this.value);
  };

  const label = document.createElement('label');
  label.htmlFor = 'rclone-command';
  label.style.display = 'block';
  label.style.marginTop = '.5em';
  label.append('rcloneコマンド');

  const small = document.createElement('p');
  small.innerHTML = '<small>コマンドはオプションで変更できます。</small><br>' +
    '<a href="/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons?diff" target="_blank">レビュー比較ツール</a>';

  div.append(label);
  div.append(input);
  div.append(small);
  link.parentElement.append(div);
})();
