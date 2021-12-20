import {Injectable} from '@nestjs/common'
import {YuQue} from './models/yuque.model'
import {readBySlug, pluginOptions, context, sourceNodes} from '../gatsby-resources/yuque'
import {DynamoService} from "../dynamo/dynamo.service";

const yuqueCacheKeyPrefix = 'yuque'
const getYuqueCacheKey = id => `${yuqueCacheKeyPrefix}-${id}`

@Injectable()
export class YuqueService {
    private cachedPluginOptions: { writeCache: (articles) => Promise<void>; readCache: () => Promise<any>; repo: string; login: string };
    private articles: YuQue[];

    constructor(private readonly dynamoService: DynamoService) {
        this.cachedPluginOptions = {
            ...pluginOptions, readCache: async () => {
                const items = await dynamoService.getAllCaches()
                return items.map(item => item?.cacheValue?.S).filter(Boolean).map(s => JSON.parse(s))
            }, writeCache: async (articles) => {
                await Promise.all(articles.map(article => dynamoService.saveCache(getYuqueCacheKey(article.id), JSON.stringify(article))))
            }
        }

        this.articles = null

        // sourceNodes(context, this.cachedPluginOptions).then(({data}) => {
        //     this.articles = data
        // })
    }

    async findOneBySlug(slug: string): Promise<YuQue> {
        const {data} = await readBySlug(slug)
        return data
    }

    async findOneById(id: string): Promise<YuQue> {
        // if (this.articles === null) {
        //     sourceNodes(context, this.cachedPluginOptions).then(({data}) => {
        //         this.articles = data
        //     })
        // }

        const res = await this.dynamoService.getCache(getYuqueCacheKey(id))
        if (res) {
            return JSON.parse(res)
        }

        sourceNodes(context, this.cachedPluginOptions).then(({data}) => {
            this.articles = data
        })

        return undefined
    }

    async findAll(): Promise<YuQue[]> {
        // if (this.articles === null) {
        //     sourceNodes(context, this.cachedPluginOptions).then(({data}) => {
        //         this.articles = data
        //     })
        // }

        const all = await this.dynamoService.getAllCaches()
        console.log('all = ', all)

        if(all && all.length > 0) {
            return all.map(item => item?.cacheValue?.S).filter(Boolean).map(s => JSON.parse(s))
        }

        sourceNodes(context, this.cachedPluginOptions).then(({data}) => {
            this.articles = data
        })

        return []
    }
}
