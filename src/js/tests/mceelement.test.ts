import { MCEElement } from '../mceelement';

// MCEElement.ts のテストコード
describe('MCEElement', () => {
  // 各テスト実行前に実行される処理
  beforeEach(() => {
    // テスト用にbodyを空にする
    document.body.innerHTML = '';
  });

  // MCEElement のインスタンス生成をテスト
  describe('constructor', () => {
    it('タグ名から要素を作成できる', () => {
      const element = new MCEElement('div');
      expect(element.get().tagName).toBe('DIV');
    });

    it('HTMLElement から要素を作成できる', () => {
      const div = document.createElement('div');
      const element = new MCEElement(div);
      expect(element.get()).toBe(div);
    });

    it('その他場合は<s/>タグになる（例外的）', () => {
      const element = new MCEElement(123 as any);
      expect(element.get().tagName).toBe('S');
    });
  });

  // MCEElement.create() メソッドをテスト
  describe('create', () => {
    it('新しいインスタンスを生成できる', () => {
      const element = MCEElement.create('span');
      expect(element).toBeInstanceOf(MCEElement);
      expect(element.get().tagName).toBe('SPAN');
    });
  });

  // addClass() メソッドをテスト
  describe('addClass', () => {
    it('単一のクラスを追加できる', () => {
      const element = new MCEElement('div').addClass('test-class');
      expect(element.get().classList.contains('test-class')).toBe(true);
    });

    it('複数のクラスを配列で追加できる', () => {
      const element = new MCEElement('div').addClass(['test-class1', 'test-class2']);
      expect(element.get().classList.contains('test-class1')).toBe(true);
      expect(element.get().classList.contains('test-class2')).toBe(true);
    });
    it('空文字は無視する', () => {
      const element = new MCEElement('div').addClass('');
      expect(element.get().classList.length).toBe(0);
    });
  });

  // removeClass() メソッドをテスト
  describe('removeClass', () => {
    it('クラスを削除できる', () => {
      const element = new MCEElement('div').addClass('test-class').removeClass('test-class');
      expect(element.get().classList.contains('test-class')).toBe(false);
    });
  });

  // addEventListener() メソッドをテスト
  describe('addEventListener', () => {
    it('イベントリスナーを追加できる', () => {
      const element = new MCEElement('button');
      const mockFn = jest.fn();
      element.addEventListener('click', mockFn);
      element.get().click();
      expect(mockFn).toHaveBeenCalled();
    });
  });

  // prop() メソッドをテスト
  describe('prop', () => {
    it('オブジェクトでプロパティを設定できる', () => {
      const element = new MCEElement('input').prop({ type: 'text', value: 'test' });
      expect((element.get() as HTMLFormElement).type).toBe('text');
      expect((element.get() as HTMLFormElement).value).toBe('test');
    });

    it('オブジェクトの中にオブジェクトがある', () => {
      const element = new MCEElement('span').prop({ style: { color: 'white' } });
      expect((element.get() as HTMLSpanElement).style.color).toBe('white');
    });

    it('キーと値でプロパティを設定できる', () => {
      const element = new MCEElement('div').prop('id', 'test-id');
      expect(element.get().id).toBe('test-id');
    });

    it('キーのみでプロパティを取得できる', () => {
      const element = new MCEElement('div').prop('id', 'test-id');
      expect(element.prop('id')).toBe('test-id');
    });

    it('存在しないキーの取得は空文字を返す', () => {
      const element = new MCEElement('div');
      expect(element.prop('xxxx')).toBe('');
    });
  });

  // get() メソッドをテスト
  describe('get', () => {
    it('HTMLElement を取得できる', () => {
      const element = new MCEElement('div');
      expect(element.get()).toBeInstanceOf(HTMLElement);
    });
  });

  // set() メソッドをテスト
  describe('set', () => {
    it('タグ名で要素を作り直せる', () => {
      const element = new MCEElement('div').set('span');
      expect(element.get().tagName).toBe('SPAN');
    });
    it('HTMLElementで要素を上書きできる', () => {
      const div = document.createElement('div');
      const element = new MCEElement('span').set(div);
      expect(element.get()).toBe(div);
    });
  });

  // appendChild() メソッドをテスト
  describe('appendChild', () => {
    it('子要素を追加できる', () => {
      const parent = new MCEElement('div');
      const child = new MCEElement('span');
      parent.appendChild(child);
      expect(parent.get().firstChild).toBe(child.get());
    });

    it('HTMLElementで子要素を追加できる', () => {
      const parent = new MCEElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);
      expect(parent.get().firstChild).toBe(child);
    });
  });

  // insertFirst() メソッドをテスト
  describe('insertFirst', () => {
    it('子要素を先頭に追加できる', () => {
      const parent = new MCEElement('div');
      const child1 = new MCEElement('span');
      const child2 = new MCEElement('p');
      parent.appendChild(child1);
      parent.insertFirst(child2);
      expect(parent.get().firstChild).toBe(child2.get());
    });

    it('HTMLElementで子要素を先頭に追加できる', () => {
      const parent = new MCEElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('p');
      parent.appendChild(child1);
      parent.insertFirst(child2);
      expect(parent.get().firstChild).toBe(child2);
    });
  });

  // text() メソッドをテスト
  describe('text', () => {
    it('テキストを設定できる', () => {
      const element = new MCEElement('div').text('test-text');
      expect(element.get().innerText).toBe('test-text');
    });

    it('テキストを取得できる', () => {
      const element = new MCEElement('div');
      element.get().innerText = 'test-text';
      expect(element.text()).toBe('test-text');
    });
  });

  // style() メソッドをテスト
  describe('style', () => {
    it('スタイルを設定できる', () => {
      const element = new MCEElement('div').style({ color: 'red', 'background-color': 'blue' });
      console.log(element.get().style);
      expect(element.get().style.color).toBe('red');
      expect(element.get().style.backgroundColor).toBe('blue');
    });
  });
});
