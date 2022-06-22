import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"
import {AppModule} from "../src/app.module"
import {DynamoService} from "../src/dynamo/dynamo.service";
import {mockDynamoService} from "./fixtures/mocks";

describe('Zhihu', () => {
    let app: INestApplication

    beforeAll(async () => {
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

    it('triggers a sync from yuque article to zhihu column', async () => {
        return request(app.getHttpServer()).post('/graphql')
            .send({
                query: `mutation triggerArticleSync ($slug: String!) {
                    syncYuqueToZhihu (slug: $slug) {
                        slug
                    }
                }`,
                variables: {
                    slug: 'abc'
                }
            })
            .expect({
                data:{
                    syncYuqueToZhihu: {
                        slug: 'abc'
                    }
                }
            })
            .expect(200)
    })
})
