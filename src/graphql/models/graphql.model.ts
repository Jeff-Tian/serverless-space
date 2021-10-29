import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class GraphQLResource {
    @Field(type => ID)
    id: string
}
