import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"
import {AppModule} from "../src/app.module"

describe('Zhihu', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('create zhihu column article', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({query: `mutation createArticle {
                draftColumnArticle {
                    id
                }
            }`})
            .expect(200)
    })
})
