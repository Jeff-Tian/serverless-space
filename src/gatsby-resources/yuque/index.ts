import * as Joi from "@hapi/joi"
import {sourceNodes} from "@jeff-tian/gatsby-source-yuque/gatsby-node"

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

const readArticles = async () => {
    if (articles) {
        return articles
    }

    articles = await sourceNodes({
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
    }, {login: 'tian-jie', repo: `blog`})

    return articles
}

const read = async (context, id) => {
    const articles = await readArticles()

    return articles.filter(a => String(a.id) === String(id))[0]
}

const all = async () => {
    return await readArticles()
}

export {schema, read, all}
