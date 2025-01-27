(()=>{"use strict";class e{_element;constructor(e){this._element="string"==typeof e?document.createElement(e):"object"==typeof e?e:document.createElement("s")}static create(t){return new e(t)}addClass(e){return"string"==typeof e&&""!==e?this._element.classList.add(e):e&&"Array"===e.constructor.name&&e.forEach((e=>this.addClass(e)),this),this}removeClass(e){return this._element.classList.remove(e),this}addEventListener(e,t){return this._element.addEventListener(e,t),this}prop(e,t){if("object"==typeof e)this._setObjectProp(this._element,e);else{const r=this._element;if(void 0===t)return e in r?String(r[e]):"";e in r&&(r[e]=t)}return this}_setObjectProp(e,t){Object.keys(t).forEach((r=>{const s=t[r],n=e;"object"==typeof s?this._setObjectProp(n[r],s):n[r]=s}),this)}get(){return this._element}set(e){return this.constructor(e),this}appendChild(t){return this._element.append(t instanceof e?t.get():t),this}insertFirst(t){return this._element.insertBefore(t instanceof e?t.get():t,this._element.firstChild),this}text(e){return void 0===e?this._element.innerText:(this._element.innerText=e,this)}style(e){return Object.keys(e).forEach((t=>{this._element.style.setProperty(t,e[t])}),this),this}}class t{static DEFAULT={interval:30,chime:!1,notify:!1,smartIfSimple:!1,new_version:!1,username:"",password:"",volume:50,course_list:[],watchSlack:!1,darkmode:!1,diff:!0,diffFromGit:!1,curriculumSubMenu:!1,curriculums:[]};props=t.DEFAULT;constructor(){}async getSettings(){this.props=await chrome.storage.local.get(t.DEFAULT)}async setSettings(){await chrome.storage.local.set(this.props)}get interval(){return this.props.interval}get chime(){return this.props.chime}get notify(){return this.props.notify}get smartIfSimple(){return this.props.smartIfSimple}get new_version(){return this.props.new_version}get username(){return this.props.username}get password(){return this.props.password}get volume(){return this.props.volume}get course_list(){return this.props.course_list}get watchSlack(){return this.props.watchSlack}get darkmode(){return this.props.darkmode}get diff(){return this.props.diff}get diffFromGit(){return this.props.diffFromGit}get curriculumSubMenu(){return this.props.curriculumSubMenu}get curriculums(){return this.props.curriculums}set interval(e){this.props.interval=e}set chime(e){this.props.chime=e}set notify(e){this.props.notify=e}set smartIfSimple(e){this.props.smartIfSimple=e}set new_version(e){this.props.new_version=e}set username(e){this.props.username=e}set password(e){this.props.password=e}set volume(e){this.props.volume=e}set course_list(e){this.props.course_list=e}set watchSlack(e){this.props.watchSlack=e}set darkmode(e){this.props.darkmode=e}set diff(e){this.props.diff=e}set diffFromGit(e){this.props.diffFromGit=e}set curriculumSubMenu(e){this.props.curriculumSubMenu=e}set curriculums(e){this.props.curriculums=e}}class r{#e=document.body;queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryId(e){const t=document.getElementById(e);if(null===t)throw new Error(`要素が取得できませんでした。ID:${e}`);return t}static queryAll(e){return document.querySelectorAll(e)}queryAll(e){return this.#e.querySelectorAll(e)}static query(e,t){const r=document.querySelector(e);if(null===r){if(void 0===t||void 0!==t&&!t)throw new Error(`要素が取得できませんでした。Selector:${e}`);return null}return r}query(e,t){return void 0===t?r.query(e):r.query(e,t)}get_document(){return this.#e}set_document(e){return this.#e=e,this}}class s{cloud9_url="#";awsWindow=window;settings;constructor(){chrome.runtime.sendMessage({}),this.settings=new t}OpenNamedWindow(e){return window.open(e,"AWSOpenedFromMentorCheckEx")}getUsernameAndPassword(){const e=r.query('a[href*="signin.aws.amazon.com/console"] + div');if(e){const t=e.innerText.split("\n");this.settings.username=t[1].split(" ")[1],this.settings.password=t[2].split(" ")[1]}}async settingCloud9(){const t=r.query('#page-content-wrapper a[href*="signin.aws.amazon.com/console"]',!0);null!==t&&("username"in this.settings&&this.settings.username||(this.getUsernameAndPassword(),await this.settings.setSettings()),window.addEventListener("message",(e=>{(e.origin.indexOf("signin.aws.amazon.com")>0||e.origin.indexOf("console.aws.amazon.com")>0)&&("loaded"===e.data&&e.origin.indexOf("signin.aws.amazon.com")>0&&this.awsWindow.postMessage({username:this.settings.username,password:this.settings.password},e.origin),"loaded"===e.data&&e.origin.indexOf("console.aws.amazon.com")>0&&this.OpenNamedWindow(this.cloud9_url))})),r.queryAll('a[href*="aws.amazon.com/cloud9"]').forEach((r=>{const s=new e("button").text("自動でCloud9を開く").addClass("auto-open-the-cloud9").addEventListener("click",(e=>(this.cloud9_url=r.href,e.preventDefault(),this.awsWindow=this.OpenNamedWindow(t.href),!1)));r.after(s.get())}),this))}static notify(e,t){chrome.runtime.sendMessage({type:"notification",title:e,body:t})}}const n=new r,i=new t;let o=30,a=!1,c=!1,d=!1,l=!1;const p=chrome,u=new Audio(p.runtime.getURL("resources/chime.mp3"));u.volume=.5;let h=0,m="9999/99/99 99:99:99";const g=document.title,f=()=>e.create("li").addClass("sidemenu-li").addClass("mentorChangeEx"),w=(t,r)=>f().appendChild(e.create("div").addClass("pluginSwitchArea").appendChild(e.create("input").prop({id:"pluginSwitchButton"+t,type:"checkbox"})).appendChild(e.create("label").prop({htmlFor:"pluginSwitchButton"+t}).appendChild(e.create("span"))).appendChild(e.create("div").addClass("swImg"))).appendChild(e.create("span").prop({style:{color:"white"}}).text(r)),y=()=>{const e=new Date;return("0"+e.getHours()).slice(-2)+":"+("0"+e.getMinutes()).slice(-2)+":"+("0"+e.getSeconds()).slice(-2)},v=t=>{const s=r.queryAll(".container-fluid .row .col-lg-12 table tr td:first-of-type a");e.create(r.query("ol.breadcrumb")).style({display:t?"none":""}),e.create(r.query("ul.nav-tabs")).style({display:t?"none":""}),e.create(r.query("#page-content-wrapper h2")).style({padding:t?"0":""}),s.forEach((r=>{const s=e.create(r),n=s.prop("href");if(s.prop("target","_blank"),t&&d)s.prop({dataset:{method:"post"},href:n+"/start_review"}).text("開始");else if(n.indexOf("/start_review")>0){const e=n.replace("/start_review","");s.prop({dataset:{method:""},href:e}).text("詳細")}})),[4,6,7,9].forEach((e=>{r.queryAll("table tr th:nth-of-type("+e+"),table tr td:nth-of-type("+e+")").forEach((e=>{e.style.display=t?"none":""}))}))},C=()=>{const e=r.query(".navbar.navbar-fixed-top").style;return e.backgroundColor=e.backgroundColor?"":"#cb3333",e.borderColor=e.borderColor?"":"#cb3333",new Promise((e=>{setTimeout((()=>{e("timeout")}),500)}))},b=async()=>{r.queryId("pluginSwitchButton1").checked&&fetch(location.href,{method:"GET",mode:"same-origin",credentials:"include"}).then((e=>{if(!e.ok)throw new Error("HTTP error! status: "+e.status);return e.text()})).then((e=>{const t=document.implementation.createHTMLDocument("").documentElement;t.innerHTML=e;const i="#page-content-wrapper",o=n.set_document(t).query(i);r.query(i).outerHTML=o.outerHTML;let a="";n.queryAll("#page-content-wrapper table tr td:nth-of-type(8)").forEach((e=>{a=a<e.innerText?e.innerText:a})),v(r.queryId("pluginSwitchButton2").checked),!m&&a||m&&a&&m<a?(r.queryId("pluginSwitchButton4").checked&&u.play(),r.queryId("pluginSwitchButton5").checked&&(s.notify("課題レビュー","更新があります。"),document.title="!!変更あり!! "+g,(async()=>{for(let e=0;e<6;e++)await C()})()),console.info("A change has been detected. "+y())):document.title="監視中... "+g,m=a,r.queryId("pluginSwitchMessage").innerText="更新："+y()})).catch((e=>{throw e}))};(async()=>{await i.getSettings(),o=i.interval<=30?30:i.interval,a=i.chime,c=i.notify,d=i.smartIfSimple,l=i.new_version,u.volume=.01*i.volume,await(async()=>{e.create(r.query("#sidebar-wrapper ul:last-child")).addClass("u-border");const t=e.create("ul").addClass("sidebar-nav-mentor");if(e.create(r.query("#sidebar-wrapper")).appendChild(t),t.appendChild(e.create("h5").text("Plugin").addClass(["font-size-x-small","add-margin-0","add-padding-10","font-color-gray-lighter"])),i.watchSlack&&t.appendChild(f().appendChild(e.create("a").prop({href:"/mentor/all/reports?custom=1",target:"_blank"}).addClass(["side-link","sidebar-icon"]).appendChild(e.create("i").addClass(["fa","fa-external-link","font-color-white","add-padding-right-15"]).appendChild(e.create("span").addClass(["add-padding-left-15","display-inline-block"]).text("Slack通知用ページ"))))),"/mentor/all/reports"==location.pathname){const e=w(2,"　シンプル化");e.addEventListener("change",(e=>{v(e.target.checked)})),t.appendChild(e)}const s=w(4,"　チャイム");t.appendChild(s),r.queryId("pluginSwitchButton4").checked=a;const n=w(5,"　通知");t.appendChild(n),r.queryId("pluginSwitchButton5").checked=c;const d=w(1,"　定期リロード");t.appendChild(d),d.addEventListener("change",(e=>{e.target.checked?(b(),h=window.setInterval(b,1e3*o)):(r.queryId("pluginSwitchMessage").innerHTML="&nbsp;",window.clearInterval(h),h=0,document.title=g)}));const p=f().appendChild(e.create("span").prop({id:"pluginSwitchMessage",style:{color:"white"}}).text("　"));if(t.appendChild(p),l){const r=f().appendChild(e.create("a").prop({id:"pluginVersionUpMessage",href:"https://github.com/ShigeUe/MentorCheckEx"}).text("MentorCheckExの\n新バージョンあり"));t.appendChild(r)}v(!1)})()})()})();