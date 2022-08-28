import { xpathBuilder } from '../../main/xpath';

const data = [
  { e: "/h1", xpath: xpathBuilder().root().el('h1').get(), },
  { e: "//h1", xpath: xpathBuilder().rel().el('h1').get(), },
  { e: "/h1/span[@id='hoge']", xpath: xpathBuilder().root().el('h1').el('span', { id: 'hoge' }).get(), },
  { e: "/h1/span[@class='hoge']", xpath: xpathBuilder().root().el('h1').el('span', { className: 'hoge' }).get(), },
  { e: "/h1/span[(@id='hoge') and (@class='fuga')]", xpath: xpathBuilder().root().el('h1').el('span', { id: 'hoge', className: 'fuga' }).get(), },
]
test.each(data)('test', ({ e, xpath }) => {
  expect(xpath).toBe(e);
});
