(()=>{"use strict";class e{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(t){return new e(t)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const r=this._element;if(void 0===t)return e in r?String(r[e]):"";e in r&&(r[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((r=>{const s=t[r],i=e;"object"==typeof s?this._setObjectProp(i[r],s):i[r]=s}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(t){return this._element.append(t instanceof e?t.get():t),this}insertFirst(t){return this._element.insertBefore(t instanceof e?t.get():t,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}class t{static DEFAULT={interval:30,chime:!1,notify:!1,smartIfSimple:!1,new_version:!1,username:"",password:"",volume:50,course_list:[],watchSlack:!1,darkmode:!1,diff:!0,diffFromGit:!1,curriculumSubMenu:!1,curriculums:[]};props=t.DEFAULT;constructor(){}async getSettings(){this.props=await chrome.storage.local.get(t.DEFAULT)}async setSettings(){await chrome.storage.local.set(this.props)}get interval(){return this.props.interval}get chime(){return this.props.chime}get notify(){return this.props.notify}get smartIfSimple(){return this.props.smartIfSimple}get new_version(){return this.props.new_version}get username(){return this.props.username}get password(){return this.props.password}get volume(){return this.props.volume}get course_list(){return this.props.course_list}get watchSlack(){return this.props.watchSlack}get darkmode(){return this.props.darkmode}get diff(){return this.props.diff}get diffFromGit(){return this.props.diffFromGit}get curriculumSubMenu(){return this.props.curriculumSubMenu}get curriculums(){return this.props.curriculums}set interval(e){this.props.interval=e}set chime(e){this.props.chime=e}set notify(e){this.props.notify=e}set smartIfSimple(e){this.props.smartIfSimple=e}set new_version(e){this.props.new_version=e}set username(e){this.props.username=e}set password(e){this.props.password=e}set volume(e){this.props.volume=e}set course_list(e){this.props.course_list=e}set watchSlack(e){this.props.watchSlack=e}set darkmode(e){this.props.darkmode=e}set diff(e){this.props.diff=e}set diffFromGit(e){this.props.diffFromGit=e}set curriculumSubMenu(e){this.props.curriculumSubMenu=e}set curriculums(e){this.props.curriculums=e}}class r{#e=document.body;queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(e,t){const r=document.querySelector(e);if(null===r){if(void 0===t||void 0!==t&&!t)throw new Error(`要素が取得できませんでした。Selector:${e}`);return null}return r}query(e,t){return void 0===t?r.query(e):r.query(e,t)}get_document(){return this.#e}set_document(e){return this.#e=e,this}}(new class{_curriculums=[];_curriculumSubMenu=!1;constructor(){}async getCurriculums(){const e=new t;await e.getSettings(),this._curriculums=e.curriculums,this._curriculumSubMenu=e.curriculumSubMenu,window.location.pathname.match(/\/mentor\/courses\/[^\/]+\/curriculums\/[^\/]+\/lessons$/)&&await this._getCurriculums()}async setStorage(){await chrome.storage.local.set({curriculums:this._curriculums})}async _getCurriculums(){const e=await fetch("https://techacademy.jp/mentor/curriculums",{method:"GET",redirect:"follow"}),t=await e.text(),r=document.implementation.createHTMLDocument("").documentElement;r.innerHTML=t;const s=r.querySelectorAll("#page-content-wrapper .nav li a"),i=[];s.forEach((e=>{const t="Array"==this._curriculums.constructor.name?this._curriculums.find((t=>t.name==e.innerText)):null,r=!(t&&"visible"in t&&!t.visible);i.push({name:e.innerText,url:e.href,visible:r})}),this),this._curriculums=i,this.setStorage()}async run(){await this.getCurriculums(),this._curriculumSubMenu&&this._curriculums.length>0?(this._insertHTML(),this._menuClick()):this._showHeader()}_showHeader(){r.queryAll(".breadcrumb + h2 + .nav li:not(.active)").forEach((e=>{e.style.display="block"}))}_insertHTML(){const t=e.create("div");t.prop("id","MentorCheckExCurriculums");const s=e.create("ul");t.appendChild(s),this._curriculums.forEach((t=>{if(!t.visible)return;const r=e.create("li"),i=e.create("a");i.prop("href",t.url),i.text(t.name),r.appendChild(i),s.appendChild(r)})),e.create(r.queryId("wrapper")).appendChild(t)}_menuClick(){const e=r.queryId("MentorCheckExCurriculums");r.queryAll('.sidebar-nav-mentor [href="/mentor/curriculums"]').forEach((t=>{t.addEventListener("click",(r=>{r.preventDefault(),r.stopPropagation(),e&&e.classList.toggle("open"),t.dispatchEvent(new Event("blur"))})),t.classList.contains("sidebar-icon")&&t.classList.add("add-right-arrow")})),e&&(e.addEventListener("click",(e=>{e.stopPropagation()})),document.body.addEventListener("click",(()=>{e.classList.contains("open")&&e.classList.remove("open")})))}}).run()})();