import { xpathBuilder } from '..';

xpathBuilder().el('hoge');
xpathBuilder().el('*');
// @ts-expect-error
xpathBuilder<'html'>().el('hoge');
xpathBuilder<'html'>().el('div');
xpathBuilder<'html'>().el('*');

xpathBuilder().followingSibling('hoge');
xpathBuilder().followingSibling('*');
// @ts-expect-error
xpathBuilder<'html'>().followingSibling('hoge');
xpathBuilder<'html'>().followingSibling('div');
xpathBuilder<'html'>().followingSibling('*');

xpathBuilder().precedingSibling('hoge');
xpathBuilder().precedingSibling('*');
// @ts-expect-error
xpathBuilder<'html'>().precedingSibling('hoge');
xpathBuilder<'html'>().precedingSibling('div');
xpathBuilder<'html'>().precedingSibling('*');
