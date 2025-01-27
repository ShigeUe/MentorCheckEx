import { MCEElement } from './mceelement';
import { Util } from './util';

/* ----------------------------------------------------------------------- */
/* Variables
-------------------------------------------------------------------------- */
// クラス
// .myMentoring（ラベル行）、.cancelled（振替）を抜かしたtrを検索
const els = Util.queryAll('#page-content-wrapper table tr:not(.cancelled):not(.myMentoring)');
const result: {[key: string]: number} = {};

/* ----------------------------------------------------------------------- */

if (els.length) {

  // 件数集計
  els.forEach((el) => {
    const [course] = (el.children[3] as HTMLElement).innerText.split('\n');
    result[course] = (result[course] ?? 0) + 1;
  });
  result['合計'] = els.length;

  const tbody = MCEElement.create('tbody')
  Object.keys(result).forEach((course) => {
    const td1 = MCEElement.create('td').text(course);
    const td2 = MCEElement.create('td').text(result[course] + '件');
    const tr = MCEElement.create('tr').appendChild(td1).appendChild(td2);
    tbody.appendChild(tr);
  });
  const table = MCEElement
    .create('table')
    .addClass(['table', 'table-striped'])
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
  MCEElement.create(Util.query('body')).appendChild(dialog_base);


  // ボタンを追加する要素
  const col = MCEElement.create(
    Util.query('#page-content-wrapper > div > div > div > div.row > .col-md-6')
  );

  // カレンダー表示ボタン追加
  const mentoringCalendar = MCEElement
    .create('a')
    .addClass(['btn', 'btn-default', 'add-margin-left-5'])
    .prop('href', location.pathname + '?calendar=1')
    .text('カレンダー表示');
  col.appendChild(mentoringCalendar);

  // 月間集計ボタン追加
  const atag = MCEElement
    .create('a')
    .addClass(['btn', 'btn-default', 'add-margin-left-5'])
    .text('月間集計');
  atag.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    dialog_base.style({ display: 'block' });
  });
  col.appendChild(atag);

  // 月間集計ダイアログの閉じるボタン
  Util.query('#mentor-check-ex-dialog i.fa-times-circle').addEventListener('click', () => {
    dialog_base.style({ display: 'none' });
  });
  // エスケープを押しても閉じる
  document.addEventListener('keydown', (key) => {
    if (key.code == 'Escape') {
      dialog_base.style({ display: 'none' });
    }
  });

}