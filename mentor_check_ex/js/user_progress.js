"use strict";

const cources = [];

const toggleCource = (index, flag) => {
  for (
    let ele = cources[index];
    !ele.classList.contains('modal') && !ele.classList.contains('fade');
    ele = ele.nextSibling
  ) {
    if (flag === 'hide') {
      ele.style.opacity = 0;
      setTimeout(() => {
        ele.style.display = 'none';
      }, 200);
    }
    else {
      ele.style.display = '';
      setTimeout(() => {
        ele.style.opacity = '';
      }, 1);
    }
  }
};

// コースが入っている構造は h3 + h4 なので、それを取得
const list = ME.queryAll('h3 + h4');
// 上記要素が存在する
if (list.length) {
  list.forEach((ele) => {
    // courcesにh4の前のh3を入れていく
    cources.push(ele.previousSibling);
  });
}

if (cources.length) {
  // コースをON・OFFするチェックボックスを設置する
  const div = MCEElement.create('div').addClass('add-margin-top-15');
  const label = MCEElement.create('label').addClass(['add-margin-wide-15']);
  const span = MCEElement.create('span').addClass(['add-margin-left-10', 'font-weight-normal']).text('コース絞り込み：');
  const select = MCEElement.create('select').addClass(['font-weight-normal', 'add-padding-5']);
  select.addEventListener('change', (e) => {
    if (!e.target.selectedIndex) {
      for (let i = 0; i < cources.length; i++) {
        toggleCource(i, 'show');
      }
    }
    else {
      for (let i = 0; i < cources.length; i++) {
        if (i !== e.target.selectedIndex - 1) {
          toggleCource(i, 'hide');
        }
      }
      toggleCource(e.target.selectedIndex - 1, 'show');
    }
  });

  select.appendChild(MCEElement.create('option').prop('value', 0).text('全表示'));
  cources.forEach((ele, i) => {
    const option = MCEElement.create('option').prop('value', i+1).text(ele.innerText);
    select.appendChild(option);
  });
  label.appendChild(span);
  label.appendChild(select);
  div.appendChild(label);

  const parent = ME.query('.container-fluid .row .col-lg-12');
  parent.insertBefore(div.get(), cources[0]);
}

