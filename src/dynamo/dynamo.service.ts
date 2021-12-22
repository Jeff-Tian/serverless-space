import {Injectable} from "@nestjs/common";
import {DynamoDB, Endpoint} from "aws-sdk";
import util from "util";
import {CreateTableInput} from "aws-sdk/clients/dynamodb";

const cacheTable = 'cache-table'

@Injectable()
export class DynamoService {
    private ddb: DynamoDB;

    constructor() {
        if (process.env.NODE_ENV === 'local') {
            console.log('connecting to local dynamodb !')

            this.ddb = new DynamoDB({
                endpoint: new Endpoint('http://localhost:8000'),
            })

            return
        }

        this.ddb = new DynamoDB({apiVersion: '2012-08-10'})
    }

    public async saveCache(key, value) {
        await this.ensureCacheTable()
        const params = {
            TableName: cacheTable,
            Item: {
                cacheKey: {S: key},
                cacheValue: {S: value}
            }
        }

        try {
            console.log('saving to cache: ', params)
            const res = await this.ddb.putItem(params).promise()
            console.log('saving cache result = ', res)
            return res
        } catch (ex) {
            console.error(ex)
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

            const res = await this.ddb.createTable(params).promise()
            console.log('table created: ', res)
            return res
        } catch (ex) {
            console.error(`大概率是表已存在，这个错误可以忽略： ${util.inspect(ex)}`)

            return Promise.resolve()
        }
    }

    async getAllCaches() {
        const itemWrapper = await this.ddb.scan({
            TableName: cacheTable
        }).promise()

        return itemWrapper.Items
    }

    async getCache(key: string) {
        console.log('getting cache by ', key)
        const params = {
            TableName: cacheTable,
            Key: {
                cacheKey: {S: key}
            }
        }
        const itemWrapper = await this.ddb.getItem(params).promise()
        return itemWrapper.Item?.cacheValue?.S
    }
}