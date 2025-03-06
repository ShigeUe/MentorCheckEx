import { Util } from '../util';

// chrome APIをモック化
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    getURL: jest.fn((path) => `mocked-url/${path}`)
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
} as any;
global.document = document;

describe('Util', () => {
  let util: Util;

  beforeEach(() => {
    util = new Util();
    // DOMをリセット
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('queryId', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
      div = document.createElement('div');
      div.id = 'testId';
      document.body.appendChild(div);
    });
    test('存在する要素を取得できること(static)', () => {
      const element = Util.queryId('testId');
      expect(element).toBe(div);
    });
    test('存在する要素を取得できること(instance)', () => {
      const element = (new Util).queryId('testId');
      expect(element).toBe(div);
    });

    test('存在しない要素を取得しようとするとエラーが発生すること', () => {
      expect(() => Util.queryId('nonExistentId')).toThrow(Error(`要素が取得できませんでした。ID:nonExistentId`));
    });
  });

  describe('queryAll', () => {
    let div1: HTMLDivElement;
    let div2: HTMLDivElement;
    beforeEach(() => {
      div1 = document.createElement('div');
      div2 = document.createElement('div');
      div1.classList.add('testClass');
      div2.classList.add('testClass');
      document.body.appendChild(div1);
      document.body.appendChild(div2);
    });
    test('存在するすべての要素を取得できること(static)', () => {
      const elements = Util.queryAll('.testClass');
      expect(elements.length).toBe(2);
      expect(elements[0]).toBe(div1);
      expect(elements[1]).toBe(div2);
    });
    test('存在するすべての要素を取得できること(instance)', () => {
      const elements = (new Util).queryAll('.testClass');
      expect(elements.length).toBe(2);
      expect(elements[0]).toBe(div1);
      expect(elements[1]).toBe(div2);
    });
  });

  describe('query', () => {
    test('存在する要素を取得できること', () => {
      const div = document.createElement('div');
      div.classList.add('testClass');
      document.body.appendChild(div);

      const element = Util.query('.testClass');
      expect(element).toBe(div);
    });

    test('存在しない要素を取得しようとするとエラーが発生すること', () => {
      expect(() => Util.query('.nonExistentClass')).toThrow(Error(`要素が取得できませんでした。Selector:.nonExistentClass`));
    });

    test('nullableを指定すると存在しない要素に対してnullが返ること', () => {
      const element = Util.query('.nonExistentClass', true);
      expect(element).toBeNull();
    });
    test('Utilインスタンスのqueryは存在する要素を取得できること', () => {
      const div = document.createElement('div');
      div.classList.add('testClass');
      document.body.appendChild(div);

      const element = util.query('.testClass');
      expect(element).toBe(div);
    });

    test('Utilインスタンスのqueryは存在しない要素を取得しようとするとエラーが発生すること', () => {
      expect(() => util.query('.nonExistentClass')).toThrow(Error(`要素が取得できませんでした。Selector:.nonExistentClass`));
    });

    test('Utilインスタンスのnullableを指定すると存在しない要素に対してnullが返ること', () => {
      const element = util.query('.nonExistentClass', true);
      expect(element).toBeNull();
    });
  });

  describe('get_document', () => {
    test('現在のドキュメントを取得できること', () => {
      expect(util.get_document()).toBe(document.body);
    });
  });

  describe('set_document', () => {
    test('ドキュメントをセットできること', () => {
      const newDoc = document.createElement('body');
      const newUtil = util.set_document(newDoc);
      expect(newUtil.get_document()).toBe(newDoc);
      expect(newUtil).toBe(util);
    });
  });

  describe('notify', () => {
    test('chrome.runtime.sendMessageを正しく呼び出していること', () => {
      Util.notify('テストタイトル', 'テスト本文');
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'notification',
        title: 'テストタイトル',
        body: 'テスト本文',
      });
    });
  });
});
