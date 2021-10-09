import {Module} from '@nestjs/common'
import {GraphQLModule, getApolloServer} from '@nestjs/graphql'
import {ApolloServerPluginCacheControl, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'


@Module({
    imports: [CatsModule, RecipesModule, YuqueModule, GraphQLModule.forRoot({
        autoSchemaFile: true,
        sortSchema: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault(), ApolloServerPluginCacheControl({defaultMaxAge: 60 * 60 * 24})]
    })],
})
export class AppModule {
}
