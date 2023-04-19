const ReviewCodes = {
  codes: {},
  getCodes: async () => {
    const rs = await fetch('https://techacademy.jp/mentor/courses/first-sidejob/review_guide');
    const tx = await rs.text();
    const elements = $(tx).find('h1').siblings('h2,p,pre');
  
    const addElement = (elements, title, index, file) => {
      const url = new URL(elements[title].querySelector('a').href);
      const id = url.hash.substring(1);
      if (!ReviewCodes.codes[id]) {
        ReviewCodes.codes[id] = [];
      }
      ReviewCodes.codes[id].push({
        title: elements[title].innerText, 
        file: file ? file : elements[index].innerText,
        code: elements[index + 1].innerText.trim(),
      });
    };
  
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerText.indexOf('課題2：') !== -1) {
        addElement(elements, i, i + 1, 'index.html');
        i += 3;
      }
      if (elements[i].innerText.indexOf('課題3：') !== -1) {
        addElement(elements, i, i + 2);
        i += 4;
      }
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
  },
};

const CurriculumIdToData = {
  'kadai-html-1': {
    files:['index.html'],
    folder: 'kadai-html',
  },
  'kadai-html-2': {
    files:['style.css'],
    folder: 'kadai-html', 
  },
  'kadai-css': {
    files:['index.html', 'style.css'],
    folder: 'kadai-css', 
  },
  'kadai-portfolio-1': {
    files:['index.html', 'css/style.css'],
    folder: 'portfolio', 
  },
  'kadai-portfolio-2': {
    files:['index.html', 'css/style.css'],
    folder: 'portfolio', 
  },
  'kadai-portfolio-3': {
    files:['career.html', 'css/style.css'],
    folder: 'kadai-portfolio', 
    demo: "https://demo.techacademy.jp/first-sidejob/portfolio/career.html",
  },
  'kadai-jquery1': {
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery1', 
  },
  'kadai-jquery2': {
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery2', 
  },
  'kadai-jquery3': {
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery3', 
  },
  'kadai-smartphone-1': {
    files:['index.html', 'css/style.css', 'js/hamburger.js', 'js/carousel.js'],
    folder: 'smartphone', 
  },
  'kadai-smartphone-2': {
    files:['css/style.css'],
    folder: 'smartphone', 
  },
  'kadai-recipe-1': {
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
  },
  'kadai-recipe-2': {
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
  },
  'kadai-recipe-3': {
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
    demo: "https://demo.techacademy.jp/first-sidejob/recipe/index.html",
  },
  'kadai-corporate-site-1': {
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
  },
  'kadai-corporate-site-2': {
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
  },
  'kadai-corporate-site-3': {
    files:['access/index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    demo: "https://demo.techacademy.jp/first-sidejob/corporate-site/access/index.html",
  },
  'kadai-corporate-site-4': {
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    demo: "https://demo.techacademy.jp/first-sidejob/corporate-site/index.html",
  },
  'kadai-final-exam': {
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'final-exam', 
    demo: 'https://demo.techacademy.jp/first-sidejob/final-exam/index.html',
  },
};
