"use strict";

(function () {
  const selectors = [
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
  
  const f_id = link.href.split('/').at(-1).replace(/\?[-a-z=_]*/, "");
  const w_command = `.\\review.bat ${f_id} ${target}`;
  const m_command = `./review.sh ${f_id} ${target}`;

  const div = document.createElement('div');
  const input1 = document.createElement('input');
  const input2 = document.createElement('input');
  input1.type = 'text';
  input2.type = 'text';
  input1.value = w_command;
  input2.value = m_command;
  input1.style.width = '100%';
  input2.style.width = '100%';
  input1.style.display = 'block';
  input2.style.display = 'block';

  div.append('【Win】');
  div.append(input1);
  div.append('【Mac】');
  div.append(input2);
  link.parentElement.append(div);
})();
