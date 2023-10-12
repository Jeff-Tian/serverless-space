module.exports.convertToHtml = (markdown) => {
    const md = require('markdown-it')({
        typographer: true,
        breaks: true,
    })

    return md.render(markdown)
}
