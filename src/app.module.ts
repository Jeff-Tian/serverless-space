import {Module} from '@nestjs/common'
import {GraphQLModule} from '@nestjs/graphql'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'
import {BaseRedisCache} from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import {BabelModule} from './babel-service/babel.module'
import {ZhihuModule} from "./zhihu/zhihu.module";
import util from "util";
import {ClipboardModule} from "./clipboard/clipboard.module";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";

const ONE_HOUR_IN_SECONDS = 60 * 60

const isOnline = process.env.ONLINE === 'true';

console.log(`isOnline = ${isOnline}`)

let graphqlOptions: ApolloFederationDriverConfig = {
    driver: ApolloFederationDriver,
    autoSchemaFile: isOnline ? {path: 'schema.gql', federation: 2} : true,
    sortSchema: true,
    playground: true,
    persistedQueries: {
        ttl: ONE_HOUR_IN_SECONDS
    },
    plugins: [],
}

const cacheRedisUrl = process.env.CACHE_URL

if (cacheRedisUrl && cacheRedisUrl !== 'undefined') {
    const redis = new Redis(cacheRedisUrl, {maxRetriesPerRequest: 1})
    redis.on('error', error => {
        console.error(`碰到 Redis （CACHE_URL = ${cacheRedisUrl}, type = ${cacheRedisUrl}） 错误： ${util.inspect(error)}`)
    })
    redis.on('connect', () => {
        graphqlOptions.cache = new BaseRedisCache({
            client: redis,
        })
    })
}

const yuqueToken = process.env.YUQUE_TOKEN

const modules = [ClipboardModule, CatsModule, RecipesModule, ZhihuModule, BabelModule, GraphQLModule.forRoot(graphqlOptions)]

if (yuqueToken && yuqueToken !== 'undefined') {
    modules.push(YuqueModule)
}

@Module({
    imports: modules,
})
export class AppModule {
}
