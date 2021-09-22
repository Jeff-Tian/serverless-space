import * as Joi from "@hapi/joi"

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

export {schema, read}
