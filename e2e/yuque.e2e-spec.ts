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

    it('get article by hash', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({query: `query yuqueQuery {
                yuque(slug: "1234") {
                    id
                    title
                }
            }`})
            .expect({})
            .expect(200)
    })
})
