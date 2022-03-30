import {Args, Mutation, Query, Resolver} from "@nestjs/graphql"
import {Zhihu} from "./models/zhihu.model"
import {ZhihuService} from "./zhihu.service"
import {ZhihuVideo} from "./models/zhihu.video.model";
import { plainToClass } from 'class-transformer'

@Resolver(of => Zhihu)
export class ZhihuResolver {
    constructor(private readonly zhihuService: ZhihuService) {
    }


    @Mutation(returns => Zhihu)
    async draftColumnArticle() {
        return this.zhihuService.draftColumnArticle()
    }

    @Query(returns => ZhihuVideo)
    async getVideoInfoByUrl(@Args('zvideoUrl') zvideoUrl: string) {
        return plainToClass(ZhihuVideo,{first: {playUrl: await this.zhihuService.getVideoPlayUrlByVideoPage(zvideoUrl)}})
    }
}
