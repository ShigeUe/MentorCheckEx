"use strict";

(() => {
  /* ----------------------------------------------------------------------- */
  /* Utility functions
  -------------------------------------------------------------------------- */

  const query = s => document.querySelector(s);
  const queryAll = s => document.querySelectorAll(s);
  const createElement = p => document.createElement(p);

  /* ----------------------------------------------------------------------- */
  /* 実行部分
  -------------------------------------------------------------------------- */

  // メンターの担当コースの入ったtd一覧
  const TDs = queryAll('#otherShift table tr td:nth-of-type(4)');
  // コース文字列を取得
  const tmp_courses = {};
  TDs.forEach((e) => {
    const course_array = e.innerText.split(', ');
    course_array.forEach((course) => {
      tmp_courses[course] = 1;
    });
  });
  const courses = Object.keys(tmp_courses);
  // すべてを最後に追加
  courses.push('すべて');



  // ボタンが押されたときの動作
  const button_click = e => {
    e.preventDefault();
    // 選択ボタンのスタイルを削除
    const b = query('#plugin-button-area button.selected');
    if (b) {
      b.classList.remove('selected');
    }
    // クリックしたボタンを選択
    e.target.classList.add('selected');
    // 行を表示・非表示を操作する
    TDs.forEach(ele => {
      const course = e.target.dataset.course;
      ele.parentElement.style.display = '';
      if (ele.innerText.indexOf(course) < 0 && course != 'すべて') {
        ele.parentElement.style.display = 'none';
      }
    });
    return false;
  };

  // ボタンを挿入する目標
  const table = query('#otherShift table');
  // ボタンを包むdiv
  const div = createElement('div');
  div.id = 'plugin-button-area';

  // すべてのコースのボタンの生成
  let button;
  courses.forEach(e => {
    button = createElement('button');
    button.dataset.course = e;
    button.innerText = e;
    if (e == 'すべて') {
      button.classList.add('selected');
    }
    button.addEventListener('click', button_click);
    div.append(button);
  });
  // シフトのテーブルの直前に追加
  table.before(div);

  // メンターの担当コースの入ったtd一覧
  const TimeZones = queryAll('#otherShift table tr td:nth-of-type(3)');

  // 時間帯を見やすくする
  TimeZones.forEach(e => {
    const times = e.innerText.split('〜');
    console.log(times);
    const AM = createElement('span');
    AM.innerText = 'AM';
    AM.classList.add('plugin-time-am');
    const PM = createElement('span');
    PM.innerText = 'PM';
    PM.classList.add('plugin-time-pm');
    if (times[0] == '15:00' || times[1] == '19:00') {
      e.append(AM);
    }
    else if (times[0] == '19:00' || times[1] == '23:00') {
      e.append(PM);
    }
  });
})();