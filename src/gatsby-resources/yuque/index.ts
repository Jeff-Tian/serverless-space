import * as Joi from "@hapi/joi"
import {sourceNodes} from "@jeff-tian/gatsby-source-yuque/dist/gatsby-node.js"
import {sourceNode, sourceAllNodes} from "@jeff-tian/gatsby-source-yuque/dist/helpers.js"

const schema = {
    id: Joi.number(),
    title: Joi.string(),
    description: Joi.string(),
    custom_description: Joi.string(),
    updated_at: Joi.string(),
    created_at: Joi.string(),
    slug: Joi.string(),
    word_count: Joi.number(),
    cover: Joi.string(),
    body: Joi.string(),
}

let articles = null

const context = {
    reporter: {
        panic: console.error,
        info: console.log,
        error: console.error
    },
    actions: {
        createNode: () => ({})
    },
    emitter: {
        on: console.log
    },
    createNodeId: () => 'abcd',
    createContentDigest: () => 'aaaa'
}

const pluginOptions = {login: 'tian-jie', repo: `blog`}

const readArticles = async () => {
    if (articles) {
        return articles
    }

    articles = await sourceAllNodes(context, pluginOptions)

    return articles.data
}

const read = async (context, id) => {
    const articles = await readArticles()

    return articles.filter(a => String(a.id) === String(id))[0]
}

const all = readArticles

const readBySlug = async (slug) => {
    return sourceNode(context, pluginOptions, slug)
}

export {schema, read, all, readBySlug, context, sourceAllNodes, pluginOptions, sourceNodes}
