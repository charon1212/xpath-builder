import { xpathBuilder } from '../../main/xpath';
import { outerProd } from 'util-charon1212';

describe('xpathBuilder_random-test', () => {
  const data = [
    { e: "/h1", xpath: xpathBuilder().el('h1').get(), },
    { e: "//h1", xpath: xpathBuilder().rel().el('h1').get(), },
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
