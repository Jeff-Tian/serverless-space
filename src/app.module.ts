import {Module} from '@nestjs/common'
import {GraphQLModule} from '@nestjs/graphql'
import {ApolloServerPluginCacheControl, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import {BaseRedisCache} from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import {GraphqlPluginModule} from "./graphql/graphql.plugin.module"
import {BabelModule} from './babel-service/babel.module'
import {ZhihuModule} from "./zhihu/zhihu.module";
import util from "util";
import {ClipboardModule} from "./clipboard/clipboard.module";
import {GatewayModule} from "./gateway/gateway.module";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";

const ONE_HOUR_IN_SECONDS = 60 * 60

let graphqlOptions: ApolloDriverConfig = {
    driver: ApolloDriver,
    autoSchemaFile: true,
    sortSchema: true,
    playground: false,
    persistedQueries: {
        ttl: ONE_HOUR_IN_SECONDS
    },
    plugins: [ApolloServerPluginLandingPageLocalDefault(), ApolloServerPluginCacheControl({defaultMaxAge: 5}), responseCachePlugin({}),
    ],
}

if (process.env['CACHE_URL']) {
    const redis = new Redis(process.env['CACHE_URL'], {maxRetriesPerRequest: 1})
    redis.on('error', error => {
        console.error(`碰到 Redis 错误： ${util.inspect(error)}`)
    })
    redis.on('connect', () => {
        graphqlOptions.cache = new BaseRedisCache({
            client: redis,
        })
    })
}

@Module({
    imports: [ClipboardModule, CatsModule, RecipesModule, YuqueModule, ZhihuModule, BabelModule, GraphqlPluginModule, GraphQLModule.forRoot<ApolloDriverConfig>(graphqlOptions)],
    providers: []
})
export class AppModule {
}
