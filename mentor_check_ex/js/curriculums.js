"use strict";

class Curriculums
{
  // 依存性注入用
  static _chrome = chrome;
  static _window = window;
  #chrome = null;
  #window = null;

  #curriculums = [];
  #curriculumSubMenu = false;

  constructor() {
    this.#chrome = Curriculums._chrome;
    this.#window = Curriculums._window;
  }

  async getCurriculums() {
    const settings = await (new Promise((resolve) => {
      this.#chrome.storage.local.get({curriculumSubMenu: false, curriculums: []}, resolve);
    }));
    this.#curriculums = settings.curriculums;
    this.#curriculumSubMenu = settings.curriculumSubMenu;

    if (window.location.pathname.match(/\/mentor\/courses\/[^\/]+\/curriculums\/[^\/]+\/lessons$/)) {
      await this.#getCurriculums();
    }
  }

  async setStorage() {
    await (new Promise((resolve) => {
      this.#chrome.storage.local.set({ curriculums: this.#curriculums }, resolve);
    }));
  }

  async #getCurriculums() {
    const res = await fetch('https://techacademy.jp/mentor/curriculums', {
      method: 'GET',
      redirect: 'follow'
    });
    const text = await res.text();
    const doc = document.implementation.createHTMLDocument("").documentElement;
    doc.innerHTML = text;

    const aTags = doc.querySelectorAll('#page-content-wrapper .nav li a');
    const curriculums = [];
    aTags.forEach((el) => {
      const setting = this.#curriculums.constructor.name == 'Array' ? this.#curriculums.find(e => e.name == el.innerText) : null;
      const visible = !!(!setting || !('visible' in setting) || setting.visible);
      curriculums.push({
        name: el.innerText,
        url: el.href,
        visible
      })
    }, this);
    this.#curriculums = curriculums;
    this.setStorage();
  }

  async run() {
    await this.getCurriculums();
    if (this.#curriculumSubMenu && this.#curriculums.length > 0) {
      this.#insertHTML();
      this.#menuClick();
    }
    else {
      this.#showHeader();
    }
  }

  #showHeader() {
    document.querySelectorAll('.breadcrumb + h2 + .nav li:not(.active)').forEach((ele) => {
      ele.style.display = 'block';
    });
  }

  #insertHTML() {
    const div = MCEElement.create('div');
    div.prop('id', 'MentorCheckExCurriculums');
    const ul = MCEElement.create('ul');
    div.appendChild(ul);

    this.#curriculums.forEach((el) => {
      if (!el.visible) {
        return;
      }
      const li = MCEElement.create('li');
      const atag = MCEElement.create('a');
      atag.prop('href', el.url);
      atag.text(el.name);
      li.appendChild(atag);
      ul.appendChild(li);
    });

    const wrapper = MCEElement.create(document.getElementById('wrapper'));
    wrapper.appendChild(div)
}

  #menuClick() {
    const target = document.getElementById('MentorCheckExCurriculums');
    document.querySelectorAll('.sidebar-nav-mentor [href="/mentor/curriculums"]').forEach((el) => {
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        target.classList.toggle('open');
        el.dispatchEvent(new Event('blur'));
      });
    });
    target.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    document.body.addEventListener('click', () => {
      if (target.classList.contains('open')) {
        target.classList.remove('open');
      }
    });
  }
}

const cur = new Curriculums;
cur.run();  
