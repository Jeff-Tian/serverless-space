import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import request from "supertest"

jest.mock(`@jeff-tian/gatsby-source-yuque/dist/gatsby-node`, () => {
    return {
        sourceAllNodes: jest.fn().mockResolvedValue([]),
    }
});
import {DynamoService} from "../src/dynamo/dynamo.service";
import {ClipboardModule} from "../src/clipboard/clipboard.module";
import {GraphQLModule} from "@nestjs/graphql";
import {mockDynamoService} from "./fixtures/mocks";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";


jest.setTimeout(10000)
describe('clipboard', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ClipboardModule, GraphQLModule.forRoot<ApolloDriverConfig>({
                driver: ApolloDriver,
                autoSchemaFile: true,
                sortSchema: true,
                playground: false,
            })
            ],
        })
            .overrideProvider(DynamoService)
            .useValue(mockDynamoService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('saves the clipboard', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                variables: {
                    clipboard: {
                        key: 'key',
                        value: 'value'
                    }
                },
                query: `mutation SaveToClipboard ($clipboard: ClipboardInput!) {
                    copyToClipboard(clipboard: $clipboard) {
                        key
                        value
                    }
            }`
            })
            .expect({data: {copyToClipboard: {key: 'key', value: 'value'}}})
            .expect(200)
    })

    it('gets the clipboard', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `query QueryClipboard {
                    clipboard(key: "key") {
                        key
                        value
                    }
            }`
            })
            .expect({data: {clipboard: {key: 'key', value: 'value'}}})
            .expect(200)
    })
})
