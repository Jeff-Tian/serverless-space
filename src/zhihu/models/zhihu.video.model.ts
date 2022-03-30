import {Field, ObjectType} from "@nestjs/graphql"

@ObjectType()
export class ZhihuVideo {
    @Field(()=>VideoInfo)
    first: VideoInfo
}

@ObjectType()
export class VideoInfo {
    @Field(type => String)
    playUrl: string
}