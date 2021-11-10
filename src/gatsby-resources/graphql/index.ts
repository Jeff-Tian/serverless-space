import * as Joi from "@hapi/joi"
import {sourceNodes, createSchemaCustomization} from "gatsby-source-graphql/gatsby-node"

const schema = {
    id: Joi.number(),
    typeName: Joi.string(),
    fieldName: Joi.string(),
    // parent: Joi.any(),
    // children: Joi.array(),
    // internal: Joi.object(),
}

const nodes = []

const all = async () => {
    const actions = {
        createNode: () => {
            const node = {id: "1234", fieldName: "test", typeName: "again"}
            nodes.push(node);
        },
        addThirdPartySchema: () => ({})
    }

    const createNodeId = () => "1234"

    const innerCache = {}
    const cache = {
        get: async (key) => innerCache[key],
        set: async (key, value) => {
            innerCache[key] = value
        }
    }

    await createSchemaCustomization({actions, createNodeId, cache}, {
        typeName: "GitHub",
        fieldName: "github",
        url: "https://api.github.com/graphql",
        // HTTP headers
        headers: {
            // Learn about environment variables: https://gatsby.dev/env-vars
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        // Additional options to pass to node-fetch
        fetchOptions: {},
    })

    await sourceNodes({
        actions,
        createNodeId,
        createContentDigest: () => "568"
    }, {})

    return nodes;
}

const read = async (context, id) => {
    return await all()
}

export {schema, read, all}
