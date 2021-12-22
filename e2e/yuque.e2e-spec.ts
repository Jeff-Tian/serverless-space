import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AppModule } from "../src/app.module"
import nock from 'nock'

jest.mock('aws-sdk')

describe('Yuque', () => {
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
        process.env.YUQUE_TOKEN = '1234'
        
        nock('https://www.yuque.com/api/v2/').get(/.+/).reply(200, {data:{id: '61880244', title: 'abc'}})
        
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query yuqueQuery {
                yuque(slug: "bhagcw") {
                    id
                    title
                }
            }`})
            .expect({ data: { yuque: { id: '61880244', title: 'abc' } } })
            .expect(200)
    })
})
