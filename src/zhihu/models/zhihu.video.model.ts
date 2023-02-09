import {Field, ObjectType} from "@nestjs/graphql"

@ObjectType()
export class ZhihuVideoInfo {
    @Field(type => String)
    playUrl: string
}
