(()=>{"use strict";class e{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(t){return new e(t)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const s=this._element;if(void 0===t)return e in s?String(s[e]):"";e in s&&(s[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((s=>{const r=t[s],i=e;"object"==typeof r?this._setObjectProp(i[s],r):i[s]=r}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(t){return this._element.append(t instanceof e?t.get():t),this}insertFirst(t){return this._element.insertBefore(t instanceof e?t.get():t,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}class t{static DEFAULT={interval:30,chime:!1,notify:!1,smartIfSimple:!1,new_version:!1,username:"",password:"",volume:50,course_list:[],watchSlack:!1,darkmode:!1,diff:!0,diffFromGit:!1,curriculumSubMenu:!1,curriculums:[]};props=t.DEFAULT;constructor(){}async getSettings(){this.props=await chrome.storage.local.get(t.DEFAULT)}async setSettings(){await chrome.storage.local.set(this.props)}get interval(){return this.props.interval}get chime(){return this.props.chime}get notify(){return this.props.notify}get smartIfSimple(){return this.props.smartIfSimple}get new_version(){return this.props.new_version}get username(){return this.props.username}get password(){return this.props.password}get volume(){return this.props.volume}get course_list(){return this.props.course_list}get watchSlack(){return this.props.watchSlack}get darkmode(){return this.props.darkmode}get diff(){return this.props.diff}get diffFromGit(){return this.props.diffFromGit}get curriculumSubMenu(){return this.props.curriculumSubMenu}get curriculums(){return this.props.curriculums}set interval(e){this.props.interval=e}set chime(e){this.props.chime=e}set notify(e){this.props.notify=e}set smartIfSimple(e){this.props.smartIfSimple=e}set new_version(e){this.props.new_version=e}set username(e){this.props.username=e}set password(e){this.props.password=e}set volume(e){this.props.volume=e}set course_list(e){this.props.course_list=e}set watchSlack(e){this.props.watchSlack=e}set darkmode(e){this.props.darkmode=e}set diff(e){this.props.diff=e}set diffFromGit(e){this.props.diffFromGit=e}set curriculumSubMenu(e){this.props.curriculumSubMenu=e}set curriculums(e){this.props.curriculums=e}}class s{#e=document.body;queryId(e){return s.queryId(e)}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(e,t){return s._query(null,e,t??!1)}query(e,t){return s._query(this.#e,e,t??!1)}static _query(e,t,s){const r=(e??document).querySelector(t);if(null===r){if(void 0===s||void 0!==s&&!s)throw new Error(`要素が取得できませんでした。Selector:${t}`);return null}return r}get_document(){return this.#e}set_document(e){return this.#e=e,this}}(new class{cloud9_url="#";awsWindow=window;settings;constructor(){chrome.runtime.sendMessage({}),this.settings=new t}OpenNamedWindow(e){return window.open(e,"AWSOpenedFromMentorCheckEx")}getUsernameAndPassword(){const e=s.query('a[href*="signin.aws.amazon.com/console"] + div');if(e){const t=e.innerText.split("\n");this.settings.username=t[1].split(" ")[1],this.settings.password=t[2].split(" ")[1]}}async settingCloud9(){const t=s.query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]',!0);null!==t&&("username"in this.settings&&this.settings.username||(this.getUsernameAndPassword(),await this.settings.setSettings()),window.addEventListener("message",(e=>{(e.origin.indexOf("signin.aws.amazon.com")>0||e.origin.indexOf("console.aws.amazon.com")>0)&&("loaded"===e.data&&e.origin.indexOf("signin.aws.amazon.com")>0&&this.awsWindow.postMessage({username:this.settings.username,password:this.settings.password},e.origin),"loaded"===e.data&&e.origin.indexOf("console.aws.amazon.com")>0&&this.OpenNamedWindow(this.cloud9_url))})),s.queryAll('a[href*="aws.amazon.com/cloud9"]').forEach((s=>{const r=new e("button").text("自動でCloud9を開く").addClass("auto-open-the-cloud9").addEventListener("click",(e=>(this.cloud9_url=s.href,e.preventDefault(),this.awsWindow=this.OpenNamedWindow(t.href),!1)));s.after(r.get())}),this))}static notify(e,t){chrome.runtime.sendMessage({type:"notification",title:e,body:t})}}).settingCloud9()})();