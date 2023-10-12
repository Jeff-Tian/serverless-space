import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"

jest.mock(`@jeff-tian/gatsby-source-yuque/dist/gatsby-node`, () => {
    return {
        sourceAllNodes: jest.fn().mockResolvedValue([]),
    }
});

import {AppModule} from "../src/app.module"
import {DynamoService} from "../src/dynamo/dynamo.service";
import {mockDynamoService} from "./fixtures/mocks";
import nock from "nock";

describe('Zhihu', () => {
    let app: INestApplication

    beforeAll(async () => {
        process.env.SYNC_GITHUB_PERSONAL_ACCESS_TOKEN = '5678'

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(DynamoService)
            .useValue(mockDynamoService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('create zhihu column article', async () => {
        nock('https://zhuanlan.zhihu.com').post('/api/articles/drafts').reply(200, {})

        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `mutation createArticle {
                draftColumnArticle {
                    id
                }
            }`
            })
            .expect(200)
    })
})
