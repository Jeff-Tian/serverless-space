import {Module} from '@nestjs/common'
import {GqlModuleOptions, GraphQLModule} from '@nestjs/graphql'
import {ApolloServerPluginCacheControl, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import {BaseRedisCache} from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import {GraphqlPluginModule} from "./graphql/graphql.plugin.module"
import { ZhihuModule } from './zhihu/zhihu.module'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const ONE_HOUR_IN_SECONDS = 60 * 60

let graphqlOptions: GqlModuleOptions = {
    autoSchemaFile: true,
    sortSchema: true,
    playground: false,
    persistedQueries: {
        ttl: ONE_HOUR_IN_SECONDS
    },
    plugins: [ApolloServerPluginLandingPageLocalDefault(), ApolloServerPluginCacheControl({defaultMaxAge: ONE_DAY_IN_SECONDS}), responseCachePlugin({}),
    ],
}

if (process.env['CACHE_URL']) {
    graphqlOptions.cache = new BaseRedisCache({
        client: new Redis(process.env['CACHE_URL']),
    })
}

@Module({
    imports: [CatsModule, RecipesModule, YuqueModule, ZhihuModule, GraphqlPluginModule, GraphQLModule.forRoot(graphqlOptions)],
})
export class AppModule {
}
