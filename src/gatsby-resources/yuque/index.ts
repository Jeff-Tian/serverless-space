import { sourceAllNodes, sourceNode, sourceNodes } from "@jeff-tian/gatsby-source-yuque/dist/gatsby-node"

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

export { read, all, readBySlug, context, sourceAllNodes, pluginOptions, sourceNodes }
