export class Util
{
  #doc: HTMLElement = document.body;

  queryId<E extends HTMLElement = HTMLElement>(id: string): E {
    const ret: HTMLElement | null = document.getElementById(id);
    if (ret === null) {
      throw new Error(`要素が取得できませんでした。ID:${id}`);
    }
    return ret as E;
  }

  static queryId<E extends HTMLElement = HTMLElement>(id: string): E {
    const ret: HTMLElement | null = document.getElementById(id);
    if (ret === null) {
      throw new Error(`要素が取得できませんでした。ID:${id}`);
    }
    return ret as E;
  }

  static queryAll<E extends HTMLElement = HTMLElement>(selector: string): NodeListOf<E> {
    return document.querySelectorAll<E>(selector);
  }

  queryAll<E extends HTMLElement = HTMLElement>(selector: string): NodeListOf<E> {
    return this.#doc.querySelectorAll<E>(selector);
  }

  static query<E extends HTMLElement = HTMLElement>(selector: string, nullable: boolean): E | null;
  static query<E extends HTMLElement = HTMLElement>(selector: string): E;
  static query<E extends HTMLElement = HTMLElement>(selector: string, nullable?: boolean): E | null{
    const ret: E | null = document.querySelector<E>(selector);
    if (ret === null) {
      if (typeof nullable === 'undefined' || (typeof nullable !== 'undefined' && !nullable)) {
        throw new Error(`要素が取得できませんでした。Selector:${selector}`);
      }
      return null;
    }
    return ret;
  }

  query<E extends HTMLElement = HTMLElement>(selector: string, nullable: boolean): E | null;
  query<E extends HTMLElement = HTMLElement>(selector: string): E;
  query<E extends HTMLElement = HTMLElement>(selector: string, nullable?: boolean): E | null{
    if (typeof nullable === 'undefined') {
      return Util.query<E>(selector);
    }
    else {
      return Util.query<E>(selector, nullable);
    }
  }

  get_document(): HTMLElement {
    return this.#doc;
  }

  set_document(target: HTMLElement): Util {
    this.#doc = target;
    return this;
  }

}