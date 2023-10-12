const {convertToHtml} = require('../../wechat/markdown')
const assert = require('assert')

describe('wechat markdown', () => {
    it('converts markdown to html', () => {
        const markdown = `![](test.png)`

        const html = convertToHtml(markdown);

        assert.equal(html, `<p><img src="test.png" alt=""></p>\n`)
    })
});
