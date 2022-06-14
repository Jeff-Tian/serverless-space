import {Injectable} from '@nestjs/common'
import {YuQue} from './models/yuque.model'
import {readBySlug, pluginOptions, context, sourceAllNodes} from '../gatsby-resources/yuque'
import {DynamoService} from "../dynamo/dynamo.service";

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
    private cachedPluginOptions: { writeCache: (articles) => Promise<void>; readCache: () => Promise<any>; repo: string; login: string };

    constructor(private readonly dynamoService: DynamoService) {
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
}
