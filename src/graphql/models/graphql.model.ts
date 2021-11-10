import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class GraphQLResource {
    @Field(type => ID)
    id: string

    @Field(() => String, {nullable: true})
    typeName: string

    @Field(() => String, {nullable: true})
    fieldName: string
}
