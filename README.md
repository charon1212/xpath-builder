# xpath-builder

## インストール

```bash
> npm i @charon1212/xpath-builder
```

## npm

<https://www.npmjs.com/package/@charon1212/xpath-builder>

## 使い方

基本

```typescript
import { xpathBuilder } from '@charon1212/xpath-builder'

// xpathBuilder()から始まり、el等でxpathを指定し、最後にget()する。
// 例：/html/body/div[@class='hoge']
const xpath = xpathBuilder().el('html').el('body').el('div', { className: 'hoge' }).get();
// xpathBuilderに'html'型を渡すと、el等でHTMLタグであるかのチェックをしてくれる。
const htmlXpath = xpathBuilder<'html'>().el('html').el('body').el('hoge', { className: 'hoge' }).get();
//                                                                ~~~~~~ <= type error
```

詳細

- 子要素の検索

.el()でつなげることで、子要素を検索できます。全要素を指定する場合は通常のxpathと同じく`*`を指定します。

```typescript
// div要素の下のspan要素の下の全要素
//   => /div/span/*
const xpath = xpathBuilder().el('div').el('span').el('*').get();
```

- 子孫要素(descendant)の検索

.el()でつなげると親子関係が必要ですが、間にdesc()を入れると子孫関係で検索できます。

```typescript
// 任意の位置のdiv要素の、子孫要素のtd要素。
//   => //div//td
const xpath = xpathBuilder().desc().el('div').desc().el('td').get();
```

- id検索

elの第2引数に`{id:string}`を指定すると、ID指定で検索できます。

```typescript
// idが'hoge'のdiv要素
//   => //div[@id='hoge']
const xpath = xpathBuilder().desc().el('div', { id: 'hoge' }).get();
```

- class検索

elの第2引数に`{className:string}`を指定すると、Class指定で検索できます。

```typescript
// classが'hoge'のdiv要素
//   => //div[@class='hoge']
const xpath = xpathBuilder().desc().el('div', { className: 'hoge' }).get();
```

- src検索 (id,class以外の属性)

elの第2引数に`{attr:{key:string}}`を指定すると、その他の属性で検索できます。

```typescript
// srcが'hoge'のdiv要素
//   => //div[@src='hoge']
const xpath = xpathBuilder().desc().el('div', { attr: { src: 'hoge' } }).get();
```

- position指定

elの第2引数に`{position:number}`を指定すると、位置指定で検索ができます。

```typescript
// id='hoge'のテーブルの、3行目のtr要素の、5番目のtd要素
//   => //table[@id='hoge']//tr[position()=3]//td[position()=5]
const xpath = xpathBuilder().desc().el('table', { id: 'hoge' }).desc().el('tr', { position: 3 }).desc().el('td', { position: 5 }).get();
```

- 複数検索(AND)

上記のID検索等を同時に複数指定すると、AND検索になります。

```typescript
// 任意の位置の、「idが'aaa'」かつ「classが'bbb'」かつ「srcが'ccc'」かつ「hrefが'ddd'」であるdiv要素
//   => //div[(@id='aaa') and (@class='bbb') and (@src='ccc') and (@href='ddd')]
const xpath = xpathBuilder().desc().el('div', { id: 'aaa', className: 'bbb', attr: [{ src: 'ccc' }, { href: 'ddd' }] }).get();
```

- 複数検索(OR)

elの第3引数以降にさらに条件を指定すると、各条件をOR条件でつなぎます。

```typescript
// 任意の位置の、「classが'aaa'」または「classが'bbb'」であるdiv要素
//   => //div[(@class='aaa') or (@class='bbb')]
const xpath = xpathBuilder().desc().el('div', { className: 'aaa' }, { className: 'bbb' }).get();
```

- not検索（id, class, attrに対応）

ID, Class, Attrの検索時に、文字列ではなくオブジェクト`{not:string}`を指定すると、not検索になります。

```typescript
// 任意の位置の、classが'aaa'でないdiv要素
//   => //div[not(@class='aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { not: 'aaa' } }).get();
```

- contains検索（id, class, attrに対応）

ID, Class, Attrの検索時に、文字列ではなくオブジェクト`{contains:string}`を指定すると、contains検索になります。

```typescript
// 任意の位置の、classに'aaa'を含むdiv要素
//   => //div[contains(@class,'aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { contains: 'aaa' } }).get();
```

- starts-with検索（id, class, attrに対応）

ID, Class, Attrの検索時に、文字列ではなくオブジェクト`{startsWith:string}`を指定すると、starts-with検索になります。

```typescript
// 任意の位置の、classが'aaa'から始まるdiv要素
//   => //div[starts-with(@class,'aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { startsWith: 'aaa' } }).get();
```

- 親要素

parent()を間に入れると、親要素にアクセスできます。

```typescript
// idが'aaa'であるdiv要素の親要素
//   => //div[@id='aaa']/..
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).parent().get();
```

- 前の要素(<https://developer.mozilla.org/ja/docs/Web/XPath/Axes/preceding-sibling>)

precedingSibling()で、ある要素よりも前の要素を検索できます。elと同様に、条件を指定することもできます。

```typescript
// idが'aaa'であるdiv要素の前の要素のp要素
//   => //div[@id='aaa']/preceding-sibling::p
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).precedingSibling('p').get();
```

- 後の要素(<https://developer.mozilla.org/ja/docs/Web/XPath/Axes/following-sibling>)

followingSibling()で、ある要素よりも後の要素を検索できます。elと同様に、条件を指定することもできます。

```typescript
// idが'aaa'であるdiv要素の後の要素のp要素
//   => //div[@id='aaa']/following-sibling::p
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).followingSibling('p').get();
```
