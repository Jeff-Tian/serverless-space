import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"

jest.mock(`@jeff-tian/gatsby-source-yuque/gatsby-node`, () => {
    return {
        sourceAllNodes: jest.fn().mockResolvedValue([]),
    }
});

import {AppModule} from "../src/app.module"
import {DynamoService} from "../src/dynamo/dynamo.service";
import {mockDynamoService} from "./fixtures/mocks";
import nock from "nock";

describe('Zhihu', () => {
    let app: INestApplication

    beforeAll(async () => {
        process.env.SYNC_GITHUB_PERSONAL_ACCESS_TOKEN = '5678'

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

    describe('triggers a sync from yuque article to zhihu column', () => {
        it('throws when token is wrong', async () => {
            nock('https://api.github.com').post('/repos/jeff-tian/sync/dispatches').reply(401)

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
                .expect(res => expect(res.body).toEqual(expect.objectContaining({
                    "data": null,
                    "errors": [
                        {
                            "extensions": {
                                "code": "INTERNAL_SERVER_ERROR",
                                "exception": {
                                    "config": {
                                        "data": "{\"event_type\":\"webhook\"}",
                                        "headers": {
                                            "Accept": "application/vnd.github.everest-preview+json",
                                            "Authorization": "token 5678",
                                            "Content-Length": 24,
                                            "Content-Type": "application/json",
                                            "User-Agent": "axios/0.23.0"
                                        },
                                        "maxBodyLength": -1,
                                        "maxContentLength": -1,
                                        "method": "post",
                                        "timeout": 0,
                                        "transformRequest": [
                                            null
                                        ],
                                        "transformResponse": [
                                            null
                                        ],
                                        "transitional": {
                                            "clarifyTimeoutError": false,
                                            "forcedJSONParsing": true,
                                            "silentJSONParsing": true
                                        },
                                        "url": "https://api.github.com/repos/jeff-tian/sync/dispatches",
                                        "xsrfCookieName": "XSRF-TOKEN",
                                        "xsrfHeaderName": "X-XSRF-TOKEN"
                                    },
                                    "status": 401
                                }
                            },
                            "locations": [
                                {
                                    "column": 21,
                                    "line": 2
                                }
                            ],
                            "message": "Request failed with status code 401",
                            "path": [
                                "syncYuqueToZhihu"
                            ]
                        }
                    ]
                })))
                .expect(200)
        })

        it('runs successfully when token is correct', async () => {
            nock('https://api.github.com').post('/repos/jeff-tian/sync/dispatches').reply(204)

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
                    data: {
                        syncYuqueToZhihu: {
                            slug: 'abc'
                        }
                    }
                })
                .expect(200)
        })
    })

})
