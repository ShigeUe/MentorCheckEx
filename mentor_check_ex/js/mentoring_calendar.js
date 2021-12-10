'use strict';

// MentorCheckExクラスのインスタンス
const ME = new MentorCheckEx();

// ボタンを追加する要素
const col = MCEElement.create(
  ME.query('#page-content-wrapper > div > div > div > div.row > .col-md-6')
);

// 確定メンタリング一覧ボタン追加
const mentoringList = MCEElement
  .create('a')
  .addClass(['btn', 'btn-default', 'add-margin-left-5'])
  .prop('href', location.pathname)
  .text('確定メンタリング一覧');
col.appendChild(mentoringList);

// 月のナビゲーションボタンのリンク先を改変
ME.query('#page-content-wrapper h2').nextSibling.querySelectorAll('.pull-right a').forEach((el) => {
  el.href = el.href + '?calendar=1';
});

// 年をパスから取得
const [, , , , year,month] = location.pathname.split('/');

// データの準備
const data = [];
ME.queryAll('#page-content-wrapper table tr:not(.myMentoring)').forEach((el) => {
  const tds = el.querySelectorAll('td');
  // メンタリングの日付、開始時間を取得
  const [, date, , startTime] = tds[0].innerText.split(/[\s\)\/~]/);
  // ステータスのクラスを取得する
  tds[1].childNodes[0].classList.remove('label');
  const status = tds[1].childNodes[0].classList.toString();
  // 受講生名
  const name = tds[2].innerText;
  // コース
  const course = tds[3].innerText.split('\n')[0];
  data.push({date,startTime,status,name,course})
});
console.log(data);

// カレンダーを配置する要素
const stage = MCEElement.create('div');
stage.prop('id', 'MENTOR_CHECK_EX_CALENDAR');

const lastDay  = new Date(year, month, 0);
const lastDate = lastDay.getDate(); // 末日が返る
const firstDay = new Date(year, month - 1, 1).getDay(); // 1日の曜日


// 曜日を配置
const weekday = ['日', '月', '火', '水', '木', '金', '土'];
for (let i = 0; i < 7; i++) {
  const div = MCEElement.create('div').addClass('yobi').text(weekday[i]);
  stage.appendChild(div);
}
// 1日まで空枠を配置する
for (let i = 0; i < firstDay; i++) {
  const div = MCEElement.create('div').addClass('kara');
  stage.appendChild(div);
}
for (let i = 1; i <= lastDate; i++) {
  const div = MCEElement.create('div');
  // 日付
  const day = MCEElement.create('div').addClass('date').text(i);
  div.appendChild(day);
  // メンタリングスケジュールを書き込み
  const dd = data.filter((d) => d.date == i);
  dd.forEach((d) => {
    const sch = MCEElement.create('div').addClass(['waku', d.status]);
    sch.prop('title', d.course).text(d.startTime + " " + d.name);
    div.appendChild(sch);
  });
  stage.appendChild(div);
}
// 土曜日まで空枠を配置する
for (let i = lastDay.getDay() + 1; i < 7; i++) {
  const div = MCEElement.create('div').addClass('kara');
  stage.appendChild(div);
}

MCEElement.create(ME.query('#page-content-wrapper table').parentElement).appendChild(stage);
