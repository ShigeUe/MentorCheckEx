"use strict";

(() => {
  const ME = new MentorCheckEx();

  const codes = ME.queryAll(".CodeRay");
  if (!codes.length) {
    return;
  }

  const button = document.createElement('button');
  button.append('COPY');
  button.style.position = 'absolute';
  button.style.top = '-35px';
  button.style.right = '0';
  button.classList.add('btn', 'btn-sm', 'btn-danger');

  const onclick = (e) => {
    const text = e.target.parentElement.querySelector('.code pre').innerText;
    ME.copyClipboard(text);
  };

  codes.forEach((ele) => {
    ele.style.position = 'relative';
    const b = button.cloneNode(true);
    b.addEventListener('click', onclick);
    ele.append(b);
  });
})();