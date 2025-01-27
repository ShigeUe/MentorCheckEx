type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface CHTMLElement extends Writable<HTMLElement> {
  [key: string]: any;
}

// HTML Elementの作成・操作するクラス
// MentorCheckExElementの略
export class MCEElement
{
  private _element: HTMLElement;

  constructor(tagNameOrElement: string | HTMLElement) {
    if (typeof tagNameOrElement === 'string') {
      this._element = document.createElement(tagNameOrElement);
    }
    else if (typeof tagNameOrElement === 'object') {
      this._element = tagNameOrElement;
    }
    else {
      this._element = document.createElement('s');
    }
  }

  // 新しいインスタンスを作る
  static create(obj: string | HTMLElement): MCEElement {
    return new MCEElement(obj);
  }

  // クラスの追加
  addClass(className: string | string[]): MCEElement {
    if (typeof className === 'string' && className !== '') {
      this._element.classList.add(className);
    }
    else if (className && className.constructor.name === 'Array') {
      className.forEach((c) => this.addClass(c), this);
    }
    return this;
  }

  // クラスの削除
  removeClass(className: string): MCEElement {
    this._element.classList.remove(className);
    return this;

  }
  // addEventListenerのラップ
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, func: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): MCEElement {
    this._element.addEventListener(type, func);
    return this;
  }

  // エレメントのプロパティをセットする
  // valueが省略されている場合は、指定のプロパティを取得する
  // Overload
  prop(property: object): MCEElement;
  prop(property: keyof CHTMLElement): string;
  prop(property: keyof CHTMLElement, value: string): MCEElement;
  // Implementation
  prop(property: object | keyof CHTMLElement, value?: string): MCEElement | string {
    if (typeof property === 'object') {
      this._setObjectProp(this._element, property);
    }
    else {
      const el: CHTMLElement = this._element as CHTMLElement;
      // property is a string
      if (typeof value === 'undefined') {
        return (property in el) ? String(el[property]) : '';
      }
      else {
        if (property in el) {
          el[property] = value;
        }
      }
    }
    return this;
  }

  // エレメントのプロパティをセットする
  // オブジェクトで複数のプロパティがあれば再帰的にセットしていく
  private _setObjectProp(target: HTMLElement , obj: {[key: string]: any}): void {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const el: CHTMLElement = target as CHTMLElement;
      if (typeof value === 'object') {
        this._setObjectProp(el[key], value);
      }
      else {
        el[key] = value;
      }
    }, this);
  }

  // エレメントを取得する
  get(): HTMLElement {
    return this._element;
  }
  
  // 指定のタグで作り直すか、エレメントをセットする
  set(tagNameOrElement: string | HTMLElement): MCEElement {
    this.constructor(tagNameOrElement);
    return this;
  }

  // appendChildのラップ
  appendChild(child: HTMLElement | MCEElement): MCEElement {
    this._element.append(
      child instanceof MCEElement ?
        child.get() : child
    );
    return this;
  }

  // insertBeforeのラップで一番前に挿入する
  insertFirst(child: HTMLElement | MCEElement): MCEElement {
    this._element.insertBefore(
      child instanceof MCEElement ?
        child.get() : child,
      this._element.firstChild
    );
    return this;
  }

  // そのエレメントのテキストをセットする or 引数がなければ取得する
  // Overload
  text(): string;
  text(text: string): MCEElement;
  // Implementation
  text(text?: string): MCEElement | string {
    if (typeof text === 'undefined') {
      return this._element.innerText;
    }
    else {
      this._element.innerText = text;
      return this;
    }
  }

  // スタイルを設定する
  style(styles: {[key: string]: any}): MCEElement {
    Object.keys(styles).forEach(key => {
      this._element.style.setProperty(key, styles[key]);
    }, this);
    return this;
  }
}
