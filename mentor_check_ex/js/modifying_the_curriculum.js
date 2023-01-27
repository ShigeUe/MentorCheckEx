"use strict";

(() => {
  const courses = {
    'first-sidejob': 'はじめての副業',
    'first-sidejob-r': 'はじめての副業R',
    'first-sidejob-r-m': 'はじめての副業 for mom',
    'first-sidejob-2': 'はじめての副業2',
    'first-sidejob-2-rd': 'はじめての副業 R&D',    
  };
  const course_id = window.location.href.split('/').at(-3);
  const course_name = courses[course_id];

  if (!course_name) {
    return;
  }

  const div = document.createElement('div');
  div.innerText = course_name;
  div.style.position = 'absolute';
  div.style.left = 0;
  div.style.top = '-50px';
  div.style.zIndex = '999';
  div.style.padding = '10px 20px';
  div.style.backgroundColor = '#f00';
  div.style.opacity = '0.5';
  div.style.color = '#fff';
  div.style.fontSize = '24px'
  div.style.fontWeight = 'bold';
  div.style.lineHeight = 1;

  const target = document.querySelector('.billy_lesson .note-index-wrap .note-index');
  target.append(div);
})();
