"use strict";

// MentorCheckExクラスのインスタンス
const ME = new MentorCheckEx();
// メンターの並び替え
const COURSE_TR = Array.from(ME.queryAll('#otherShift table tbody tr'));
const COURSE_TBODY = ME.query('#otherShift table tbody');
COURSE_TR.sort((a, b) => {
  const aa = a.children[1].innerText;
  const bb = b.children[1].innerText;
  if (aa == bb) {
    return a.children[2].innerText > b.children[2].innerText ? 1 : -1;
  }
  return aa > bb ? 1 : -1;
});
COURSE_TBODY.innerHTML = '';
COURSE_TR.forEach(e => COURSE_TBODY.appendChild(e));

// 担当時間のtd一覧
const TIME_TD   = ME.queryAll('#otherShift table tbody tr td:nth-of-type(3)');
// メンターの担当コースの入ったtd一覧
const COURSE_TD = ME.queryAll('#otherShift table tbody tr td:nth-of-type(4)');

// コース文字列を取得
const tmp_courses = {};
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
const showOrHiddenSchedule = (type, value) => {
  // コースボタンが押された場合
  if (type === 'course') {
    ME.queryId('plugin-time-am').classList.remove('selected');
    ME.queryId('plugin-time-pm').classList.remove('selected');
    COURSE_TD.forEach(ele => {
      const parent = ele.parentElement;
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
      if (parent.dataset.ampm) {
        parent.style.display = '';
        parent.dataset.course = '';
      }
      if (ele.innerText.indexOf(value) < 0 && !parent.dataset.course) {
        parent.style.display = 'none';
        parent.dataset.ampm = 'hide';
      }          
    });
  }
};
// ボタンが押されたときの動作
const button_click = e => {
  // 選択ボタンのスタイルを削除
  const b = ME.query('#plugin-button-area button.selected');
  if (b) {
    b.classList.remove('selected');
  }
  // クリックしたボタンを選択
  e.target.classList.add('selected');
  // 行を表示・非表示を操作する
  const course = e.target.dataset.course;
  showOrHiddenSchedule('course', course);
  return false;
};

// ボタンを挿入する目標
const table = ME.query('#otherShift table');
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
    .addClass(e === 'すべて' ? 'selected' : null)
    .addEventListener('click', button_click);
  div.appendChild(button);
});

const br = ME.create('br');
div.appendChild(br);

// 時間帯絞り込みボタン前半
button = MCEElement
  .create('button')
  .prop({
    id: 'plugin-time-am',
    type: 'button',
    innerText: "前半",
  })
  .addEventListener('click', e => {
    e.target.classList.add('selected');
    ME.queryId('plugin-time-pm').classList.remove('selected');
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
  .addEventListener('click', e => {
    e.target.classList.add('selected');
    ME.queryId('plugin-time-am').classList.remove('selected');
    showOrHiddenSchedule('ampm', '後半');
  });
div.appendChild(button);

// シフトのテーブルの直前に追加
table.before(div.get());


// メンターの担当コースの入ったtd一覧
const TimeZones = ME.queryAll('#otherShift table tr td:nth-of-type(3)');

// 時間帯を見やすくする
TimeZones.forEach(e => {
  const times = e.innerText.split('〜');

  if (times[0] == '15:00' || times[1] == '19:00') {
    const AM = MCEElement
      .create('span')
      .prop({ innerText: '前半' })
      .addClass('plugin-time-am');
    e.appendChild(AM.get());
  }
  if (times[0] == '19:00' || times[1] == '23:00') {
    const PM = MCEElement
      .create('span')
      .prop({ innerText: '後半' })
      .addClass('plugin-time-pm');
    e.appendChild(PM.get());
  }
});
