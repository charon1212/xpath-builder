import { xpathBuilder } from '../../main/xpath';

test('tagName', () => {
  const xpath = xpathBuilder().root().el('h2').get();
  expect(xpath).toBe('/h2');
});
