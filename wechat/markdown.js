const md = require('markdown-it')({
    typographer: true,
    breaks: true,
    html: true, // 语雀生成的 markdown 里会包含 html 标签，所以这里需要开启
})

module.exports.convertToHtml = (markdown) => {

    return md.render(markdown);
}
