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
import {ICloudModule} from "./icloud/icloud.module";

const ONE_HOUR_IN_SECONDS = 60 * 60

const isOnline = process.env.SLS_ORG_ID === '3f67c057-6e96-41d5-80bc-16bd888cb6bf';

const onlineGraphqlOptions: ApolloFederationDriverConfig = {
    driver: ApolloFederationDriver,
    // 由于线上环境，不能使用 fs 模块（文件系统不可写），所以这里不使用 autoSchemaFile
    // 而且，线上环境，不需要每次都生成 schema.gql 文件（不会变化）。
    typePaths: ['schema.gql'],
    autoSchemaFile: false,
    sortSchema: true,
    playground: true,
    persistedQueries: {
        ttl: ONE_HOUR_IN_SECONDS
    },
    plugins: [],
}

const localGraphqlOptions: ApolloFederationDriverConfig = {
    driver: ApolloFederationDriver,
    // 本地开发通过使用 autoSchemaFile，可以在每次启动时，自动生成 schema.gql 文件。
    // 从而可以享受到 Code First 的好处。
    autoSchemaFile: {path: 'schema.gql', federation: 2},
    sortSchema: true,
    playground: true,
    persistedQueries: {
        ttl: ONE_HOUR_IN_SECONDS
    },
    plugins: [],
}

let graphqlOptions: ApolloFederationDriverConfig = isOnline ? onlineGraphqlOptions : localGraphqlOptions;

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

@Module({
    imports: [
        YuqueModule,
        ClipboardModule,
        CatsModule,
        RecipesModule,
        ZhihuModule,
        ICloudModule,
        BabelModule,
        GraphQLModule.forRoot(graphqlOptions)
    ],
})
export class AppModule {
}
