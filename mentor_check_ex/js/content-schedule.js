"use strict";

// クラス
const ME = new MentorCheckEx();

/* ----------------------------------------------------------------------- */
/* 実行部分
-------------------------------------------------------------------------- */

// メンターの担当コースの入ったtd一覧
const COURSE_TD = ME.queryAll('#otherShift table tr td:nth-of-type(4)');
const TIME_TD   = ME.queryAll('#otherShift table tr td:nth-of-type(3)');

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
  if (type === 'course') {
    ME.queryId('plugin-time-am').classList.remove('selected');
    ME.queryId('plugin-time-pm').classList.remove('selected');
    COURSE_TD.forEach(ele => {
      ele.parentElement.dataset.ampm = '';
      ele.parentElement.dataset.course = '';
      ele.parentElement.style.display = '';
      if (ele.innerText.indexOf(value) < 0 && value != 'すべて') {
        ele.parentElement.style.display = 'none';
        ele.parentElement.dataset.course = 'on';
      }
    });
  }
  else if (type === 'ampm') {
    TIME_TD.forEach(ele => {
      if (ele.parentElement.dataset.ampm) {
        ele.parentElement.style.display = '';
        ele.parentElement.dataset.course = '';
      }
      if (ele.innerText.indexOf(value) < 0 && !ele.parentElement.dataset.course) {
        ele.parentElement.style.display = 'none';
        ele.parentElement.dataset.ampm = 'on';
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
let div = ME.create('div');
div.id = 'plugin-button-area';

// すべてのコースのボタンの生成
let button;
courses.forEach(e => {
  button = ME.create('button');
  button.type = 'button';
  button.dataset.course = e;
  button.innerText = e;
  if (e == 'すべて') {
    button.classList.add('selected');
  }
  button.addEventListener('click', button_click);
  div.appendChild(button);
});

const br = ME.create('br');
div.appendChild(br);

// 時間帯絞り込みボタンAM
button = ME.create('button');
button.type = 'button';
button.innerText = "前半";
button.id = 'plugin-time-am';
button.addEventListener('click', e => {
  e.target.classList.add('selected');
  ME.queryId('plugin-time-pm').classList.remove('selected');
  showOrHiddenSchedule('ampm', '前半');
});
div.appendChild(button);

// 時間帯絞り込みボタンPM
button = ME.create('button');
button.type = 'button';
button.innerText = "後半";
button.id = 'plugin-time-pm';
button.addEventListener('click', e => {
  e.target.classList.add('selected');
  ME.queryId('plugin-time-am').classList.remove('selected');
  showOrHiddenSchedule('ampm', '後半');
});
div.appendChild(button);

// シフトのテーブルの直前に追加
table.before(div);


// メンターの担当コースの入ったtd一覧
const TimeZones = ME.queryAll('#otherShift table tr td:nth-of-type(3)');

// 時間帯を見やすくする
TimeZones.forEach(e => {
  const times = e.innerText.split('〜');

  if (times[0] == '15:00' || times[1] == '19:00') {
    const AM = ME.create('span');
    AM.innerText = '前半';
    AM.classList.add('plugin-time-am');
    e.appendChild(AM);
  }
  if (times[0] == '19:00' || times[1] == '23:00') {
    const PM = ME.create('span');
    PM.innerText = '後半';
    PM.classList.add('plugin-time-pm');
    e.appendChild(PM);
  }
});
