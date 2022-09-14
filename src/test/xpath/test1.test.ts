import { xpathBuilder } from '../..';
import { outerProd, innerProd } from 'util-charon1212';
import * as x from 'xpath';
import * as fs from 'fs';
import { DOMParser } from 'xmldom';

describe('xpathBuilder_random-test', () => {
  const data = [
    { e: "/h1", xpath: xpathBuilder().el('h1').get(), },
    { e: "//h1", xpath: xpathBuilder().desc().el('h1').get(), },
    { e: "/h1/span[@id='hoge']", xpath: xpathBuilder().el('h1').el('span', { id: 'hoge' }).get(), },
    { e: "/h1/span[@class='hoge']", xpath: xpathBuilder().el('h1').el('span', { className: 'hoge' }).get(), },
    { e: "/h1/span[(@id='hoge') and (@class='fuga')]", xpath: xpathBuilder().el('h1').el('span', { id: 'hoge', className: 'fuga' }).get(), },
  ]
  test.each(data)('test', ({ e, xpath }) => {
    expect(xpath).toBe(e);
  });
});

describe('xpathBuilder_key-value-pattern', () => {
  const keyPattern = ['id', 'class', 'attr'];
  const valuePattern = [
    { value: 'hoge', exp: (key: string) => `@${key}='hoge'` },
    { value: { not: 'hoge' }, exp: (key: string) => `not(@${key}='hoge')` },
    { value: { contains: 'hoge' }, exp: (key: string) => `contains(@${key},'hoge')` },
    { value: { startsWith: 'hoge' }, exp: (key: string) => `starts-with(@${key},'hoge')` },
  ];
  const totalPattern = outerProd(keyPattern, valuePattern);

  test.each(totalPattern)('test2', (key, { value, exp }) => {
    const value2 =
      key === 'id' ? { id: value }
        : key === 'class' ? { className: value }
          : key === 'attr' ? { attr: { key: 'attr', value } }
            : '';
    const act = xpathBuilder().el('div', value2 as any).get();
    expect(act).toBe(`/div[${exp(key)}]`);
  });
});

describe('xpathBuilder_README.md', () => {
  const pattern = [
    { exp: "/html/body/div[@class='hoge']", xpath: xpathBuilder().el('html').el('body').el('div', { className: 'hoge' }).get() },
    { exp: "//div//td", xpath: xpathBuilder().desc().el('div').desc().el('td').get() },
    { exp: "//div[@id='hoge']", xpath: xpathBuilder().desc().el('div', { id: 'hoge' }).get() },
    { exp: "//div[@class='hoge']", xpath: xpathBuilder().desc().el('div', { className: 'hoge' }).get() },
    { exp: "//div[@src='hoge']", xpath: xpathBuilder().desc().el('div', { attr: { key: 'src', value: 'hoge' } }).get() },
    { exp: "//table[@id='hoge']//tr[position()=3]//td[position()=5]", xpath: xpathBuilder().desc().el('table', { id: 'hoge' }).desc().el('tr', { position: 3 }).desc().el('td', { position: 5 }).get() },
    { exp: "//div[(@id='aaa') and (@class='bbb') and (@src='ccc') and (@href='ddd')]", xpath: xpathBuilder().desc().el('div', { id: 'aaa', className: 'bbb', attr: [{ key: 'src', value: 'ccc' }, { key: 'href', value: 'ddd' }] }).get() },
    { exp: "//div[(@class='aaa') or (@class='bbb')]", xpath: xpathBuilder().desc().el('div', { className: 'aaa' }, { className: 'bbb' }).get() },
    { exp: "//div[not(@class='aaa')]", xpath: xpathBuilder().desc().el('div', { className: { not: 'aaa' } }).get() },
    { exp: "//div[contains(@class,'aaa')]", xpath: xpathBuilder().desc().el('div', { className: { contains: 'aaa' } }).get() },
    { exp: "//div[starts-with(@class,'aaa')]", xpath: xpathBuilder().desc().el('div', { className: { startsWith: 'aaa' } }).get() },
    { exp: "//div[@id='aaa']/..", xpath: xpathBuilder().desc().el('div', { id: 'aaa' }).parent().get() },
    { exp: "//div[@id='aaa']/preceding-sibling::p", xpath: xpathBuilder().desc().el('div', { id: 'aaa' }).precedingSibling('p').get() },
    { exp: "//div[@id='aaa']/following-sibling::p", xpath: xpathBuilder().desc().el('div', { id: 'aaa' }).followingSibling('p').get() },
  ];
  test.each(pattern)('test3', ({ exp, xpath }) => {
    expect(xpath).toBe(exp);
  })
})

