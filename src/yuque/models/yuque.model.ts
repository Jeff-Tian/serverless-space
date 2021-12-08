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
    updated_at: string

    @Field()
    created_at: string

    @Field(type => ID)
    slug: string

    @Field()
    word_count: number

    @Field({nullable: true})
    cover?: string

    @Field()
    body: string

    @Field({nullable: true})
    body_html?: string
}
