import * as Joi from "@hapi/joi"
import { sourceNodes, sourceNode } from "@jeff-tian/gatsby-source-yuque/gatsby-node"

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

const pluginOptions = { login: 'tian-jie', repo: `blog` }

const readArticles = async () => {
    if (articles) {
        return articles
    }

    articles = await sourceNodes(context, pluginOptions)

    return articles
}

const read = async (context, id) => {
    const articles = await readArticles()

    return articles.filter(a => String(a.id) === String(id))[0]
}

const all = readArticles

const readBySlug = async (slug) => {
    return sourceNode(context, pluginOptions, slug)
}

export { schema, read, all, readBySlug }
