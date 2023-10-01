import {DynamoService} from "./dynamo.service";

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
describe('dynamodb', () => {
    const sut = new DynamoService();
    const cacheKey = 'key'
    const cacheValue = 'value'

    beforeEach(() => {
        mockDynamoDB.items = []
    })

    it('creates table if not exists', async () => {
        expect(sut.ensureCacheTable).toBeDefined();
    })

    it('saves with status and created_at', async () => {
        await sut.saveCache(cacheKey, cacheValue, 'created_at', 'status')
        expect(mockDynamoDB.items.length).toBe(1);

        const [cache] = mockDynamoDB.items
        expect(cache).toStrictEqual({
            "cacheKey": {
                "S": cacheKey
            },
            "cacheValue": {
                "S": cacheValue
            },
            "created_at": {"S": 'created_at'},
            "status": {"S": 'status'}
        })
    })

    it('saves without status and created_at', async () => {
        await sut.saveCache(cacheKey, cacheValue)
        expect(mockDynamoDB.items.length).toBe(1);

        const [cache] = mockDynamoDB.items
        expect(cache).toStrictEqual({
            "cacheKey": {
                "S": cacheKey
            },
            "cacheValue": {
                "S": cacheValue
            }
        })
    })

    it('gets value', async () => {
        await sut.saveCache(cacheKey, cacheValue)

        const res = await sut.getCache(cacheKey)
        expect(res).toStrictEqual(cacheValue)
    })

    it('gets value not exists', async () => {
        const res = await sut.getCache('not exists')
        expect(res).toStrictEqual(undefined)
    })

    it('ensures ttl config', async () => {
        expect(sut.ensureTtl).toBeDefined();
    })
})
