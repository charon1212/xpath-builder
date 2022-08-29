# xpath-builder

## インストール

```bash
> npm i @charon1212/xpath-builder
```

## 使い方

基本

```typescript
import { xpathBuilder } from '@charon1212/xpath-builder'

// xpathBuilder()から始まり、el等でxpathを指定し、最後にget()する。
// 例：/html/body/div[@class='hoge']
const xpath = xpathBuilder().el('html').el('body').el('div', { className: 'hoge' }).get();
```

詳細

- 子孫要素(descendant)の検索

```typescript
// 任意の位置のdiv要素の、子孫要素のtd要素。
//   => //div//td
const xpath = xpathBuilder().desc().el('div').desc().el('td').get();
```

- id検索

```typescript
// 任意の位置のidが'hoge'のdiv要素
//   => //div[@id='hoge']
const xpath = xpathBuilder().desc().el('div', { id: 'hoge' }).get();
```

- class検索

```typescript
// 任意の位置のclassが'hoge'のdiv要素
//   => //div[@class='hoge']
const xpath = xpathBuilder().desc().el('div', { className: 'hoge' }).get();
```

- src検索 (id,class以外の属性)

```typescript
// 任意の位置のsrcが'hoge'のdiv要素
//   => //div[@src='hoge']
const xpath = xpathBuilder().desc().el('div', { attr: { key: 'src', value: 'hoge' } }).get();
```

- position指定

```typescript
// id='hoge'のテーブルの、3行目のtr要素の、5番目のtd要素
//   => //table[@id='hoge']//tr[position()=3]//td[position()=5]
const xpath = xpathBuilder().desc().el('table', { id: 'hoge' }).desc().el('tr', { position: 3 }).desc().el('td', { position: 5 }).get();
```

- 複数検索(AND)

```typescript
// 任意の位置の、「idが'aaa'」かつ「classが'bbb'」かつ「srcが'ccc'」かつ「hrefが'ddd'」であるdiv要素
//   => //div[(@id='aaa') and (@class='bbb') and (@src='ccc') and (@href='ddd')]
const xpath = xpathBuilder().desc().el('div', { id: 'aaa', className: 'bbb', attr: [{ key: 'src', value: 'ccc' }, { key: 'href', value: 'ddd' }] }).get();
```

- 複数検索(OR)

```typescript
// 任意の位置の、「classが'aaa'」または「classが'bbb'」であるdiv要素
//   => //div[(@class='aaa') or (@class='bbb')]
const xpath = xpathBuilder().desc().el('div', { className: 'aaa' }, { className: 'bbb' }).get();
```

- not検索（id, class, attrに対応）

```typescript
// 任意の位置の、classが'aaa'でないdiv要素
//   => //div[not(@class='aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { not: 'aaa' } }).get();
```

- contains検索（id, class, attrに対応）

```typescript
// 任意の位置の、classに'aaa'を含むdiv要素
//   => //div[contains(@class,'aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { contains: 'aaa' } }).get();
```

- starts-with検索（id, class, attrに対応）

```typescript
// 任意の位置の、classが'aaa'から始まるdiv要素
//   => //div[starts-with(@class,'aaa')]
const xpath = xpathBuilder().desc().el('div', { className: { startsWith: 'aaa' } }).get();
```

- 親要素

```typescript
// idが'aaa'であるdiv要素の親要素
//   => //div/..
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).parent().get();
```

- 前の要素(<https://developer.mozilla.org/ja/docs/Web/XPath/Axes/preceding-sibling>)

```typescript
// idが'aaa'であるdiv要素の前の要素のp要素
//   => //div/preceding-sibling::
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).precedingSibling().el('p').get();
```

- 後の要素(<https://developer.mozilla.org/ja/docs/Web/XPath/Axes/following-sibling>)

```typescript
// idが'aaa'であるdiv要素の後の要素のp要素
//   => //div/following-sibling::
const xpath = xpathBuilder().desc().el('div', { id: 'aaa' }).followingSibling().el('p').get();
```
