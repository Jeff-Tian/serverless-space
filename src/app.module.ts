import {Module} from '@nestjs/common'
import {GraphQLModule} from '@nestjs/graphql'
import {ApolloServerPluginCacheControl, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24

@Module({
    imports: [CatsModule, RecipesModule, YuqueModule, GraphQLModule.forRoot({
        autoSchemaFile: true,
        sortSchema: true,
        playground: false,
        persistedQueries: {
            ttl: ONE_DAY_IN_SECONDS
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault(), ApolloServerPluginCacheControl({defaultMaxAge: ONE_DAY_IN_SECONDS})]
    })],
})
export class AppModule {
}