const assertIsNode = (node: x.SelectedValue): Element => {
  if (typeof node !== 'object') throw new Error('ノードがPrimitive値です。');
  return node as Element;
};
describe('xpathBuilder_execute-xpath-query', () => {
  const htmlSample1 = fs.readFileSync('src/test/xpath/xpathBuilder/sample1.html').toString();
  const domSample1 = new DOMParser().parseFromString(htmlSample1);
  const pattern = [
    { xpath: xpathBuilder().el('div').el('span').el('div').get(), expectIdList: ['id3-1', 'id3-2', 'id3-3'] },
    { xpath: xpathBuilder().desc().el('span', { id: 'id4-1' }).el('p').get(), expectIdList: ['id5-p-1'] },
    { xpath: xpathBuilder().desc().el('span', { className: 'class4-1' }).el('p').get(), expectIdList: ['id5-p-1'] },
    { xpath: xpathBuilder().desc().el('span', { attr: { key: 'attr', value: 'attr4-1' } }).el('p').get(), expectIdList: ['id5-p-1'] },
    { xpath: xpathBuilder().el('div').el('span').el('div', { position: 2 }).get(), expectIdList: ['id3-2'] },
    { xpath: xpathBuilder().desc().el('span', { className: 'class4-1', attr: [{ key: 'attr', value: 'attr4-1' }, { key: 'test', value: 'test4-1' }] }).get(), expectIdList: ['id4-1'] },
    { xpath: xpathBuilder().desc().el('span', { className: 'class4-2' }, { className: 'class4-4' }).get(), expectIdList: ['id4-2', 'id4-4'] },
    { xpath: xpathBuilder().desc().el('span', { id: 'id2-1' }).el('div', { id: { not: 'id3-2' } }).get(), expectIdList: ['id3-1', 'id3-3'], },
    { xpath: xpathBuilder().desc().el('span', { className: { contains: 'ss4-' } }).get(), expectIdList: ['id4-1', 'id4-2', 'id4-3', 'id4-4', 'id4-5', 'id4-6', 'id4-7', 'id4-8', 'id4-9',], },
    { xpath: xpathBuilder().desc().el('span', { className: { startsWith: 'class4-' } }).get(), expectIdList: ['id4-1', 'id4-2', 'id4-3', 'id4-4', 'id4-5', 'id4-6', 'id4-7', 'id4-8', 'id4-9',], },
    { xpath: xpathBuilder().desc().el('span', { id: 'id4-7' }).parent().get(), expectIdList: ['id3-3'], },
    { xpath: xpathBuilder().desc().el('span', { id: 'id4-7' }).followingSibling('span').get(), expectIdList: ['id4-8', 'id4-9'], },
    { xpath: xpathBuilder().desc().el('span', { id: 'id4-9' }).precedingSibling('span').get(), expectIdList: ['id4-7', 'id4-8'], },
  ];
  test.each(pattern)('test-4', ({ xpath, expectIdList }) => {
    const nodes = x.select(xpath, domSample1);
    expect(nodes.length).toBe(expectIdList.length);
    for (let [n, expectId] of innerProd(nodes, expectIdList)) {
      const node = assertIsNode(n);
      expect(node.getAttribute('id')).toBe(expectId);
    }
  });
});
