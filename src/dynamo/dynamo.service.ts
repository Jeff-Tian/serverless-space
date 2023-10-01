import {Injectable} from "@nestjs/common";
import util from "util";
import {
    CreateTableCommand, CreateTableInput,
    DynamoDBClient, GetItemCommand,
    PutItemCommand,
    PutItemInput, ScanCommand,
    UpdateTableCommand, UpdateTimeToLiveInput
} from "@aws-sdk/client-dynamodb";

const cacheTable = 'cache-table'

@Injectable()
export class DynamoService {
    private ddb: DynamoDBClient;

    constructor() {
        if (process.env.NODE_ENV === 'local') {
            console.log('connecting to local dynamodb !')

            this.ddb = new DynamoDBClient({
                endpoint: 'http://localhost:8000',
            })

            return
        }

        this.ddb = new DynamoDBClient({apiVersion: '2012-08-10'})
    }

    public async saveCache(key, value, created_at?, status?) {
        let params: PutItemInput = {
            TableName: cacheTable,
            Item: {
                cacheKey: {S: key},
                cacheValue: {S: value},
            }
        }

        if (typeof created_at !== 'undefined') {
            params.Item.created_at = {S: created_at}
        }

        if (typeof status !== 'undefined') {
            params.Item.status = {S: status}
        }

        try {
            return await this.ddb.send(new PutItemCommand(params))
        } catch (ex) {
            console.error(ex)
            return ex
        }
    }

    public async ensureCacheTable() {
        try {
            const params: CreateTableInput = {
                AttributeDefinitions: [
                    {
                        AttributeName: 'cacheKey',
                        AttributeType: 'S',
                    }
                ],
                TableName: cacheTable,
                KeySchema: [
                    {
                        AttributeName: 'cacheKey',
                        KeyType: 'HASH',
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
            }

            const createTableCommand = new CreateTableCommand(params)
            const res = await this.ddb.send(createTableCommand)
            console.log('table created: ', res)
            return res
        } catch (ex) {
            console.error(`大概率是表已存在，这个错误可以忽略： ${util.inspect(ex)}`)

            return Promise.resolve()
        }
    }

    public async ensureTtl() {
        const ttlConfig: UpdateTimeToLiveInput = {
            TableName: cacheTable,
            TimeToLiveSpecification: {
                Enabled: true,
                AttributeName: 'expiresAt'
            }
        }

        try {
            const updateTtlCommand = new UpdateTableCommand(ttlConfig)
            return await this.ddb.send(updateTtlCommand)
        } catch (ex) {
            console.error('ensureTtl error: ', ex)

            return Promise.resolve()
        }
    }

    async getAllCaches() {
        const scanCommand = new ScanCommand({TableName: cacheTable})
        const itemWrapper = await this.ddb.send(scanCommand)

        return itemWrapper.Items
    }

    async getCache(key: string) {
        const params = {
            TableName: cacheTable,
            Key: {
                cacheKey: {S: key}
            }
        }
        const getItemCommand = new GetItemCommand(params)
        const itemWrapper = await this.ddb.send(getItemCommand)
        return itemWrapper.Item?.cacheValue?.S
    }
}
