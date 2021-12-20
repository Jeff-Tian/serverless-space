import {DynamoService} from "./dynamo.service";


export const mockDynamoDB = {
    items: [],
    createTable: jest.fn().mockImplementation((params)=>{
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
}

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: jest.fn(() => mockDynamoDB),
    }
})
describe('dynamo', () => {
    const sut = new DynamoService();
    const cacheKey = 'key'
    const cacheValue = 'value'

    it('creates table if not exists', async () => {
        expect(sut.ensureCacheTable).toBeDefined();
    })

    it('saves', async () => {
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

    it('gets value', async()=>{
        const res = await sut.getCache(cacheKey)
        expect(res).toStrictEqual(cacheValue)
    })

    it('gets value not exists', async()=>{
        const res = await sut.getCache('not exists')
        expect(res).toStrictEqual(undefined)
    })
})