import * as Joi from "@hapi/joi"
import {sourceNodes} from "@jeff-tian/gatsby-source-yuque/gatsby-node"

const schema = {
    path: Joi.string(),
    id: Joi.string(),
    content: Joi.string(),
}

const read = async (context, id) => {
    return {
        id, path: id, content: JSON.stringify(context)
    }
}

const all = async (context) => {
    sourceNodes({
        reporter: {
            panic: console.error,
            info: console.log
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
    return []
}

export {schema, read, all}
