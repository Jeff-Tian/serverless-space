import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"

jest.mock(`@jeff-tian/gatsby-source-yuque/dist/gatsby-node`, () => {
    return {
        sourceAllNodes: jest.fn().mockResolvedValue([]),
        sourceNode: jest.fn().mockResolvedValue({data: {id: '61880244', title: 'abc'}}),
    }
});

process.env.YUQUE_TOKEN = '1234'
import {AppModule} from "../src/app.module"
import nock from 'nock'
import {One_Month_In_Seconds} from "../src/yuque/yuque.resolver";

const mockDynamoDB = {
    items: [],
    createTable: jest.fn().mockImplementation((params) => {
        return mockDynamoDB
    }),
    putItem: jest.fn().mockImplementation((params) => {
        mockDynamoDB.items.push(params.Item)
        return mockDynamoDB
    }),
    getItem: jest.fn().mockImplementation((params) => {
        const [res] = mockDynamoDB.items.filter((item) => params.Key.cacheKey.S === item.cacheKey.S)

        return {promise: () => Promise.resolve({Item: res})}
    }),
    promise: jest.fn().mockReturnValue(Promise.resolve()),
    updateTimeToLive: jest.fn().mockImplementation(() => {
        return {promise: () => Promise.resolve(true)}
    })
}

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: jest.fn(() => mockDynamoDB),
    }
})

describe('Yuque', () => {
    let app: INestApplication

    beforeAll(async () => {
        nock('https://www.yuque.com/api/v2/').persist().get(/.+/).reply(200, {data: {id: '61880244', title: 'abc'}})

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('gets article by hash', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query yuqueQuery {
                yuque(slug: "bhagcw") {
                    id
                    title
                }
            }`
            })
            .expect({data: {yuque: {id: '61880244', title: 'abc'}}})
            .expect(200)
    })

    it('gets article by hash and caches for 1 month', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query yuqueQuery {
                yuque(slug: "bhagcw") {
                    id
                    title
                }
            }`
            })
            .expect('cache-control', `max-age=${One_Month_In_Seconds}, public`)
            .expect(200)
    })
})
