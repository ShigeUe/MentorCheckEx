(()=>{"use strict";class e{#e=document.body;queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(e,t){const r=document.querySelector(e);if(null===r){if(void 0===t||void 0!==t&&!t)throw new Error(`要素が取得できませんでした。Selector:${e}`);return null}return r}query(t,r){return void 0===r?e.query(t):e.query(t,r)}get_document(){return this.#e}set_document(e){return this.#e=e,this}}class t{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(e){return new t(e)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const r=this._element;if(void 0===t)return e in r?String(r[e]):"";e in r&&(r[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((r=>{const n=t[r],s=e;"object"==typeof n?this._setObjectProp(s[r],n):s[r]=n}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(e){return this._element.append(e instanceof t?e.get():e),this}insertFirst(e){return this._element.insertBefore(e instanceof t?e.get():e,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}const r=t.create(e.query("#page-content-wrapper > div > div > div > div.row > .col-md-6")),n=t.create("a").addClass(["btn","btn-default","add-margin-left-5"]).prop("href",location.pathname).text("確定メンタリング一覧");r.appendChild(n),e.query("#page-content-wrapper h2").nextSibling.querySelectorAll(".pull-right a").forEach((e=>{e.href=e.href+"?calendar=1"}));const[,,,,s,i]=location.pathname.split("/"),a=[];e.queryAll("#page-content-wrapper table tr:not(.myMentoring)").forEach((e=>{const t=e.querySelectorAll("td"),[,r,,n]=t[0].innerText.split(/[\s\)\/~]/);t[1].childNodes[0].classList.remove("label");const s=t[1].childNodes[0].classList.toString(),i=t[2].innerText,o=t[3].innerText.split("\n")[0];a.push({date:r,startTime:n,status:s,name:i,course:o})})),console.log(a);const o=t.create("div");o.prop("id","MENTOR_CHECK_EX_CALENDAR");const l=new Date(Number(s),Number(i),0),c=l.getDate(),d=new Date(Number(s),Number(i)-1,1).getDay(),u=["日","月","火","水","木","金","土"];for(let e=0;e<7;e++){const r=t.create("div").addClass("yobi").text(u[e]);o.appendChild(r)}for(let e=0;e<d;e++){const e=t.create("div").addClass("kara");o.appendChild(e)}for(let e=1;e<=c;e++){const r=t.create("div"),n=t.create("div").addClass("date").text(String(e));r.appendChild(n),a.filter((t=>t.date==String(e))).forEach((e=>{const n=t.create("div").addClass(["waku",e.status]);n.prop("title",e.course).text(e.startTime+" "+e.name),r.appendChild(n)})),o.appendChild(r)}for(let e=l.getDay()+1;e<7;e++){const e=t.create("div").addClass("kara");o.appendChild(e)}t.create(e.query("#page-content-wrapper table").parentElement).appendChild(o)})();