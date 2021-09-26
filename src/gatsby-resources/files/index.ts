import * as Joi from "@hapi/joi"
import {sourceNodes} from "gatsby-source-filesystem/gatsby-node"

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
            panic: console.error
        },
        actions: {
            createNode: () => ({})
        },
        emitter: {
            on: console.log
        },
        createNodeId: () => 'abcd'
    }, {path: 'src'})
    return []
}

export {schema, read, all}
