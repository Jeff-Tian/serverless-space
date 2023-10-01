import {Injectable, Logger} from '@nestjs/common'
import {YuQue} from './models/yuque.model'
import {readBySlug, pluginOptions, context, sourceAllNodes} from '../gatsby-resources/yuque'
import {DynamoService} from "../dynamo/dynamo.service";
import {HttpService} from "@nestjs/axios";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import util from "util";

const yuqueCacheKeyPrefix = 'yuque'
const getYuqueCacheKey = id => `${yuqueCacheKeyPrefix}-${id}`

const byCreatedAt = (a1, a2) => {
    if (a1.created_at && a2.created_at) {
        return Math.sign(new Date(a2.created_at).getTime() - new Date(a1.created_at).getTime())
    }

    if (a1.created_at && !a2.created_at) {
        return -1
    }

    if (a2.created_at && !a1.created_at) {
        return 1
    }

    return 0
};

@Injectable()
export class YuqueService {
    private cachedPluginOptions: {
        writeCache: (articles) => Promise<void>;
        readCache: () => Promise<any>;
        repo: string;
        login: string
    };

    private readonly logger = new Logger(YuqueService.name);

    constructor(private readonly dynamoService: DynamoService, private readonly httpService: HttpService) {
        this.cachedPluginOptions = {
            ...pluginOptions, readCache: async () => {
                const items = await dynamoService.getAllCaches()
                return items.map(item => item?.cacheValue?.S).filter(Boolean).map(s => JSON.parse(s))
            }, writeCache: async (articles) => {
                await Promise.all(articles.map(article => dynamoService.saveCache(getYuqueCacheKey(article.id), JSON.stringify(article), String(article.created_at), String(article.status))))
            }
        }

        sourceAllNodes(context, this.cachedPluginOptions).then(({data}) => {
            (data ?? []).forEach(article => this.dynamoService.saveCache(getYuqueCacheKey(article.id), JSON.stringify(article), String(article.created_at), String(article.status)))
        }).catch(console.error)
    }

    async findOneBySlug(slug: string): Promise<YuQue> {
        const {data} = await readBySlug(slug)

        await this.dynamoService.saveCache(getYuqueCacheKey(data.id), JSON.stringify(data), String(data.created_at), String(data.status))

        return data
    }

    async findOneById(id: string): Promise<YuQue> {
        const res = await this.dynamoService.getCache(getYuqueCacheKey(id))
        if (res) {
            const yuqueArticle = JSON.parse(res)

            if ((!yuqueArticle.body || !yuqueArticle.body_html) && yuqueArticle.slug) {
                console.log('saving cache...', yuqueArticle)

                const {data} = await readBySlug(yuqueArticle.slug)

                await this.dynamoService.saveCache(getYuqueCacheKey(data.id), JSON.stringify(data), String(data.created_at), String(data.status))

                return data
            }

            return yuqueArticle
        }

        return undefined
    }

    async findAll(): Promise<YuQue[]> {
        const all = await this.dynamoService.getAllCaches()

        if (all && all.length > 0) {
            return all
                .filter(item => item?.status?.S?.toString() === '1')
                .sort((item1, item2) => byCreatedAt({created_at: item1?.created_at?.S}, {created_at: item2?.created_at?.S}))
                .map(item => item?.cacheValue?.S)
                .filter(Boolean)
                .map(s => JSON.parse(s))
                .filter(a => Number(a.status) === 1)
                .sort(byCreatedAt)
        }

        return []
    }

    async find(skip: number, take: number): Promise<YuQue[]> {
        const all = await this.findAll()
        return all.slice(skip, skip + take)
    }

    async workflow(payload) {
        this.logger.log(`Received webhook payload: ${JSON.stringify(payload)}`);

        const notifyWeCom = this.httpService.post('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8f57b747-5af9-4d42-bed8-541ba91fe9a5', {
            msgtype: 'markdown',
            markdown: {
                content: payload.data.body.substr(0, 2000),
                title: payload.data.title,
            }
        }).toPromise();

        const results = await Promise.all([notifyWeCom]);

        this.logger.log(`notification results: `, util.inspect(results));

        this.logger.log('notifying sqs...');

        const sqs = new SQSClient();
        const sendMessageCommand = new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: payload,
            MessageAttributes: {
                AttributeName: {
                    StringValue: "AttributeValue",
                    DataType: "String",
                }
            }
        })

        try {
            const sqsResult = await sqs.send(sendMessageCommand);
            this.logger.log(`sqs result: `, util.inspect(sqsResult));

            return [...results, sqsResult];
        } catch (ex) {
            console.error(ex);
            this.logger.error(`sqs error: `, ex);

            return results;
        }
    }
}
