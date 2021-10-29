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

const ONE_DAY_IN_SECONDS = 60 * 60 * 24

let graphqlOptions: GqlModuleOptions = {
    autoSchemaFile: true,
    sortSchema: true,
    playground: false,
    persistedQueries: {
        ttl: ONE_DAY_IN_SECONDS
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
    imports: [CatsModule, RecipesModule, YuqueModule, GraphqlPluginModule, GraphQLModule.forRoot(graphqlOptions)],
})
export class AppModule {
}
