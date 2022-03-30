import {Field, ObjectType} from "@nestjs/graphql"

@ObjectType()
export class VideoInfo {
    @Field(type => String)
    playUrl: string
}

@ObjectType()
export class ZhihuVideo {
    @Field(()=>VideoInfo)
    first: VideoInfo
}