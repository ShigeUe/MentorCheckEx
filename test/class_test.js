"use strict";

/*
--------------------------------------------------------------------------
MentorCheckEx test
--------------------------------------------------------------------------
*/

debug.log('--------- MentorCheckEx test');

debug.info('★MentorCheckExのインスタンスが生成されると、sendMessageされる');
MentorCheckEx._chrome = _chrome;
MentorCheckEx._window = _window;
const ME = new MentorCheckEx();

result = ME.queryId('testElement');
if (result.tagName === 'DIV') {
  debug.log('MentorCheckEx.queryId ... OK');
}
else {
  debug.err('MentorCheckEx.queryId ... NG');
}

result = ME.query('#testElement div:nth-of-type(4)');
if (result.tagName === 'DIV' && result.classList[0] === 'testCol4') {
  debug.log('MentorCheckEx.query ... OK');
}
else {
  debug.err('MentorCheckEx.query ... NG');
}

result = ME.queryAll('#testElement .testRow > div');
if (result.constructor.name === 'NodeList' && result.length === 5) {
  debug.log('MentorCheckEx.queryAll ... OK');
}
else {
  debug.err('MentorCheckEx.queryAll ... NG');
}

element = ME.create('div');
element.innerText = 'TEST';
result = ME.query('#testElement .testRow div:nth-of-type(5)');
result.appendChild(element);

result = ME.query('#testElement .testRow div:nth-of-type(5) > div');

if (result.innerText === 'TEST') {
  debug.log('MentorCheckEx.create ... OK');
  debug.log('MentorCheckEx.appendChild ... OK');
}
else {
  debug.err('MentorCheckEx.create or MentorCheckEx.appendChild ... NG');
}

debug.info('★setting_cloud9が呼ばれると、設定が書き込まれる', true);
ME.setting_cloud9();
const buttons = ME.queryAll('.auto-open-the-cloud9');
if (buttons.length === 2) {
  debug.log('MentorCheckEx.setting_cloud9のボタン設置 ... OK');
}
else {
  debug.err('MentorCheckEx.setting_cloud9のボタン設置 ... NG');
}

if (ME.settings.username === 'test_user_name' && ME.settings.password === 'PaSsWoRd') {
  debug.log('MentorCheckEx.getUsernameAndPassword ... OK');
}
else {
  debug.err('MentorCheckEx.getUsernameAndPassword ... NG');
}

debug.info('★Service Workerに通知を要求のテスト', true);
MentorCheckEx.notify('テスト', 'テスト本文', _chrome);

let test_event = new Event('message');

debug.info('★自動でCloud9を開くボタンがクリックされたときのテスト', true);
debug.info('1.ボタンが押されたのでサインインのウィンドウを開く');
buttons[0].dispatchEvent(new Event('click'));
debug.info('2.サインイン画面が開いたので、ユーザー名とパスワードのメッセージ送信');
test_event.origin = 'https://signin.aws.amazon.com';
test_event.data = 'loaded';
window.dispatchEvent(test_event);
debug.info('3.サインインが完了し、コンソールが開いたので、Cloud9を開く');
test_event.origin = 'https://console.aws.amazon.com';
test_event.data = 'loaded';
window.dispatchEvent(test_event);



/*
--------------------------------------------------------------------------
MCEElement test
--------------------------------------------------------------------------
*/
debug.log('');
debug.log('--------- MCEElement test');

const EL = new MCEElement('div');
if (EL.get().tagName === 'DIV') {
  debug.log('MCEElement.constructor(タグ) ... OK');
  debug.log('MCEElement.get ... OK');
}
else {
  debug.err('MCEElement.constructor(タグ) or MCEElement.get ... NG');
}

result = ME.query('#testElement .testRow div:nth-of-type(4)');
const EL2 = new MCEElement(result);
if (EL2.get().tagName === 'DIV' && EL2.text() === 'abcde') {
  debug.log('MCEElement.constructor(要素) ... OK');
  debug.log('MCEElement.text ... OK');
}
else {
  debug.err('MCEElement.constructor(要素) or MCEElement.text ... NG');
}

debug.info('下記の操作を行う前の要素のHTML', true);
const EL3 = MCEElement.create(result);
debug.text(EL3.get().outerHTML);
debug.log('');

if (EL3.get().tagName === 'DIV' && EL3.text() === 'abcde') {
  debug.log('MCEElement.create ... OK');
}
else {
  debug.err('MCEElement.create ... NG');
}

EL3.addClass('addClassTest');
if (result.classList.contains('addClassTest')) {
  debug.log('MCEElement.addClass ... OK');
}
else {
  debug.err('MCEElement.addClass ... NG');
}

EL3.removeClass('testCol4');
if (!result.classList.contains('testCol4')) {
  debug.log('MCEElement.removeClass ... OK');
}
else {
  debug.err('MCEElement.removeClass ... NG');
}

EL3.addEventListener('click', (e) => {
  e.target.style.color = 'red';
});
EL3.get().dispatchEvent(new Event('click'));
if (result.style.color === 'red') {
  debug.log('MCEElement.addEventListener ... OK');
}
else {
  debug.err('MCEElement.addEventListener ... NG');
}

EL3.prop('style', '');
if (result.style.color === '') {
  debug.log('MCEElement.prop(property, value) ... OK');
}
else {
  debug.err('MCEElement.prop(property, value) ... NG');
}

EL3.prop({
  dataset: {
    part1: '123',
    part2: '456'
  }
});
if (result.dataset.part1 === '123' && result.dataset.part2 === '456') {
  debug.log('MCEElement.prop(object) ... OK');
}
else {
  debug.err('MCEElement.prop(object) ... NG');
}

const dataset = EL3.prop('dataset');
if (dataset.part1 === '123' && dataset.part2 === '456') {
  debug.log('MCEElement.propの取得 ... OK');
}
else {
  debug.err('MCEElement.propの取得 ... NG');
}

EL3.text('xxxx');
if (result.innerText === 'xxxx') {
  debug.log('MCEElement.text(string) ... OK');
}
else {
  debug.err('MCEElement.text(string) ... NG');
}

EL3.style({ color: 'blue', fontWeight: 'bold' });
if (result.style.color === 'blue' && result.style.fontWeight === 'bold') {
  debug.log('MCEElement.style(object) ... OK');
}
else {
  debug.err('MCEElement.style(object) ... NG');
}

EL3.insertFirst(MCEElement.create('span').text('最初に挿入される'));
if (result.innerText === '最初に挿入されるxxxx') {
  debug.log('MCEElement.insertFirst ... OK');
}
else {
  debug.err('MCEElement.insertFirst ... NG');
}

debug.info('上記の操作で出来上がった要素のHTML', true);
debug.text(EL3.get().outerHTML);