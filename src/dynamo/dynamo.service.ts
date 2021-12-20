import {Injectable} from "@nestjs/common";
import {DynamoDB} from "aws-sdk";
import util from "util";
import {CreateTableInput} from "aws-sdk/clients/dynamodb";

const cacheTable = 'cache-table'

@Injectable()
export class DynamoService {
    private ddb: DynamoDB;

    constructor() {
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
            await this.ddb.putItem(params).promise()
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

            return await this.ddb.createTable(params).promise()
        } catch (ex) {
            console.error(`大概率是表已存在，这个错误可以忽略： ${util.inspect(ex)}`)

            return Promise.resolve()
        }
    }

    async getCache(key: string) {
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