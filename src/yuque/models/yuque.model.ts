import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class YuQue {
    @Field(type => ID)
    id: string

    @Field()
    title: string

    @Field()
    description: string

    @Field()
    custom_description: string

    @Field()
    updated_at: Date

    @Field()
    created_at: Date

    @Field(type => ID)
    slug: string

    @Field()
    word_count: number

    @Field()
    cover: string

    @Field()
    body: string
}
