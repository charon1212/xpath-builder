import { HTMLTagName } from "./HTMLTagName";

export const xpathBuilder = <T extends string = string>() => new XPath<T>();

type TagName<T> = (T extends 'html' ? HTMLTagName : string) | '*';

class XPath<T extends string = string> {
  private text: string = '/';
  constructor() { };
  desc() {
    this.text += '/';
    return this;
  }
  /**
   * 子要素にアクセスする。
   * @param tag タグ名。特定しない場合は'*'を指定する。
   * @param options オプション。
   */
  el(tag: TagName<T>, ...options: ElementOption[]) {
    const op = parseElementOptions(options);
    this.text += `${tag}` + (op && `[${op}]`) + '/';
    return this;
  }
  /**
   * 親要素にアクセスする。　例：//span[@class='hoge']/../../div
   */
  parent() {
    this.text += '../';
    return this;
  }
  /**
   * 同じ親の内、この要素より後の要素にアクセスする。　//span/following-sibling::td
   * @param tag タグ名。特定しない場合は'*'を指定する。
   * @param options オプション。
   */
  followingSibling(tag: TagName<T>, ...options: ElementOption[]) {
    this.text += 'following-sibling::';
    return this.el(tag, ...options);
  }
  /**
   * 同じ親の内、この要素より前の要素にアクセスする。　//span/preceding-sibling::td
   * @param tag タグ名。特定しない場合は'*'を指定する。
   * @param options オプション。
   */
  precedingSibling(tag: TagName<T>, ...options: ElementOption[]) {
    this.text += 'preceding-sibling::';
    return this.el(tag, ...options);
  }
  /**
   * このxpathの文字列表現を取得する。
   */
  get() {
    if (!this.text) return '';
    return this.text.substring(0, this.text.length - 1);
  }
}

const parseElementOptions = (list: ElementOption[]) => {
  const options = list.map((op) => {
    const { id, className, attr, position } = op;
    const arr = [] as string[];
    if (id) arr.push(createAttributeQuery('id', id));
    if (className) arr.push(createAttributeQuery('class', className));
    if (attr) {
      for (let key in attr) arr.push(createAttributeQuery(key, attr[key]));
    }
    if (position !== undefined) arr.push(`position()=${position}`);
    if (arr.length === 1) return arr[0];
    return arr.map((v) => `(${v})`).join(' and ');
  }).filter((v) => v);
  if (options.length === 1) return options[0];
  return options.map((op) => `(${op})`).join(' or ');
};

const createAttributeQuery = (key: string, value: AttributeValue): string => {
  if (typeof value === 'string') return `@${key}='${value}'`;
  if ('startsWith' in value) return `starts-with(@${key},'${value.startsWith}')`;
  if ('contains' in value) return `contains(@${key},'${value.contains}')`;
  return `not(@${key}='${value.not}')`;
};

type ElementOption = {
  id?: AttributeValue,
  className?: AttributeValue,
  attr?: { [key in string]: AttributeValue },
  position?: number,
};

type AttributeValue =
  | string
  | { not: string }
  | { startsWith: string }
  | { contains: string };
