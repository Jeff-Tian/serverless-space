import {NotFoundException} from '@nestjs/common'
import {Args, Query, Resolver} from '@nestjs/graphql'
import {GraphqlService} from "./graphql.service"
import {GraphQLResource} from "./models/graphql.model"

@Resolver(of => GraphQLResource)
export class GraphqlResolver {
    constructor(private readonly graphqlService: GraphqlService) {
    }

    @Query(returns => GraphQLResource)
    async graphql(@Args('id') id: string): Promise<GraphQLResource> {
        const recipe = await this.graphqlService.findOneById(id)
        if (!recipe) {
            throw new NotFoundException(id)
        }
        return recipe
    }

    @Query(returns => [GraphQLResource])
    allGraphql(): Promise<GraphQLResource[]> {
        return this.graphqlService.findAll()
    }
}
