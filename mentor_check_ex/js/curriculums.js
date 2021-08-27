"use strict";

class Curriculums
{
  // 依存性注入用
  static _chrome = chrome;
  static _window = window;
  #chrome = null;
  #window = null;

  #curriculums = {
    time: 0,
    curriculums: [],
  }
  
  #menuOpened = false;

  constructor() {
    this.#chrome = Curriculums._chrome;
    this.#window = Curriculums._window;
  }

  async getStorage() {
    const settings = await (new Promise((resolve) => {
      this.#chrome.storage.local.get(null, resolve);
    }));

    if (!settings.curriculumSubMenu) {
      return false;
    }

    if (!settings.curriculums || settings.curriculums.time < Date.now() - 24 * 60 * 60 * 1000) {
      await this.#getCurriculums();
    }
    else {
      this.#curriculums = settings.curriculums;
    }
    return true;
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
    aTags.forEach((el) => curriculums.push({ name: el.innerText, url: el.href }));
    this.#curriculums = {
      time: Date.now(),
      curriculums: curriculums,
    };
    this.setStorage();
  }

  async run() {
    if (await this.getStorage()) {
      this.#insertHTML();
      this.#menuClick();
    }
  }

  #insertHTML() {
    const div = MCEElement.create('div');
    div.prop('id', 'MentorCheckExCurriculums');
    const ul = MCEElement.create('ul');
    div.appendChild(ul);

    this.#curriculums.curriculums.forEach((el) => {
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

  #injectScript() {
    const script = MCEElement.create('script');
  }
}

const cur = new Curriculums;
cur.run();  
