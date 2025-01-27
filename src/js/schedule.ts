import { Util } from './util';
import { MCEElement } from './mceelement';

// 他のメンターの予定
const COURSE_TBODY = Util.query<HTMLElement>('#eachMentors table tbody');

// メンター名取得
const MENTOR_NAME = Util.query<HTMLAnchorElement>('#billy-navbar-collapse > :last-child .mentor-name').innerText;
// 自分のスケジュール
const MY_SCHEDULE = Util.queryAll('#myShift table tr');
// 自分のスケジュールを他のメンターの予定にも入れる
if (MY_SCHEDULE.length) {
  for (let i = 1; i < MY_SCHEDULE.length; i++) {
    const tr = MCEElement.create(MY_SCHEDULE[i].cloneNode(true) as HTMLElement);
    const td1 = MCEElement.create('td').text(MENTOR_NAME);
    const td2 = MCEElement.create('td').text('-------------------');
    tr.insertFirst(td2);
    tr.insertFirst(td1);
    COURSE_TBODY.appendChild(tr.get());
  }
}

// メンターの並び替え
const COURSE_TR = Array.from(Util.queryAll<HTMLTableRowElement>('#eachMentors table tbody tr'));
COURSE_TR.sort((a, b) => {
  const aa = (a.children[1] as HTMLElement).innerText;
  const bb = (b.children[1] as HTMLElement).innerText;
  if (aa == bb) {
    return (a.children[2] as HTMLElement).innerText > (b.children[2] as HTMLElement).innerText ? 1 : -1;
  }
  return aa > bb ? 1 : -1;
});
COURSE_TBODY.innerHTML = '';
COURSE_TR.forEach(e => COURSE_TBODY.appendChild(e));

// 担当時間のtd一覧
const TIME_TD   = Util.queryAll<HTMLTableColElement>('#eachMentors table tbody tr td:nth-of-type(3)');
// メンターの担当コースの入ったtd一覧
const COURSE_TD = Util.queryAll<HTMLTableColElement>('#eachMentors table tbody tr td:nth-of-type(4)');

// コース文字列を取得
const tmp_courses: { [key: string]: number } = {};
COURSE_TD.forEach(e => {
  const course_array = e.innerText.split(', ');
  course_array.forEach(course => {
    tmp_courses[course] = 1;
  });
});
const courses = Object.keys(tmp_courses);
// すべてを最後に追加
courses.sort().push('すべて');

// スケジュールの表示・非表示
const showOrHiddenSchedule = (type: string, value: string) => {
  // コースボタンが押された場合
  if (type === 'course') {
    Util.queryId('plugin-time-mo').classList.remove('selected');
    Util.queryId('plugin-time-am').classList.remove('selected');
    Util.queryId('plugin-time-pm').classList.remove('selected');
    COURSE_TD.forEach(ele => {
      const parent = ele.parentElement as HTMLElement;
      parent.style.display = '';
      parent.dataset.course = '';
      parent.dataset.ampm = '';
      if (ele.innerText.indexOf(value) < 0 && value != 'すべて') {
        parent.style.display = 'none';
        parent.dataset.course = 'hide';
      }
    });
  }
  // 前半・後半ボタンが押された場合
  else if (type === 'ampm') {
    TIME_TD.forEach(ele => {
      const parent = ele.parentElement;
      if (parent && parent.dataset.ampm) {
        parent.style.display = '';
        parent.dataset.course = '';
      }
      if (parent && ele.innerText.indexOf(value) < 0 && !parent.dataset.course) {
        parent.style.display = 'none';
        parent.dataset.ampm = 'hide';
      }          
    });
  }
};
// ボタンが押されたときの動作
const button_click = (e: MouseEvent) => {
  // 選択ボタンのスタイルを削除
  const b = Util.query('#plugin-button-area button.selected');
  b.classList.remove('selected');
  const target = e.target as HTMLElement;
  // クリックしたボタンを選択
  target.classList.add('selected');
  // 行を表示・非表示を操作する
  const course = target.dataset.course ?? "";
  showOrHiddenSchedule('course', course);
  return false;
};

// ボタンを挿入する目標
const table = Util.query<HTMLTableElement>('#eachMentors table');
// ボタンを包むdiv
let div = MCEElement.create('div').prop({ id: 'plugin-button-area' });

// すべてのコースのボタンの生成
let button;
courses.forEach(e => {
  button = MCEElement
    .create('button')
    .prop({
      type: 'button',
      dataset: { course: e },
      innerText: e
    })
    .addClass(e === 'すべて' ? 'selected' : '')
    .addEventListener('click', button_click);
  div.appendChild(button);
});

const br = MCEElement.create('br');
div.appendChild(br);

// 時間帯絞り込みボタン前半
button = MCEElement
  .create('button')
  .prop({
    id: 'plugin-time-mo',
    type: 'button',
    innerText: "午前",
  })
  .addEventListener('click', (e: MouseEvent) => {
    (e.target as HTMLElement).classList.add('selected');
    Util.queryId('plugin-time-am').classList.remove('selected');
    Util.queryId('plugin-time-pm').classList.remove('selected');
    showOrHiddenSchedule('ampm', '午前');
  });
div.appendChild(button);

// 時間帯絞り込みボタン前半
button = MCEElement
  .create('button')
  .prop({
    id: 'plugin-time-am',
    type: 'button',
    innerText: "前半",
  })
  .addEventListener('click', (e: MouseEvent) => {
    (e.target as HTMLElement).classList.add('selected');
    Util.queryId('plugin-time-mo').classList.remove('selected');
    Util.queryId('plugin-time-pm').classList.remove('selected');
    showOrHiddenSchedule('ampm', '前半');
  });
div.appendChild(button);

// 時間帯絞り込みボタン後半
button = MCEElement
  .create('button')
  .prop({
    id: 'plugin-time-pm',    
    type: 'button',
    innerText: "後半",
  })
  .addEventListener('click', (e: MouseEvent) => {
    (e.target as HTMLElement).classList.add('selected');
    Util.queryId('plugin-time-mo').classList.remove('selected');
    Util.queryId('plugin-time-am').classList.remove('selected');
    showOrHiddenSchedule('ampm', '後半');
  });
div.appendChild(button);

// シフトのテーブルの直前に追加
table.before(div.get());


// メンターの担当コースの入ったtd一覧
const TimeZones = Util.queryAll<HTMLTableColElement>('#eachMentors table tr td:nth-of-type(3)');

// 時間帯を見やすくする
TimeZones.forEach(e => {
  const times = e.innerText.split('〜');

  if (times[0] == '11:00' || times[1] == '15:00') {
    const AM = MCEElement
      .create('span')
      .prop({ innerText: '午前' })
      .addClass('plugin-time-mo');
    e.appendChild(AM.get() as HTMLElement);
  }
  if (times[0] == '15:00' || times[1] == '19:00') {
    const AM = MCEElement
      .create('span')
      .prop({ innerText: '前半' })
      .addClass('plugin-time-am');
    e.appendChild(AM.get() as HTMLElement);
  }
  if (times[0] == '19:00' || times[1] == '23:00') {
    const PM = MCEElement
      .create('span')
      .prop({ innerText: '後半' })
      .addClass('plugin-time-pm');
    e.appendChild(PM.get() as HTMLElement);
  }
});
