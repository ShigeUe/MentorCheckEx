import { Util } from "./util"; 
import { MCEElement } from "./mceelement";

const courses: HTMLElement[] = [];

const toggleCourse = (index: number, flag: string) => {
  const nextCourse = ((index + 1) >= courses.length) ? null : courses[index + 1];

  for (
    let ele = courses[index];
    ele != nextCourse;
    ele = ele.nextSibling as HTMLElement
  ) {
    if (flag === 'hide') {
      ele.style.opacity = "0";
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
const list = Util.queryAll('h3 + h4');
// 上記要素が2個以上ある＝絞り込める
if (list.length > 1) {
  list.forEach((ele) => {
    // coursesにh4の前のh3を入れていく
    courses.push(ele.previousSibling as HTMLElement);
  });

  if (courses.length) {
    // コースをON・OFFするチェックボックスを設置する
    const div = MCEElement.create('div').addClass('add-margin-top-15');
    const label = MCEElement.create('label').addClass(['add-margin-wide-15']);
    const span = MCEElement.create('span').addClass(['add-margin-left-10', 'font-weight-normal']).text('コース絞り込み：');
    const select = MCEElement.create('select').addClass(['font-weight-normal', 'add-padding-5']);
    select.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      if (!target.selectedIndex) {
        for (let i = 0; i < courses.length; i++) {
          toggleCourse(i, 'show');
        }
      }
      else {
        for (let i = 0; i < courses.length; i++) {
          if (i !== target.selectedIndex - 1) {
            toggleCourse(i, 'hide');
          }
        }
        toggleCourse(target.selectedIndex - 1, 'show');
      }
    });

    select.appendChild(MCEElement.create('option').prop('value', "0").text('全表示'));
    courses.forEach((ele, i) => {
      const option = MCEElement.create('option').prop('value', String(i + 1)).text(ele.innerText);
      select.appendChild(option);
    });
    label.appendChild(span);
    label.appendChild(select);
    div.appendChild(label);

    const parent = Util.query('.container-fluid .row .col-lg-12');
    parent.insertBefore(div.get(), courses[0]);
  }

}
