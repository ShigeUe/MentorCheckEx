"use strict";

/* ----------------------------------------------------------------------- */
/* Variables
-------------------------------------------------------------------------- */
// クラス
const ME = new MentorCheckEx();
// .myMentoring（ラベル行）、.cancelled（振替）を抜かしたtrを検索
const els = ME.queryAll('#page-content-wrapper table tbody tr');
let sum = 0;

if (els.length) {
  els.forEach((el) => {
    const [hh,mm] = el.children[3].innerText.replace('分', '').split('時間');
    sum = sum + (hh - 0) + mm / 60;
  });
}

const tr = MCEElement.create('tr')
  .appendChild(MCEElement.create('td').text('合計時間'))
  .appendChild(MCEElement.create('td'))
  .appendChild(MCEElement.create('td'))
  .appendChild(MCEElement.create('td').text(sum + '時間'));

ME.query('#page-content-wrapper table tbody').appendChild(tr.get());

