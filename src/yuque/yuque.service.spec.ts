import {Mock} from 'ts-mockery'
import {YuqueService} from "./yuque.service";
import {DynamoService} from "../dynamo/dynamo.service";

describe('yuque service', () => {
    const mockGetAllCaches = jest.fn()
    const mockDynamoService = Mock.of<DynamoService>({getAllCaches: mockGetAllCaches})
    const sut = new YuqueService(mockDynamoService)

    beforeEach(() => {
        mockGetAllCaches.mockReset();
    })

    it('returns empty if no cache', async () => {
        mockGetAllCaches.mockReturnValue([])
        const res = await sut.findAll()

        expect(res).toStrictEqual([])
    })

    it('sorts yuque articles by created_at desc by default', async () => {
        mockGetAllCaches.mockReturnValue([{
            cacheValue: {
                S: JSON.stringify({
                    created_at: '2020-1-1',
                    status: 1
                })
            }
        }, {cacheValue: {S: JSON.stringify({created_at: '2021-1-1', status: 1})}}])
        const res = await sut.findAll()
        expect(res).toStrictEqual([{created_at: '2021-1-1', status: 1}, {created_at: '2020-1-1', status: 1}])
    })

    it('treats no created_at article as old articles', async () => {
        mockGetAllCaches.mockReturnValue([{
            cacheValue: {
                S: JSON.stringify({
                    created_at: '',
                    status: 1
                })
            }
        }, {cacheValue: {S: JSON.stringify({created_at: '2021-1-1', status: 1})}}])
        const res = await sut.findAll()
        expect(res).toStrictEqual([{created_at: '2021-1-1', status: 1}, {created_at: '', status: 1}])
    })

    it('only returns live articles', async () => {
        mockGetAllCaches.mockReturnValue([{cacheValue: {S: JSON.stringify({status: 1})}}, {cacheValue: {S: JSON.stringify({status: 0})}}, {cacheValue: {S: JSON.stringify({status: null})}}])
        const res = await sut.findAll()
        expect(res).toStrictEqual([{status: 1}])
    })
})