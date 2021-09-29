const path = require(`path`)
const process = require(`process`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { escapeSpecialCharacters } = require('./escape-special-characters')

const cwd = process.cwd()
const token = process.env.YUQUE_TOKEN

const getAllArticles = require(`./download`)
const { formatDate, formatArray } = require(`./utils`)

exports.sourceNodes = async (context, pluginOptions) => {
	const {
		actions: { createNode },
		createNodeId,
		createContentDigest,
		reporter
	} = context

	const {
		baseUrl = `https://www.yuque.com/api/v2/`,
		login = ``,
		repo = ``,
		mdNameFormat = `title`,
		timeout = 10000
	} = pluginOptions

	delete pluginOptions.plugins

	if (!login || !repo) {
		return
	}

	if (!token) {
		reporter.error(`TOKEN of yuque is required.`)
		return
	}

	const config = {
		namespace: `${login}/${repo}`,
		yuquePath: path.join(cwd, `yuque.json`),
		baseUrl,
		timeout,
		token
	}

	const articles = await getAllArticles(context, config)

	articles.forEach(createArticle(mdNameFormat, createNodeId, createContentDigest, createNode))

	return articles
}

exports.createResolvers = async ({
	actions: { createNode },
	cache,
	createNodeId,
	createResolvers,
	store,
	reporter,
}) => {
	createResolvers({
		YuqueDoc: {
			coverImg: {
				type: `File`,
				resolve(source) {
					if (source.cover && !source.cover.includes(`svg`)) {
						return createRemoteFileNode({
							url: source.cover,
							store,
							cache,
							createNode,
							createNodeId,
							reporter,
						})
					}
				},
			},
		},
	})
}

function createArticle(mdNameFormat, createNodeId, createContentDigest, createNode) {
	return article => {
		const slug = mdNameFormat === `title` ? article.title : article.slug

		const template = `---
stackbit_url_path: posts/${slug}
title: '${escapeSpecialCharacters(article.title.replace(/^@/, ``))}'
date: '${article.date || formatDate(article.created_at)}'
excerpt: >-
	${escapeSpecialCharacters(article.excerpt)}
tags: ${formatArray(article.tags)}
categories: ${formatArray(article.categories)}
template: post
---

${escapeSpecialCharacters(article.body)}`

		const yuqueDocNode = {
			...article,
			excerpt: escapeSpecialCharacters(article.excerpt),
			title: escapeSpecialCharacters(article.title),
			body: escapeSpecialCharacters(article.body),
			id: createNodeId(`yuque-doc-${article.id}`),
			slug,
			parent: null,
			children: [],
			internal: {
				type: `YuqueDoc`,
				mediaType: `text/markdown`,
				content: template,
				contentDigest: createContentDigest(article)
			}
		}
		createNode(yuqueDocNode)
	}
}
