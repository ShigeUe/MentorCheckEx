"use strict";

(async () => {

  const ME = new MentorCheckEx();

  const link = ME.query('[href^="https://drive.google.com/drive/"]:has(i)');
  if (!link) {
    return;
  }
  // GoogleフォルダID
  const f_id = link.href.split('/').at(-1).replace(/\?[-a-z=_]*/, "");

  const kadai_link = ME.query(`#page-content-wrapper .col-sm-8 table td a[href*="#kadai-"]`);
  if (!kadai_link) { // 課題のリンクがない＝ユーザーページ
    const user = location.href.split('/').pop();

    const div = document.createElement('div');
    Object.keys(CurriculumIdToData).forEach((id) => {
      const a_tag = document.createElement('a');
      a_tag.target = '_blank';
      a_tag.href = `/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons?diff=1&id=${f_id}` +
        `&folder=${CurriculumIdToData[id].folder}&c_id=${id}&user=${user}`;
      a_tag.classList.add('btn', 'btn-primary', 'btn-sm', 'font-size-x-small');
      a_tag.style = "margin:3px 3px 0 0"
      a_tag.innerText = id;
      div.append(a_tag);
    });
    link.parentElement.append(div);
    return;
  }
  const curriculum_id = kadai_link.href.split('#').pop();
  if (!CurriculumIdToData[curriculum_id]) {
    return;
  }
  const target = CurriculumIdToData[curriculum_id].folder;
  if (!target) {
    return;
  }




  const user = ME.query('[href^="/mentor/users/').href.split('/').pop();

  // 設定を同期的に読み込み
  await ME.getSettings();
  
  const command = ME.settings.rclone + ` ${f_id} ${target}`;

  const div = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = command;
  input.id = 'rclone-command';
  input.style.width = '100%';
  input.style.display = 'block';
  input.onfocus = function () {
    this.select();
  };

  const label = document.createElement('label');
  label.htmlFor = 'rclone-command';
  label.style.display = 'block';
  label.style.marginTop = '.5em';
  label.append('rcloneコマンド');

  const small = document.createElement('p');
  small.classList.add('add-margin-0');
  small.innerHTML = `<p><small>コマンドはオプションで変更できます。</small></p>\n` +
    (CurriculumIdToData[curriculum_id] ? `<a href="/mentor/courses/first-sidejob/curriculums/first-sidejob-2/lessons?diff=1&id=${f_id}&folder=${target}&c_id=${curriculum_id}&user=${user}" target="_blank" class="btn btn-success btn-sm font-size-x-small">レビュー比較ツール</a><br><small>（初回BASIC認証が求められます）</small>\n` : '');

  div.append(label);
  div.append(input);
  div.append(small);
  link.parentElement.append(div);
})();
