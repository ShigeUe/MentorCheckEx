(()=>{"use strict";class e{#e=document.body;queryId(t){return e.queryId(t)}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(t,r){return e._query(null,t,r??!1)}query(t,r){return e._query(this.#e,t,r??!1)}static _query(e,t,r){const n=(e??document).querySelector(t);if(null===n){if(void 0===r||void 0!==r&&!r)throw new Error(`要素が取得できませんでした。Selector:${t}`);return null}return n}get_document(){return this.#e}set_document(e){return this.#e=e,this}}class t{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(e){return new t(e)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const r=this._element;if(void 0===t)return e in r?String(r[e]):"";e in r&&(r[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((r=>{const n=t[r],s=e;"object"==typeof n?this._setObjectProp(s[r],n):s[r]=n}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(e){return this._element.append(e instanceof t?e.get():e),this}insertFirst(e){return this._element.insertBefore(e instanceof t?e.get():e,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}const r=e.queryAll("#page-content-wrapper table tbody tr");let n=0;r.length&&r.forEach((e=>{const[t,r]=e.children[3].innerText.replace("分","").split("時間");n=n+Number(t)+Number(r)/60}));const s=t.create("tr").appendChild(t.create("td").text("合計時間")).appendChild(t.create("td")).appendChild(t.create("td")).appendChild(t.create("td").text(n+"時間"));e.query("#page-content-wrapper table tbody").appendChild(s.get())})();