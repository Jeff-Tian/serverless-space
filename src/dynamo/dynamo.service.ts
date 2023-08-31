import {Injectable} from "@nestjs/common";
import {DynamoDB, Endpoint} from "aws-sdk";
import util from "util";
import {CreateTableInput} from "aws-sdk/clients/dynamodb";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import UpdateTimeToLiveInput = DocumentClient.UpdateTimeToLiveInput;

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

    public async saveCache(key, value, created_at?, status?) {
        let params: DynamoDB.Types.PutItemInput = {
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
            return await this.ddb.putItem(params).promise()
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

            const res = await this.ddb.createTable(params).promise()
            console.log('table created: ', res)
            return res
        } catch (ex) {
            console.error(`大概率是表已存在，这个错误可以忽略： ${util.inspect(ex)}`)

            return Promise.resolve()
        }
    }

    public async ensureTtl() {
        const ttlConfig = {
            TableName: cacheTable,
            TimeToLiveSpecification: {
                Enabled: true,
                AttributeName: 'expiresAt'
            }
        }

        try {
            return await this.ddb.updateTimeToLive(ttlConfig as UpdateTimeToLiveInput).promise()
        } catch (ex) {
            console.error('ensureTtl error: ', ex)

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
