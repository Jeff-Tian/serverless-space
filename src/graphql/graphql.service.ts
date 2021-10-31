import {Injectable} from '@nestjs/common'
import { GraphQLResource } from './models/graphql.model'
import {all, read} from "../gatsby-resources/graphql"

@Injectable()
export class GraphqlService {
    async findOneById(id: string): Promise<GraphQLResource> {
        return read({}, id)[0] as GraphQLResource
    }

    async findAll(): Promise<GraphQLResource[]> {
        return (await all()) as GraphQLResource[]
    }
}
