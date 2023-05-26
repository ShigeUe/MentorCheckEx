const CurriculumIdToData = {
  'kadai-html-1': {
    title: '',
    files:['index.html'],
    folder: 'kadai-html',
    description: '',
  },
  'kadai-html-2': {
    title: '',
    files:['style.css'],
    folder: 'kadai-html', 
    description: '',
  },
  'kadai-css': {
    title: 'CSSでレイアウトを作成してみよう',
    files:['index.html', 'style.css'],
    folder: 'kadai-css', 
    description: '「ボックスの横幅がボックス間の間隔も考慮した3等分」に注意してください。<br><code>width: calc((100% - 40px) / 3);</code>',
  },
  'kadai-portfolio-1': {
    title: '',
    files:['index.html', 'css/style.css'],
    folder: 'portfolio', 
    description: '',
  },
  'kadai-portfolio-2': {
    title: '',
    files:['index.html', 'css/style.css'],
    folder: 'portfolio', 
    description: '',
  },
  'kadai-portfolio-3': {
    title: 'ポートフォリオサイトの下層ページを作成してみよう',
    files:['career.html', 'css/style.css'],
    folder: 'kadai-portfolio', 
    demo: "https://demo.techacademy.jp/first-sidejob/portfolio/career.html",
    description: 'デモページを同じウィンドウで開き、TABキーで切り替えて差を確認してください。',
  },
  'kadai-jquery1': {
    title: 'セレクタを書いてみよう',
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery1', 
    description: '',
  },
  'kadai-jquery2': {
    title: 'イベントを書いてみよう',
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery2', 
    description: '',
  },
  'kadai-jquery3': {
    title: 'slickのスライダーにオプションを追加しよう',
    files:['index.html', 'main.js'],
    folder: 'kadai-jquery3', 
    description: '',
  },
  'kadai-smartphone-1': {
    title: '',
    files:['index.html', 'css/style.css', 'js/hamburger.js', 'js/carousel.js'],
    folder: 'smartphone', 
    description: '',
  },
  'kadai-smartphone-2': {
    title: '',
    files:['css/style.css'],
    folder: 'smartphone', 
    description: '',
  },
  'kadai-recipe-1': {
    title: '',
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
    description: '',
  },
  'kadai-recipe-2': {
    title: '',
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
    description: '',
  },
  'kadai-recipe-3': {
    title: 'レシピサイトのフッターを作成しよう',
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'recipe', 
    demo: "https://demo.techacademy.jp/first-sidejob/recipe/index.html",
    description: 'PC版は1366px、SP版は390px(iPhone 12 Pro)でご確認ください。<br>Perfect Piexlでピッタリあう必要はありません。',
  },
  'kadai-corporate-site-1': {
    title: '',
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    description: '',
  },
  'kadai-corporate-site-2': {
    title: '',
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    description: '',
  },
  'kadai-corporate-site-3': {
    title: 'accessページの作成',
    files:['access/index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    demo: "https://demo.techacademy.jp/first-sidejob/corporate-site/access/index.html",
    description: 'PC版は1920px×1080px、SP版は390px(iPhone 12 Pro)でご確認ください。<br>Perfect Pixelである程度合わせていただく必要があります。',
  },
  'kadai-corporate-site-4': {
    title: 'コーポレートサイトのトップページをPerfect Pixelで調整しよう',
    files:['index.html', 'assets/css/style.css', 'assets/js/main.js'],
    folder: 'corporate-site', 
    demo: "https://demo.techacademy.jp/first-sidejob/corporate-site/index.html",
    description: 'PC版は1920px×1080px、SP版は390px(iPhone 12 Pro)でご確認ください。<br>Perfect Pixelで大きなズレがないように合わせていただく必要があります。',
  },
  'kadai-final-exam': {
    title: '【最終課題】オンライン英会話教室のWebページ制作',
    files:['index.html', 'css/style.css', 'js/main.js'],
    folder: 'final-exam', 
    demo: 'https://demo.techacademy.jp/first-sidejob/final-exam/index.html',
    description: 'PC版は1536px、SP版は390px(iPhone 12 Pro)でご確認ください。',
  },
};

const ReviewCodes = {
  /*
  // カリキュラムから直接取る場合はこちら
  getCodes: async () => {
    const rs = await fetch('https://techacademy.jp/mentor/courses/first-sidejob/review_guide');
    const tx = await rs.text();
    const elements = $(tx).find('h1').siblings('h2,p,.highlighter-coderay');
  
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
  */
  codes: {
    "kadai-html-1": [],
    "kadai-html-2": [],
    "kadai-portfolio-1": [],
    "kadai-portfolio-2": [],
    "kadai-smartphone-1": [],
    "kadai-smartphone-2": [],
    "kadai-recipe-1": [],
    "kadai-recipe-2": [],
    "kadai-corporate-site-1": [],
    "kadai-corporate-site-2": []
  },
  getCodes: async () => {
    console.log(ReviewCodes.codes);
    for (let id in ReviewCodes.codes) {
      for (let file of CurriculumIdToData[id].files) {
        console.log(`https://a7.sakuratan.com/gdrive/curriculum-codes/${id}/${file}`);
        const rs = await fetch(`https://a7.sakuratan.com/gdrive/curriculum-codes/${id}/${file}`, {
          credentials: 'include',
          cache: 'no-cache',
          mode: 'cors',
        });
        const code = await rs.text();
        file = file.split('/').pop();
        ReviewCodes.codes[id].push({ file, code });
      }
    }
  },
};
