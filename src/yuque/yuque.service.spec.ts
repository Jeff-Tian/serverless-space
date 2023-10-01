import {Mock} from 'ts-mockery'

jest.mock(`@jeff-tian/gatsby-source-yuque/dist/gatsby-node`, () => {
    return {
        sourceAllNodes: jest.fn().mockResolvedValue([]),
    }
});
import {YuqueService} from "./yuque.service";
import {DynamoService} from "../dynamo/dynamo.service";
import {HttpService} from "@nestjs/axios";

describe('yuque service', () => {
    const mockGetAllCaches = jest.fn()
    const mockDynamoService = Mock.of<DynamoService>({getAllCaches: mockGetAllCaches})
    const mockHttpService = Mock.of<HttpService>();
    const sut = new YuqueService(mockDynamoService, mockHttpService)

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
            },
            status: {S: '1'},
            created_at: {S: '2020-1-1'}
        },
            {
                cacheValue: {S: JSON.stringify({created_at: '2021-1-1', status: 1})},
                status: {S: '1'},
                created_at: {S: '2021-1-1'}
            }
        ])
        const res = await sut.findAll()
        expect(res).toStrictEqual([{created_at: '2021-1-1', status: 1}, {created_at: '2020-1-1', status: 1}])
    })

    it('treats no created_at article as old articles', async () => {
        mockGetAllCaches.mockReturnValue([{
            cacheValue: {
                S: JSON.stringify({
                    created_at: '',
                    status: 1
                }),
            },
            created_at: {S: ''},
            status: {S: '1'}
        },
            {
                cacheValue: {S: JSON.stringify({created_at: '2021-1-1', status: 1})},
                created_at: {S: '2021-1-1'},
                status: {S: '1'}
            }])
        const res = await sut.findAll()
        expect(res).toStrictEqual([{created_at: '2021-1-1', status: 1}, {created_at: '', status: 1}])
    })

    it('only returns live articles', async () => {
        mockGetAllCaches.mockReturnValue([
            {cacheValue: {S: JSON.stringify({status: 1})}, status: {S: '1'}},
            {cacheValue: {S: JSON.stringify({status: 0})}, status: {S: '0'}},
            {cacheValue: {S: JSON.stringify({status: null})}, status: {S: null}}
        ])

        const res = await sut.findAll()
        expect(res).toStrictEqual([{status: 1}])
    })

    it('supports pagination for (skip = 1, take = 2)', async () => {
        mockGetAllCaches.mockReturnValue([{
            cacheValue: {
                S: JSON.stringify({
                    status: 1,
                    slug: '1'
                })
            },
            status: {S: '1'},
        },
            {cacheValue: {S: JSON.stringify({status: 1, slug: '2'})}, status: {S: '1'}},
            {
                cacheValue: {
                    S: JSON.stringify({
                        status: 1,
                        slug: '3'
                    })
                },
                status: {S: '1'}
            }])
        const res = await sut.find(1, 2)
        expect(res).toStrictEqual([{status: 1, slug: '2'}, {status: 1, slug: '3'}])
    })
})
