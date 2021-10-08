import {Module} from '@nestjs/common'
import {GraphQLModule} from '@nestjs/graphql'
import {CatsModule} from "./cats/cats.module"
import {RecipesModule} from "./recipes/recipes.module"
import {YuqueModule} from './yuque/yuque.module'

@Module({
    imports: [CatsModule, RecipesModule, YuqueModule, GraphQLModule.forRoot({
        autoSchemaFile: true, sortSchema: true, playground: true
    })],
})
export class AppModule {
}
