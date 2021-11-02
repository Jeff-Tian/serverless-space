import {Field, ID, ObjectType} from "@nestjs/graphql"

@ObjectType()
export class Zhihu {
    @Field(type => ID)
    id: string
}
