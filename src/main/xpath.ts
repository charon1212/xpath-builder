export const xpathBuilder = () => new XPath();

class XPath {
  private text: string = '/';
  constructor() { };
  rel() {
    this.text += '/';
    return this;
  }
  /**
   * 子要素にアクセスする。
   * @param tag HTMLタグ名。特定しない場合は'*'を指定する。
   * @param options オプション。
   */
  el(tag: HTMLTagName | '*', ...options: ElementOption[]) {
    if (!this.text) this.throwErrorFirstElement();
    const op = parseElementOptions(options);
    this.text += `${tag}` + (op ? `[${op}]` : '') + '/';
    return this;
  }
  /**
   * 親要素にアクセスする。　例：//span[@class='hoge']/../../div
   */
  parent() {
    if (!this.text) this.throwErrorFirstElement();
    this.text += '../';
    return this;
  }
  /**
   * 同じ親の内、この要素より後の要素にアクセスする。　//span/following-sibling::td
   */
  followingSibling() {
    if (!this.text) this.throwErrorFirstElement();
    this.text += 'following-sibling::';
    return this;
  }
  /**
   * 同じ親の内、この要素より前の要素にアクセスする。　//span/preceding-sibling::td
   */
  precedingSibling() {
    if (!this.text) this.throwErrorFirstElement();
    this.text += 'preceding-sibling::';
    return this;
  }
  /**
   * このxpathの文字列表現を取得する。
   */
  get() {
    if (!this.text) return '';
    return this.text.substring(0, this.text.length - 1);
  }
  private throwErrorFirstElement() {
    throw new Error('first element must root() or rel().')
  }
}

const parseElementOptions = (list: ElementOption[]) => {
  const options = list.map((op) => {
    const { id, className, attr, position } = op;
    const arr = [] as string[];
    if (id) arr.push(createAttributeQuery('id', id));
    if (className) arr.push(createAttributeQuery('class', className));
    if (attr) {
      const attrArray = Array.isArray(attr) ? attr : [attr];
      arr.push(...attrArray.map(({ key, value }) => createAttributeQuery(key, value)));
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
  attr?: { key: string, value: AttributeValue } | { key: string, value: AttributeValue }[],
  position?: number,
};

type AttributeValue =
  | string
  | { not: string }
  | { startsWith: string }
  | { contains: string };
