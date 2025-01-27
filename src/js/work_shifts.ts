import { Util } from "./util"; 
import { MCEElement } from "./mceelement";

// .myMentoring（ラベル行）、.cancelled（振替）を抜かしたtrを検索
const els = Util.queryAll('#page-content-wrapper table tbody tr');
let sum = 0;

if (els.length) {
  els.forEach((el) => {
    const [hh,mm] = (el.children[3] as HTMLElement).innerText.replace('分', '').split('時間');
    sum = sum + Number(hh) + Number(mm) / 60;
  });
}

const tr = MCEElement.create('tr')
  .appendChild(MCEElement.create('td').text('合計時間'))
  .appendChild(MCEElement.create('td'))
  .appendChild(MCEElement.create('td'))
  .appendChild(MCEElement.create('td').text(sum + '時間'));

Util.query('#page-content-wrapper table tbody').appendChild(tr.get() as HTMLElement);
