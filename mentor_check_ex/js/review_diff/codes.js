const review_codes = [];

(async () => {

  const rs = await fetch('https://techacademy.jp/mentor/courses/first-sidejob/review_guide');
  const tx = await rs.text();
  const elements = $(tx).find('h1').siblings('h2,p,.highlighter-coderay');

  addElement = (elements, title, index) =>{
    review_codes.push({
      title: elements[title].innerText, 
      file: elements[index].innerText,
      code: elements[index + 1].innerText.trim(),
    });
  };

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerText.indexOf('課題7：') !== -1) {
      addElement(elements, i, i + 3);
      addElement(elements, i, i + 5);
      i += 6;
    }
    if (elements[i].innerText.indexOf('課題8：') !== -1) {
      addElement(elements, i, i + 3);
      addElement(elements, i, i + 5);
      i += 6;
    }
    if (elements[i].innerText.indexOf('課題13：') !== -1) {
      addElement(elements, i, i + 3);
      addElement(elements, i, i + 5);
      addElement(elements, i, i + 7);
      addElement(elements, i, i + 9);
      i += 10;
    }
    if (elements[i].innerText.indexOf('課題14：') !== -1) {
      addElement(elements, i, i + 4);
      i += 5;
    }
    if (elements[i].innerText.indexOf('課題16：') !== -1) {
      addElement(elements, i, i + 4);
      addElement(elements, i, i + 6);
      addElement(elements, i, i + 8);
      i += 9;
    }
    if (elements[i].innerText.indexOf('課題17：') !== -1) {
      addElement(elements, i, i + 4);
      addElement(elements, i, i + 6);
      addElement(elements, i, i + 8);
      i += 9;
    }
    if (elements[i].innerText.indexOf('課題19：') !== -1) {
      addElement(elements, i, i + 4);
      addElement(elements, i, i + 6);
      addElement(elements, i, i + 8);
      i += 9;
    }
    if (elements[i].innerText.indexOf('課題20：') !== -1) {
      addElement(elements, i, i + 4);
      addElement(elements, i, i + 6);
      addElement(elements, i, i + 8);
      i += 9;
    }
  }
})();
