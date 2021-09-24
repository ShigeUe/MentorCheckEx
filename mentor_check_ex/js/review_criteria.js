"use strict";

class ReviewCriteria
{
  // 依存性注入用
  static _chrome = chrome;
  #chrome = null;

  #course_list = [];

  constructor() {
    this.#chrome = ReviewCriteria._chrome;
  }

  async getCourseList() {
    const settings = await (new Promise((resolve) => {
      this.#chrome.storage.local.get({course_list: []}, resolve);
    }));
    this.#course_list = settings.course_list;
  }

  async run() {
    await this.getCourseList();
    const lis = document.querySelectorAll('#page-content-wrapper .container-fluid .row > div .nav li a');
    lis.forEach((el) => {
      const s = this.#course_list.find((e) => el.innerText == e.name);
      if (s) {
        el.parentElement.style.display = (!('visible' in s) || s.visible) ? 'block' : 'none';
      }
    }, this);
    document.getElementById('page-content-wrapper').style.opacity = 1;
  }
}
(new ReviewCriteria).run();
