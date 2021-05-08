"use strict";

(function () {
  /* ----------------------------------------------------------------------- */
  /* Utility functions
  -------------------------------------------------------------------------- */
  const query = function (s, d) {
    if (d === undefined) {
      d = document;
    }
    return d.querySelector(s);
  }

  const queryAll = function (s) {
    return document.querySelectorAll(s);
  }

  const queryId = function (id) {
    return document.getElementById(id);
  }

  const createElement = function (p) {
    return document.createElement(p);
  }


  const h2 = query('.breadcrumb + h2');
  const button = createElement('a');
  button.classList.add('plugin-button');
  button.innerText = 'ページ最下部へ';
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const elm = document.documentElement;
    const bottom = elm.scrollHeight - elm.clientHeight;
    window.scroll(0, bottom);
    return false;
  });
  h2.append(button);
})();