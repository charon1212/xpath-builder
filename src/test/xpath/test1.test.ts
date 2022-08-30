import { xpathBuilder } from '../..';
import { outerProd } from 'util-charon1212';

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
