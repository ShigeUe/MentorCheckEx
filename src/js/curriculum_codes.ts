export const CurriculumIdToData: {
  [id: string]: {
    [key: string]: {
      title: string,
      files: string[],
      folder: string,
      demo?: string,
      description: string
    }
  }
} = {
  'first-sidejob-2': {
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
      files:['index.html', 'css/style.css', 'js/hamburger.js', 'js/carousel.js'],
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
  },
  'first-sidejob-3': {
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
      files:['index.html', 'css/style.css', 'js/main.js'],
      folder: 'smartphone', 
      description: '',
    },
    'kadai-smartphone-2': {
      title: '',
      files:['index.html', 'css/style.css', 'js/main.js'],
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
  }
};

export class ReviewCodes {
  public static codes: { [key: string]: { code: string, file: string, title: string }[] } =
    {
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
    };

  static addElement(elements: NodeListOf<HTMLElement>, title: number, index: number, file?: string) {
    // モジュールで読み込むのでhrefにドメインが付いていない
    const url = new URL("http://example.com" + elements[title].querySelector<HTMLAnchorElement>('a')!.href);
    const id = url.hash.substring(1);
    if (!ReviewCodes.codes[id]) {
      ReviewCodes.codes[id] = [];
    }
    ReviewCodes.codes[id].push({
      title: elements[title].innerText, 
      file: file ? file : elements[index].innerText,
      code: elements[index + 1].innerText.trim(),
    });
  }

  // カリキュラムから直接取る場合はこちら
  static async getCodes() {
    const [path,] = location.href.split('lessons');
    const c_ver_str = path.match(/first-sidejob-(\d+?)/);
    if (!c_ver_str) {
      return;
    }
    const c_ver = Number(c_ver_str[1]);

    const rs = await fetch(path + '/review_guide');
    const tx = await rs.text();
    const doc: HTMLElement = document.implementation.createHTMLDocument("").documentElement;
    doc.innerHTML = tx;
    const elements = doc.querySelectorAll<HTMLElement>('h1 ~ h2,h1 ~ p,h1 ~ .highlighter-coderay');
  
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerText.indexOf('課題2：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 1, 'index.html');
      }
      if (elements[i].innerText.indexOf('課題3：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 2);
      }
      if (elements[i].innerText.indexOf('課題7：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 3);
        ReviewCodes.addElement(elements, i, i + 5);
      }
      if (elements[i].innerText.indexOf('課題8：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 3);
        ReviewCodes.addElement(elements, i, i + 5);
      }
      if (elements[i].innerText.indexOf('課題13：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 3);
        ReviewCodes.addElement(elements, i, i + 5);
        ReviewCodes.addElement(elements, i, i + 7);
        if (c_ver < 3) {
          ReviewCodes.addElement(elements, i, i + 9);
        }
      }
      if (elements[i].innerText.indexOf('課題14：') !== -1) {
        ReviewCodes.codes['kadai-smartphone-2'].push(ReviewCodes.codes['kadai-smartphone-1'][0]);
        ReviewCodes.addElement(elements, i, i + 4);
        ReviewCodes.codes['kadai-smartphone-2'].push(ReviewCodes.codes['kadai-smartphone-1'][2]);
        if (c_ver < 3) {
          ReviewCodes.codes['kadai-smartphone-2'].push(ReviewCodes.codes['kadai-smartphone-1'][3]);
        }
      }
      if (elements[i].innerText.indexOf('課題16：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 4);
        ReviewCodes.addElement(elements, i, i + 6);
        ReviewCodes.addElement(elements, i, i + 8);
      }
      if (elements[i].innerText.indexOf('課題17：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 4);
        ReviewCodes.addElement(elements, i, i + 6);
        ReviewCodes.addElement(elements, i, i + 8);
      }
      if (elements[i].innerText.indexOf('課題19：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 4);
        ReviewCodes.addElement(elements, i, i + 6);
        ReviewCodes.addElement(elements, i, i + 8);
      }
      if (elements[i].innerText.indexOf('課題20：') !== -1) {
        ReviewCodes.addElement(elements, i, i + 4);
        ReviewCodes.addElement(elements, i, i + 6);
        ReviewCodes.addElement(elements, i, i + 8);
      }
    }
  }

  static async getCodesFromGit() {
    for (let id in ReviewCodes.codes) {
      for (let path of CurriculumIdToData['first-sidejob-2'][id].files) {
        const rs = await fetch(`https://a7.sakuratan.com/gdrive/curriculum-codes/${id}/${path}`, {
          credentials: 'include',
          cache: 'no-cache',
          mode: 'cors',
        });
        const code = await rs.text();
        const file = path.split('/').pop() ?? '';
        ReviewCodes.codes[id].push({ file, code, title: '' });
      }
    }
  }
}
