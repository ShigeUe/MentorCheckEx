(()=>{"use strict";class e{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(t){return new e(t)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const r=this._element;if(void 0===t)return e in r?String(r[e]):"";e in r&&(r[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((r=>{const n=t[r],s=e;"object"==typeof n?this._setObjectProp(s[r],n):s[r]=n}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(t){return this._element.append(t instanceof e?t.get():t),this}insertFirst(t){return this._element.insertBefore(t instanceof e?t.get():t,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}class t{#e=document.body;queryId(e){return t.queryId(e)}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(e,r){return t._query(null,e,r??!1)}query(e,r){return t._query(this.#e,e,r??!1)}static _query(e,t,r){const n=(e??document).querySelector(t);if(null===n){if(void 0===r||void 0!==r&&!r)throw new Error(`要素が取得できませんでした。Selector:${t}`);return null}return n}get_document(){return this.#e}set_document(e){return this.#e=e,this}}const r=t.queryAll("#page-content-wrapper table tr:not(.cancelled):not(.myMentoring)"),n={};if(r.length){r.forEach((e=>{const[t]=e.children[3].innerText.split("\n");n[t]=(n[t]??0)+1})),n["合計"]=r.length;const s=e.create("tbody");Object.keys(n).forEach((t=>{const r=e.create("td").text(t),i=e.create("td").text(n[t]+"件"),d=e.create("tr").appendChild(r).appendChild(i);s.appendChild(d)}));const i=e.create("table").addClass(["table","table-striped"]).appendChild(s),d=e.create("div").addClass("dialog").appendChild(e.create("i").addClass("fa").addClass("fa-times-circle")).appendChild(i),a=e.create("div").prop("id","mentor-check-ex-dialog").appendChild(d);e.create(t.query("body")).appendChild(a);const c=e.create(t.query("#page-content-wrapper > div > div > div > div.row > .col-md-6")),l=e.create("a").addClass(["btn","btn-default","add-margin-left-5"]).prop("href",location.pathname+"?calendar=1").text("カレンダー表示");c.appendChild(l);const o=e.create("a").addClass(["btn","btn-default","add-margin-left-5"]).text("月間集計");o.addEventListener("click",(e=>{e.preventDefault(),a.style({display:"block"})})),c.appendChild(o),t.query("#mentor-check-ex-dialog i.fa-times-circle").addEventListener("click",(()=>{a.style({display:"none"})})),document.addEventListener("keydown",(e=>{"Escape"==e.code&&a.style({display:"none"})}))}})();