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


export const mockDynamoDB = {
    items: [],
    send: jest.fn().mockImplementation((params) => {
        const {type, params: unwrappedParams} = params
        console.log('input = ', JSON.stringify(params))
        if (type === 'put-item') {
            mockDynamoDB.items.push(unwrappedParams.Item)
            return Promise.resolve(true)
        }
        if (type === 'get-item') {
            return Promise.resolve({Item: mockDynamoDB.items.filter((item) => unwrappedParams.Key.cacheKey.S === item.cacheKey.S)[0]})
        }
    })
}

jest.mock('@aws-sdk/client-dynamodb', () => {
    return {
        DynamoDBClient: jest.fn(() => mockDynamoDB),
        PutItemCommand: jest.fn().mockImplementation((params) => ({type: 'put-item', params})),
        GetItemCommand: jest.fn().mockImplementation((params) => ({type: 'get-item', params}))
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
