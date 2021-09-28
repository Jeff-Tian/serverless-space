import * as Joi from "@hapi/joi"


describe("joi", () => {
    it('has _type and _meta', () => {
        const joiSchema = Joi.object().keys({
            id: Joi.string(),
            _typeName: Joi.string()
        })

        const cons = joiSchema.meta({})

        expect(cons._type).toBeDefined()
        expect(cons._type).toEqual('object')

        expect(cons._meta).toBeDefined()
        expect(cons._meta.length).toBeGreaterThanOrEqual(1)
    })
})
