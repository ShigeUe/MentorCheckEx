"use strict";

class PopupClass
{
  // プロパティ
  #MCE;
  #MCEE;
  #chrome;
  #list;
  #mess;
  tab;
  course_list = [];

  constructor(args = {}) {
    this.#MCE = args.MentorCheckEx ?? new MentorCheckEx;
    this.#MCEE = args.MCEElement ?? MCEElement;
    this.#chrome = args.chrome ?? chrome;

    this.#list = this.#MCEE.create(this.#MCE.queryId('courseList'));
    this.#mess = this.#MCEE.create(this.#MCE.queryId('notAvailable'));
  }
  // 同期的にコースリストと現在のタブを取得する
  async init() {
    let tab = false;
    let cl = false;
    cl = await this.getCourseList();
    [tab] = await this.getCurrentTab();

    this.tab = tab;
    this.course_list = cl.course_list;
  }

  // コースリストをストレージから取得する
  getCourseList() {
    return new Promise((resolve, reject) => {
      this.#chrome.storage.local.get({ course_list: {} }, resolve);
    });
  };
  // 現在のタブを取得する  
  getCurrentTab() {
    return new Promise((resolve, reject) => {
      this.#chrome.tabs.query({ active: true }, resolve);
    });
  };
  // 絞り込み可能のURLか
  #isValidLocation(url) {
    return (
      url.indexOf('https://techacademy.jp/mentor/all/reports') === 0 &&
      !url.match(/reviewing|reviewed/)
    );
  }
  // 現在表示しているURLから表示しているコースを取得
  #makeDisplaiedCoursesFromSearch(search) {
    search = search.substr(1);
    const courses = [];
    if (search) {
      search.split('&').forEach(el => {
        let course;
        [, course] = el.split('=');
        courses.push(course);
      });
    }
    return courses;
  }
  // 表示しているコースに基づいて、ポップアップのリストを描画
  #writePopupList(displaied_courses) {
    const target = this.#MCEE.create(this.#MCE.query('#courseList ul'));

    this.course_list.forEach((node) => {
      const li    = this.#MCEE.create('li');
      const label = this.#MCEE.create('label').text(node.name);
      const input = this.#MCEE.create('input').prop({ type: 'checkbox', id: node.id });
      if (displaied_courses.indexOf(node.id) >= 0) {
        input.prop({ checked: 'checked' });
      }
      target.appendChild(li.appendChild(label.insertFirst(input)));
    });
  }
  // チェックボックスからURLのsearchパラメータに変換
  #makeCheckboxToSearch() {
    const checked = this.#MCE.queryAll('input[type="checkbox"]:checked');
    let search = '';
    // 一つ以上チェックされていたら、[]を付ける
    checked.forEach(el => {
      search += '&course' + (checked.length > 1 ? '[]' : '') + '=' + el.id;
    });
    return search.substr(1);
  }




  // HTMLを表示する（メイン）
  async main() {
    // 絞り込み対象ページがチェック
    if (this.#isValidLocation(this.tab.url) && this.course_list.length > 0) {
      this.#list.style({ display: 'block' });
      this.#mess.style({ display: 'none' });
    }
    else {
      // 対象外なら、メッセージを表示して終了
      this.#list.style({ display: 'none' });
      this.#mess.style({ display: 'block' });
      return;
    }

    // タブのURLからAタグエレメントに変換（パスの分解などのため）
    const a_tag = this.#MCEE.create('a').prop({ href: this.tab.url }).get();
    // 現在表示しているURLから表示しているコースを取得
    const displaied_courses = this.#makeDisplaiedCoursesFromSearch(a_tag.search);
    // 表示しているコースに基づいて、ポップアップのリストを描画
    this.#writePopupList(displaied_courses);
    // 「絞り込み」ボタンが押された
    this.#MCE.queryId('doAction').addEventListener('click', e => {
      const search = this.#makeCheckboxToSearch();
      const url = a_tag.protocol + a_tag.host + a_tag.pathname + (search ? '?' + search : '');
      this.#chrome.tabs.update(this.tab.id, { url: url });
      // ポップアップを閉じる
      window.close();
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const POPUP = new PopupClass;
  await POPUP.init();
  await POPUP.main();  
});
