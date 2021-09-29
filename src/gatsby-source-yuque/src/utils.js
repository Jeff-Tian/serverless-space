const dayjs = require(`dayjs`)
const Entities = require(`html-entities`).AllHtmlEntities
const grayMatter = require(`gray-matter`)
const R = require(`ramda`)

const entities = new Entities()

/**
 * front matter 反序列化
 *
 * @param {String} body md 文档
 * @param {Function} reporter Gatsby Reporter
 * @return {Object} data
 */
exports.parseMatter = (body, reporter) => {
	body = entities.decode(body)
	try {
		// front matter 信息的 <br/> 换成 \n
		const regex = /(---|title:|layout:|tags:|date:|categories:){1}(\S|\s)+?---/gi
		body = body.replace(regex, a => a.replace(/(<br \/>|<br>|<br\/>)/gi, `\n`))
		const result = grayMatter(body)
		const data = {
			...result.data,
			body: formatRaw(result.content)
		}
		return data
	} catch (error) {
		reporter.error(error)
		return {
			body
		}
	}
}

/**
 * 转换为本地时间
 *
 * @param {Date} date UTC
 * @return {Date} local Time
 */
exports.formatDate = date => {
	return dayjs(date).format(`YYYY-MM-DDTHH:mm:ss`)
}

/**
 * 格式化 markdown 内容
 *
 * @param {Array} items items
 * @return {String} body
 */
exports.formatArray = items => {
	items = Array.isArray(items) ? items : isString(items) ? [items] : []
	return `[${items.join(`,`)}]`
}

/**
 * 格式化 markdown 内容
 *
 * @param {String} body md 文档
 * @return {String} body
 */
function formatRaw(body) {
	const multiBr = /(<br>\s){2}/gi
	const hiddenContent = /<div style="display:none">[\s\S]*?<\/div>/gi
	return body.replace(hiddenContent, ``).replace(multiBr, `<br>`)
}

/**
 * 判断是否为字符串
 * @param {any} x
 */
function isString(x) {
	return Object.prototype.toString.call(x) === `[object String]`
}

// https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
exports.renameKeys = R.curry((keysMap, obj) =>
	R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
)