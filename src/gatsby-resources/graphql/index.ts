import * as Joi from "@hapi/joi"
import {sourceNodes} from "gatsby-source-graphql/gatsby-node"

const schema = {
    id: Joi.number()
}

const all = async () => {
    return await sourceNodes({
        actions: {createNode: () => ({})},
        createNodeId: () => "1234",
        createContentDigest: () => "568"
    }, {})
}

const read = async (context, id) => {
    return await all()
}

export {schema, read, all}
