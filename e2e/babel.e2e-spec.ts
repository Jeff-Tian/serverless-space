import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"
import {AppModule} from "../src/app.module"
import {testTargetUrl, transformedText} from '../src/test/constants'
import {nockIt} from "../src/babel-service/babel.service.spec";

describe('Babel', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
        nockIt(testTargetUrl)
    })

    it('transforms', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query transformTsx {
                transform (sourceCode: "class A {}") {
                    text
                }
            }`
            })
            .expect({
                data: {
                    transform: {
                        text: transformedText
                    }
                }
            })
            .expect(200)
    })

    it('transforms from url', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query transformTsx {
                transform (url: "${testTargetUrl}") {
                    text
                }
            }`
            })
            .expect(res => {
                expect(res.body).toMatchObject({data: {transform: {text: /"use strict";/}}})
            })
            .expect(200)
    })
})
