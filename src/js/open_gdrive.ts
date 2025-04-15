import { Settings } from "./settings";
import { Util } from "./util";
import { CurriculumIdToData } from "./curriculum_codes";

async function makeOpenGdriveButton() {
  // 課題のリンクが存在すれば課題レビューページ、存在しなければユーザーページ
  const kadai_link = Util.query<HTMLAnchorElement>(`#page-content-wrapper .col-sm-8 table td a[href*="#kadai-"]`, true);
  let link: HTMLAnchorElement | null = null;
    
  if (kadai_link) {
    // 課題レビューはGoogleドライブのリンクはひとつ
    link = Util.query<HTMLAnchorElement>('[href^="https://drive.google.com/drive/"]:has(i)', true);
  }
  else {
    // 複数のGoogleドライブのリンクがある可能性があるので絞り込む
    const links = Util.queryAll<HTMLAnchorElement>('[href^="https://drive.google.com/drive/"]:has(i)');
    if (links.length === 0) {
      return;
    }
  
    links.forEach((el) => {
      if (el.innerText.includes('はじめての副業')) {
        link = el;
      }
      else {
        if (el.querySelector('.fa-cloud')) {
          return;
        }
        // はじ副に強制するボタンを設置
        const button = document.createElement('button');
        button.innerText = '　←はじ副にする';
        button.classList.add('force-hajifuku', 'font-size-x-small');
        button.title = 'はじ副に強制し、課題レビューボタンを表示します';
        button.addEventListener('click', () => {
          if (button.previousElementSibling) {
            (button.previousElementSibling as HTMLAnchorElement).innerHTML = '<i class="fa fa-cloud fa-l"></i>【強制】はじめての副業';
          }
          // 課題レビュー用ボタンを設置するため、本体を再呼び出し
          setTimeout(makeOpenGdriveButton, 100);
          button.remove();
        });
        el.after(button);
      }
    });
  }
  if (!link) {
    // Googleドライブへのリンクが取得できなければ終了
    return;
  }

  // 設定を同期的に読み込み
  const settings = new Settings;
  await settings.getSettings();

  // GoogleフォルダID
  const f_id = (new URL(link.href)).pathname.split('/').pop();

  if (kadai_link) {
    // 課題レビュー
    const curriculum_id = kadai_link.href.split('#').pop() as string;
    if (!CurriculumIdToData[curriculum_id]) {
      return;
    }
    const target = CurriculumIdToData[curriculum_id].folder;
    if (!target) {
      return;
    }

    const div = document.createElement('div');
    const small = document.createElement('p');

    if (settings.diff) {
      const user = Util.query<HTMLAnchorElement>('[href^="/mentor/users/').href.split('/').pop();
      small.classList.add('add-margin-0');
      small.innerHTML = small.innerHTML +
        (CurriculumIdToData[curriculum_id] ? `<a href="/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons?diff=1&id=${f_id}&folder=${target}&c_id=${curriculum_id}&user=${user}" target="_blank" class="btn btn-success btn-sm font-size-x-small">レビュー比較ツール</a><br><small>（初回BASIC認証が求められます）</small>\n` : '');
      div.append(small);
    }
    link.parentElement && link.parentElement.append(div);
  }
  else {
    // ユーザーページ
    if (settings.diff) {
      const user = location.href.split('/').pop();

      const div = document.createElement('div');
      Object.keys(CurriculumIdToData).forEach((id) => {
        const a_tag = document.createElement('a');
        a_tag.target = '_blank';
        a_tag.href = `/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons?diff=1&id=${f_id}` +
          `&folder=${CurriculumIdToData[id].folder}&c_id=${id}&user=${user}`;
        a_tag.classList.add('btn', 'btn-primary', 'btn-sm', 'font-size-x-small');
        a_tag.style.cssText = "margin:3px 3px 0 0"
        a_tag.innerText = id;
        div.append(a_tag);
      });
      link.parentElement && link.parentElement.append(div);
    }
  }
}

makeOpenGdriveButton();
