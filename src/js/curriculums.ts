"use strict";

import { MCEElement }  from "./mceelement";
import { Settings, CurriculumType } from "./settings";
import { Util } from "./util";

class Curriculums
{
  private _curriculums: CurriculumType[] = [];
  private _curriculumSubMenu: boolean = false;

  constructor() {
  }

  async getCurriculums() {

    const settings: Settings = new Settings;
    await settings.getSettings();
    this._curriculums = settings.curriculums;
    this._curriculumSubMenu = settings.curriculumSubMenu;

    if (window.location.pathname.match(/\/mentor\/courses\/[^\/]+\/curriculums\/[^\/]+\/lessons$/)) {
      await this._getCurriculums();
    }
  }

  async setStorage() {
    await chrome.storage.local.set({ curriculums: this._curriculums });
  }

  private async _getCurriculums() {
    const res: Response = await fetch('https://techacademy.jp/mentor/curriculums', {
      method: 'GET',
      redirect: 'follow'
    });
    const text: string = await res.text();
    const doc: HTMLElement = document.implementation.createHTMLDocument("").documentElement;
    doc.innerHTML = text;

    const aTags = doc.querySelectorAll<HTMLAnchorElement>('#page-content-wrapper .nav li a');
    const curriculums:CurriculumType[] = [];
    aTags.forEach((el) => {
      const setting = this._curriculums.constructor.name == 'Array' ? this._curriculums.find(e => e.name == el.innerText) : null;
      const visible = !!(!setting || !('visible' in setting) || setting.visible);
      curriculums.push({
        name: el.innerText,
        url: el.href,
        visible
      })
    }, this);
    this._curriculums = curriculums;
    this.setStorage();
  }

  async run() {
    await this.getCurriculums();
    if (this._curriculumSubMenu && this._curriculums.length > 0) {
      this._insertHTML();
      this._menuClick();
    }
    else {
      this._showHeader();
    }
  }

  private _showHeader() {
    Util.queryAll<HTMLLIElement>('.breadcrumb + h2 + .nav li:not(.active)').forEach((ele) => {
      ele.style.display = 'block';
    });
  }

  private _insertHTML() {
    const div = MCEElement.create('div');
    div.prop('id', 'MentorCheckExCurriculums');
    const ul = MCEElement.create('ul');
    div.appendChild(ul);

    // カリキュラム名でソート
    this._curriculums.sort((a: CurriculumType, b: CurriculumType) => {
      if (a.name == b.name) return 0;
      return (a.name < b.name) ? -1 : 1;
    });

    this._curriculums.forEach((el) => {
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

    const wrapper = MCEElement.create(Util.queryId('wrapper'));
    wrapper.appendChild(div)
}

  private _menuClick() {
    const target = Util.queryId('MentorCheckExCurriculums');
    Util.queryAll<HTMLAnchorElement>('.sidebar-nav-mentor [href="/mentor/curriculums"]').forEach((el) => {
      el.addEventListener('click', (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (target) {
          target.classList.toggle('open');
        }
        el.dispatchEvent(new Event('blur'));
      });
      if (el.classList.contains('sidebar-icon')) {
        el.classList.add('add-right-arrow');
      }
    });
    if (target) {
      target.addEventListener('click', (ev: MouseEvent) => {
        ev.stopPropagation();
      });
      document.body.addEventListener('click', () => {
        if (target.classList.contains('open')) {
          target.classList.remove('open');
        }
      });
    }
  }
}

(() => {
  const cur = new Curriculums;
  cur.run();
})();
