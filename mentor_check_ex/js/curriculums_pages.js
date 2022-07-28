"use strinct";

const style = `
<style>
  .billy_mentor,
  .billy_mentor .container-fluid {
    color: #fff;
    background-color: #222;
  }
  .billy_mentor .container-fluid .note.markdown {
    color: #fff;
    background-color: rgba(0,0,0,0);
  }
  .billy_mentor .container-fluid .billy_lesson .btn-default {
    color: #fff !important;
    background-color: rgba(0,0,0,0);
  }
  .billy_lesson .note-index-wrap .note-index .note-index-content {
    background-color: rgba(0,0,0,0) !important;
  }
  .billy_mentor .container-fluid .billy_lesson pre {
    background-color: rgba(0,0,0,0);
  }
  .billy_mentor .container-fluid a {
    color: #15a1a8;
  }
  input[type="search"] {
    background-color: rgba(0,0,0,0);
  }
  .billy_mentor .container-fluid .billy_lesson code {
    background-color: rgba(0,0,0,0);
  }
  /* .billy_mentor .container-fluid table>thead>tr>th, */
  .billy_mentor .container-fluid table>thead>tr>td,
  .billy_mentor .container-fluid table>tbody>tr>th,
  .billy_mentor .container-fluid table>tbody>tr>td,
  .billy_mentor .container-fluid table>tfoot>tr>th,
  .billy_mentor .container-fluid table>tfoot>tr>td {
    background-color: #222;
  }
  .billy_mentor .container-fluid .billy_lesson .challenge .challenge-title-h3 {
    color: #222;
  }
</style>
`;

(async () => {
  const ME = new MentorCheckEx();
  await ME.getSettings();
  if (ME.settings.darkmode) {
    document.querySelector('head').insertAdjacentHTML('beforeend', style);
  }
})();