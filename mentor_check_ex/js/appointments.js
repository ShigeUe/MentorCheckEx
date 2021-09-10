"use strict";

/* ----------------------------------------------------------------------- */
/* Variables
-------------------------------------------------------------------------- */
// クラス
const ME = new MentorCheckEx();
// .myMentoring（ラベル行）、.cancelled（振替）を抜かしたtrを検索
const els = ME.queryAll('#page-content-wrapper table tr:not(.cancelled):not(.myMentoring)');
const result = {};

/* ----------------------------------------------------------------------- */

if (els.length) {
  els.forEach((el) => {
    const [course] = el.children[3].innerText.split('\n');
    result[course] = (result[course] ?? 0) + 1;
  });
  result['合計'] = els.length;

  const tbody = MCEElement.create('tbody')
  Object.keys(result).forEach((course) => {
    const td1 = MCEElement.create('td').text(course);
    const td2 = MCEElement.create('td').text(result[[course]] + '件');
    const tr = MCEElement.create('tr').appendChild(td1).appendChild(td2);
    tbody.appendChild(tr);
  });
  const table = MCEElement
    .create('table')
    .addClass('table')
    .addClass('table-striped')
    .appendChild(tbody);
  const dialog = MCEElement
    .create('div')
    .addClass('dialog')
    .appendChild(MCEElement.create('i').addClass('fa').addClass('fa-times-circle'))
    .appendChild(table);
  const dialog_base = MCEElement
    .create('div')
    .prop('id', 'mentor-check-ex-dialog')
    .appendChild(dialog);
  MCEElement.create(ME.query('body')).appendChild(dialog_base);


  const atag = MCEElement
    .create('a')
    .addClass('btn')
    .addClass('btn-default')
    .addClass('add-margin-left-5')
    .text('月間集計');
  atag.addEventListener('click', (event) => {
    event.preventDefault();
    dialog_base.style({ display: 'block' });
  });
  const col = MCEElement.create(
    ME.query('#page-content-wrapper > div > div > div > div.row > .col-md-6')
  ).appendChild(atag);

  ME.query('#mentor-check-ex-dialog i.fa-times-circle').addEventListener('click', () => {
    dialog_base.style({ display: 'none' });
  });

  document.addEventListener('keydown', (key) => {
    if (key.code == 'Escape') {
      dialog_base.style({ display: 'none' });
    }
  });

}