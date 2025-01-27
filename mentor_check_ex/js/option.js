"use strict";const queryId=e=>document.getElementById(e),query=e=>document.querySelector(e),audio=new Audio(chrome.runtime.getURL("resources/chime.mp3"));audio.addEventListener("ended",(()=>{queryId("volume").disabled=!1}));let curriculums=[];const makeListElement=e=>{const r=document.createElement("label"),u=document.createTextNode(e.name),c=document.createElement("input");return c.type="checkbox",c.name=e.name,c.value=1,c.checked=!("visible"in e)||e.visible,r.appendChild(c),r.appendChild(u),r},makeCurriculumsList=()=>{const e=queryId("curriculums");curriculums.forEach((r=>{e.appendChild(makeListElement(r))}))},getCurriculumsFromScreen=()=>{curriculums.forEach((e=>{const r=query(`#curriculums input[name="${e.name}"]`);e.visible=!r||r.checked}))};document.addEventListener("DOMContentLoaded",(async()=>{const e=await fetch("https://techacademy.jp/mentor/curriculums",{method:"GET",mode:"same-origin",credentials:"include"});if(!e.ok)throw new Error("HTTP error! status: "+e.status);const r=await e.text(),u=document.implementation.createHTMLDocument("").documentElement;u.innerHTML=r,u.querySelectorAll(".breadcrumb + h2 + .nav li a").forEach((e=>{curriculums.push({name:e.textContent,url:e.attributes.href.value,visible:!1})})),chrome.storage.local.get({interval:30,chime:!1,notify:!1,smartIfSimple:!1,curriculumSubMenu:!1,curriculums:[],username:"",password:"",volume:50,watchSlack:!1,darkmode:!1,diff:!0,diffFromGit:!1,warningChannel:[]},(e=>{queryId("interval").value=e.interval,queryId("chime").checked=!!e.chime,queryId("notify").checked=!!e.notify,queryId("smartIfSimple").checked=!!e.smartIfSimple,queryId("curriculumSubMenu").checked=!!e.curriculumSubMenu,queryId("username").value=e.username,queryId("password").value=e.password,queryId("volume").value=e.volume,queryId("volume-text").innerText=e.volume,queryId("watchSlack").checked=!!e.watchSlack,queryId("darkmode").checked=!!e.darkmode,queryId("diff").checked=!!e.diff,queryId("diffFromGit").checked=!!e.diffFromGit,queryId("warningChannel").value=e.warningChannel,audio.volume=.01*e.volume,curriculums=curriculums.map((r=>{const u=e.curriculums.filter((e=>e.name==r.name));return u.length&&(r.visible=u[0].visible),r})),makeCurriculumsList()})),queryId("save").addEventListener("click",(()=>{const e=queryId("interval").value-0,r=queryId("chime").checked,u=queryId("notify").checked,c=queryId("smartIfSimple").checked,t=queryId("curriculumSubMenu").checked,n=queryId("username").value,i=queryId("password").value,d=queryId("volume").value,a=queryId("watchSlack").checked,l=queryId("darkmode").checked,m=queryId("diff").checked,o=queryId("diffFromGit").checked,s=queryId("warningChannel").value.trim();getCurriculumsFromScreen(),isNaN(e)||e<30||e>300?alert("リロード間隔が範囲外です"):chrome.storage.local.set({interval:e,chime:r,notify:u,smartIfSimple:c,curriculumSubMenu:t,curriculums,username:n,password:i,volume:d,watchSlack:a,darkmode:l,diff:m,diffFromGit:o,warningChannel:s},(()=>{queryId("message").innerText="保存しました"}))})),queryId("close").addEventListener("click",(()=>{window.close()})),queryId("all-reset").addEventListener("click",(()=>{window.confirm("設定をすべて消去します。")&&(chrome.storage.local.clear(),window.close())})),queryId("notify_test").addEventListener("click",(e=>{e.preventDefault(),chrome.runtime.sendMessage("",{type:"notification",title:"通知テスト",body:"通知のテストです。"})})),chrome.storage.local.get("new_version",(e=>{e.new_version&&(queryId("version-up-message").innerHTML='<b style="font-weight:bold;color:red;">新しいバージョンがあります</b>')}));const c=chrome.runtime.getManifest();queryId("version").innerText=c.version,queryId("volume").addEventListener("change",(e=>{const r=e.target.value;queryId("volume-text").innerText=r,e.target.disabled=!0,audio.volume=.01*r,audio.play()}))}));