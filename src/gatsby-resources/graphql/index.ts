import * as Joi from "@hapi/joi"
import {sourceNodes} from "gatsby-source-graphql/gatsby-node"

const schema = {
    id: Joi.number(),
    typeName: Joi.string(),
    fieldName: Joi.string(),
    parent: Joi.any(),
    children: Joi.array(),
    internal: Joi.object(),
}

const nodes = []

const all = async () => {
    await sourceNodes({
        actions: {createNode: () => {
            const node = {id:"1234"}
            nodes.push(node);
        }},
        createNodeId: () => "1234",
        createContentDigest: () => "568"
    }, {})

    return nodes;
}

const read = async (context, id) => {
    return await all()
}

export {schema, read, all}
