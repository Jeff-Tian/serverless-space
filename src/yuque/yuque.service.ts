import {Injectable} from '@nestjs/common'
import {YuQue} from './models/yuque.model'
import {readBySlug, pluginOptions, context, sourceAllNodes} from '../gatsby-resources/yuque'
import {DynamoService} from "../dynamo/dynamo.service";

const yuqueCacheKey = 'yuque'

@Injectable()
export class YuqueService {
    private cachedPluginOptions: { writeCache: (articles) => Promise<void>; readCache: () => Promise<any>; repo: string; login: string };
    private articles: YuQue[];

    constructor(private readonly dynamoService: DynamoService) {
        this.cachedPluginOptions = {
            ...pluginOptions, readCache: async () => {
                const json = await dynamoService.getCache(yuqueCacheKey)
                return JSON.parse(json)
            }, writeCache: async (articles) => {
                await dynamoService.saveCache(yuqueCacheKey, JSON.stringify(articles))
            }
        }
        this.articles = null
    }

    async findOneBySlug(slug: string): Promise<YuQue> {
        const {data} = await readBySlug(slug)
        return data
    }

    async findOneById(id: string): Promise<YuQue> {
        if(this.articles === null) {
            this.articles = await this.findAll()
        }

        if(!this.articles){
            return undefined
        }

        const [a] = this.articles.filter(article => article.id === id)

        return a
    }

    async findAll(): Promise<YuQue[]> {
        this.articles = (await sourceAllNodes(context, this.cachedPluginOptions)).data;
        return this.articles as YuQue[]
    }
}
