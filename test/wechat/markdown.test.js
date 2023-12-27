const {convertToHtml} = require('../../wechat/markdown')
const assert = require('assert')

describe('wechat markdown', () => {
    it('converts markdown to html', () => {
        const markdown = `![](test.png)`

        const html = convertToHtml(markdown);

        assert.equal(html, `<p><img src="test.png" alt=""></p>\n`)
    })

    it('should not contain `&lt;br /&gt;` s', () => {
        const markdown = `line1<br />line2`
        const html = convertToHtml(markdown);
        assert.equal(html, `<p>line1<br />line2</p>\n`)
    })
});
